"""
bulk_score.py
=============
Calcula y carga scores para todos los usuarios que aún no tienen LeadScore.

POR QUÉ EXISTE:
  load_seed_data.py inserta datos directo en DB vía COPY, saltando el Backend C#.
  Por eso LeadScores queda vacío. Este script lo llena aplicando el mismo
  algoritmo de scoring que usa la FastAPI, sin pasar por HTTP.

ESTRATEGIA:
  1. Lee Users + Interactions con 2 queries SQL (psycopg2)
  2. Agrupa interacciones por UserId en memoria
  3. Aplica LeadScoring (mismo módulo que usa la FastAPI)
  4. Exporta resultados a CSV temporal
  5. Carga en LeadScores vía psql \\copy (bulk, ~segundos)

USO:
  cd equine-lead/
  PYTHONPATH=src/data-science ./venv/bin/python3 src/data-science/scripts/bulk_score.py

  # Solo usuarios sin score (por defecto)
  PYTHONPATH=src/data-science ./venv/bin/python3 src/data-science/scripts/bulk_score.py

  # Recalcular TODOS (sobreescribe existentes)
  PYTHONPATH=src/data-science ./venv/bin/python3 src/data-science/scripts/bulk_score.py --overwrite

OPCIONES:
  --host       Host PostgreSQL (default: localhost)
  --port       Puerto (default: 5432)
  --db         Nombre de la DB (default: NoCountryE48DB)
  --user       Usuario (default: postgres)
  --password   Contraseña (default: lee de .env o postgres123)
  --container  Nombre del contenedor Docker (default: equine-postgres)
  --overwrite  Si se pasa, recalcula scores aunque ya existan
"""

import sys
import argparse
import subprocess
import tempfile
import csv
from pathlib import Path
from datetime import datetime, timezone

# Importar el motor de scoring (mismo que usa la FastAPI)
try:
    from model.lead_scoring import LeadScoring
except ImportError:
    print("❌ Error: no se puede importar 'model.lead_scoring'.")
    print("   Ejecutá con: PYTHONPATH=src/data-science ./venv/bin/python3 ...")
    sys.exit(1)

try:
    import psycopg2
    import psycopg2.extras
except ImportError:
    print("❌ Error: psycopg2 no está instalado.")
    print("   Ejecutá: ./venv/bin/pip install psycopg2-binary")
    sys.exit(1)

# ─── CONFIGURACIÓN ────────────────────────────────────────────────────────────
ENV_FILE = Path(".env")
SCORE_VERSION = "v1-rule-based"

# Mapeo DB → LeadScoring (UserType en DB es int: 1=B2C, 2=B2B)
USER_TYPE_MAP = {1: "B2C", 2: "B2B"}

# Mapeo clasificación texto → int (1=Cold, 2=Warm, 3=Hot)
CLASS_MAP = {"Cold": 1, "Warm": 2, "Hot": 3}


def read_env_password() -> str:
    if ENV_FILE.exists():
        from dotenv import dotenv_values
        return dotenv_values(ENV_FILE).get("POSTGRES_PASSWORD", "postgres123")
    return "postgres123"


def connect_db(cfg: dict):
    return psycopg2.connect(
        host=cfg["host"], port=cfg["port"],
        dbname=cfg["db"], user=cfg["user"], password=cfg["password"]
    )


def load_users(cur) -> dict:
    """Lee todos los usuarios. Retorna dict {UserId: {type, budget, created_at}}."""
    cur.execute("""
        SELECT "UserId", "UserType", "UserBudget", "UserCreatedAt"
        FROM "Users"
    """)
    users = {}
    for uid, utype, budget, created in cur.fetchall():
        users[uid] = {
            "type":       USER_TYPE_MAP.get(utype, "B2C"),
            "budget":     float(budget),
            "created_at": created,
        }
    return users


def load_interactions(cur) -> dict:
    """Lee todas las interacciones. Retorna dict {UserId: [{"type":int, "date":datetime}]}."""
    cur.execute("""
        SELECT "UserId", "InteractionType", "InteractionDate"
        FROM "LeadInteractions"
        ORDER BY "UserId", "InteractionDate"
    """)
    interactions: dict = {}
    for uid, itype, idate in cur.fetchall():
        if uid not in interactions:
            interactions[uid] = []
        # Asegurar timezone-aware para el cálculo de inactividad
        if idate.tzinfo is None:
            idate = idate.replace(tzinfo=timezone.utc)
        interactions[uid].append({"type": itype, "date": idate})
    return interactions


def load_scored_users(cur) -> set:
    """Retorna set de UserId que ya tienen LeadScore."""
    cur.execute('SELECT DISTINCT "UserId" FROM "LeadScores"')
    return {row[0] for row in cur.fetchall()}


def score_all(users: dict, interactions: dict, already_scored: set, overwrite: bool) -> list:
    """
    Aplica LeadScoring a cada usuario.
    Retorna lista de (UserId, LeadScoreValue, LeadScoreClassification, LeadScoreDate, version)
    """
    results = []
    now = datetime.now(timezone.utc)
    skipped = 0

    for uid, user in users.items():
        if not overwrite and uid in already_scored:
            skipped += 1
            continue

        user_interactions = interactions.get(uid, [])
        lead = LeadScoring(
            user_type=user["type"],
            user_budget=user["budget"],
            interactions=user_interactions,
        )
        score_value = lead.calculate_score()
        classification = lead.get_classification()

        # Usar la fecha de la última interacción como fecha del score
        # para que la gráfica de evolución muestre datos históricos reales
        score_date = now
        if user_interactions:
            score_date = max(i["date"] for i in user_interactions)
        elif user["created_at"]:
             score_date = user["created_at"]
             if score_date.tzinfo is None:
                 score_date = score_date.replace(tzinfo=timezone.utc)

        results.append((
            uid,
            score_value,
            CLASS_MAP[classification],
            score_date.isoformat(),
            SCORE_VERSION,
        ))

    if skipped:
        print(f"   ⏭️  {skipped:,} usuarios ya tenían score (usar --overwrite para recalcular)")

    return results


def write_csv_and_load(scores: list, cfg: dict, container: str) -> bool:
    """Escribe scores a un CSV temporal y los carga con psql \\copy vía docker exec."""
    with tempfile.NamedTemporaryFile(
        mode="w", suffix=".csv", delete=False, newline=""
    ) as tmp:
        writer = csv.writer(tmp)
        writer.writerow(["UserId", "LeadScoreValue", "LeadScoreClassification",
                          "LeadScoreDate", "ScoreModelVersion"])
        writer.writerows(scores)
        tmp_path = Path(tmp.name)

    columns = ('"UserId","LeadScoreValue","LeadScoreClassification",'
               '"LeadScoreDate","ScoreModelVersion"')
    copy_cmd = f'\\copy "LeadScores" ({columns}) FROM STDIN CSV HEADER NULL \'\';'

    docker_cmd = [
        "docker", "exec", "-i", container,
        "psql", f"--username={cfg['user']}", f"--dbname={cfg['db']}",
        "--command", copy_cmd,
    ]

    with open(tmp_path, "r") as f:
        result = subprocess.run(docker_cmd, stdin=f, capture_output=True, text=True)

    tmp_path.unlink(missing_ok=True)

    if result.returncode != 0:
        print(f"   ❌ Error al cargar scores:\n{result.stderr.strip()}")
        return False
    return True


def main():
    parser = argparse.ArgumentParser(description="Bulk scoring para todos los usuarios de EquineLead.")
    parser.add_argument("--host",      default="localhost",       help="Host PostgreSQL")
    parser.add_argument("--port",      default="5432",            help="Puerto PostgreSQL")
    parser.add_argument("--db",        default="NoCountryE48DB",  help="Nombre de la DB")
    parser.add_argument("--user",      default="postgres",        help="Usuario PostgreSQL")
    parser.add_argument("--password",  default=None,              help="Contraseña")
    parser.add_argument("--container", default="equine-postgres", help="Contenedor Docker")
    parser.add_argument("--overwrite", action="store_true",
                        help="Recalcular scores aunque ya existan")
    args = parser.parse_args()

    cfg = {
        "host":     args.host,
        "port":     args.port,
        "db":       args.db,
        "user":     args.user,
        "password": args.password or read_env_password(),
    }

    print("🐴 EquineLead — Bulk Lead Scoring")
    print("=" * 50)
    print(f"   Motor:     {SCORE_VERSION}")
    print(f"   Contenedor: {args.container}")
    print(f"   Overwrite: {'Sí' if args.overwrite else 'No (solo usuarios sin score)'}")
    print()

    # ── Leer datos ────────────────────────────────────────────────────────────
    print("📖 Leyendo datos de la DB...")
    try:
        conn = connect_db(cfg)
    except Exception as e:
        print(f"❌ No se pudo conectar a la DB: {e}")
        print("   Asegurate de que la DB está corriendo y las credenciales son correctas.")
        sys.exit(1)

    with conn.cursor() as cur:
        users        = load_users(cur)
        interactions = load_interactions(cur)
        scored_users = load_scored_users(cur)

    conn.close()
    print(f"   ✅ {len(users):,} usuarios")
    print(f"   ✅ {sum(len(v) for v in interactions.values()):,} interacciones")
    print(f"   ✅ {len(scored_users):,} usuarios ya tienen score")

    # ── Calcular scores ───────────────────────────────────────────────────────
    print("\n🧮 Calculando scores...")
    scores = score_all(users, interactions, scored_users, args.overwrite)

    if not scores:
        print("   ✅ Nada que calcular. Todos los usuarios ya tienen score.")
        return

    print(f"   ✅ {len(scores):,} scores calculados")

    # Resumen de distribución
    dist = {1: 0, 2: 0, 3: 0}
    for _, _, cls, _, _ in scores:
        dist[cls] += 1
    total = len(scores)
    print(f"   Cold: {dist[1]:,} ({dist[1]/total*100:.1f}%) | "
          f"Warm: {dist[2]:,} ({dist[2]/total*100:.1f}%) | "
          f"Hot: {dist[3]:,} ({dist[3]/total*100:.1f}%)")

    # ── Si hay overwrite, limpiar existentes primero ──────────────────────────
    if args.overwrite and scored_users:
        print("\n🧹 Limpiando scores existentes...")
        docker_cmd = [
            "docker", "exec", "-i", args.container,
            "psql", f"--username={cfg['user']}", f"--dbname={cfg['db']}",
            "--command", 'TRUNCATE TABLE "LeadScores" RESTART IDENTITY;'
        ]
        subprocess.run(docker_cmd, capture_output=True)
        print("   ✅ Scores anteriores eliminados.")

    # ── Cargar scores en DB ───────────────────────────────────────────────────
    print("\n💾 Cargando scores en LeadScores...")
    ok = write_csv_and_load(scores, cfg, args.container)
    if ok:
        print(f"   ✅ {len(scores):,} scores cargados exitosamente.")
        print("\n🎉 ¡Bulk scoring completado!")
        print("   Verifica con:")
        print('   sudo docker exec equine-postgres psql -U postgres -d NoCountryE48DB -c \'SELECT COUNT(*) FROM "LeadScores";\'')
    else:
        sys.exit(1)


if __name__ == "__main__":
    main()

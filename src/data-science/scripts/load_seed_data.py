"""
load_seed_data.py
=================
Carga los CSVs sintéticos en la base de datos PostgreSQL de EquineLead.

PRERREQUISITO:
  Ejecutar primero generate_seed_data.py para generar los CSVs:
    PYTHONPATH=src/data-science ./venv/bin/python3 src/data-science/scripts/generate_seed_data.py

MODOS DE USO:
  # Hito 1: DB corriendo localmente (PostgreSQL en Docker standalone o nativo)
  python src/data-science/scripts/load_seed_data.py --mode local

  # Hito 2: DB dentro de Docker Compose (contenedor llamado 'equine-postgres')
  python src/data-science/scripts/load_seed_data.py --mode docker

OPCIONES AVANZADAS:
  --host       Host de la DB (default: localhost)
  --port       Puerto de la DB (default: 5432)
  --db         Nombre de la DB (default: NoCountryE48DB)
  --user       Usuario de la DB (default: postgres)
  --password   Contraseña (default: lee de .env o usa 'postgres123')
  --container  Nombre del contenedor Docker (default: equine-postgres)
  --csv-dir    Directorio de los CSVs (default: docs/data/synthetic)

ESTRATEGIA DE INSERCIÓN:
  Usa el comando psql con '\\copy' (cliente), que lee los archivos desde la
  máquina HOST y los envía al servidor. Esto funciona igual en ambos modos
  porque el archivo siempre está en el host (no dentro del contenedor).

  Orden de inserción: Products → Users → LeadInteractions
  (respeta las Foreign Keys)

NOTAS DE RENDIMIENTO:
  100k usuarios + ~300k interacciones:
  - Generación CSV:   ~30 segundos
  - Carga SQL COPY:   ~60-120 segundos
  - Total estimado:   ~3 minutos
"""

import argparse
import subprocess
import sys
import os
from pathlib import Path
from dotenv import dotenv_values  # pip install python-dotenv

# ─── CONFIGURACIÓN POR DEFECTO ────────────────────────────────────────────────
CSV_DIR    = Path("docs/data/synthetic")
ENV_FILE   = Path(".env")

# Los CSVs incluyen la columna ID (referencial). Se incluye en el COPY para que
# los datos coincidan con el número de columnas del archivo.
# Después de la carga se resetean las secuencias (ver SEQUENCE_RESETS).
TABLES = [
    # (csv_file, table_name, all_columns_in_csv_order)
    ("products.csv",     '"Products"',
     '"ProductId","ProductName","ProductPrice","ProductCategory"'),
    ("users.csv",        '"Users"',
     '"UserId","UserName","UserType","UserBudget","UserPhone","UserEmail","UserCity","UserCreatedAt"'),
    ("interactions.csv", '"LeadInteractions"',
     '"InteractionId","UserId","ProductId","InteractionSource","InteractionType","InteractionDate","InteractionMetadataJson"'),
]

# Resetear secuencias después de cargar IDs explícitos
SEQUENCE_RESETS = [
    'SELECT setval(pg_get_serial_sequence(\'"Products"\', \'ProductId\'), COALESCE(MAX("ProductId"), 1)) FROM "Products";',
    'SELECT setval(pg_get_serial_sequence(\'"Users"\', \'UserId\'), COALESCE(MAX("UserId"), 1)) FROM "Users";',
    'SELECT setval(pg_get_serial_sequence(\'"LeadInteractions"\', \'InteractionId\'), COALESCE(MAX("InteractionId"), 1)) FROM "LeadInteractions";',
]


def read_env_password() -> str:
    """Lee la contraseña desde .env en la raíz del proyecto."""
    if ENV_FILE.exists():
        env = dotenv_values(ENV_FILE)
        return env.get("POSTGRES_PASSWORD", "postgres123")
    return "postgres123"


def run_copy_local(csv_path: Path, table: str, columns: str, cfg: dict) -> bool:
    """
    Ejecuta psql \\copy desde el host hacia un PostgreSQL local/remoto.
    El archivo CSV se lee desde el sistema de archivos del HOST.
    """
    copy_cmd = f"\\copy {table} ({columns}) FROM STDIN CSV HEADER NULL '';"
    psql_cmd = [
        "psql",
        f"--host={cfg['host']}",
        f"--port={cfg['port']}",
        f"--username={cfg['user']}",
        f"--dbname={cfg['db']}",
        "--command", copy_cmd,
    ]
    env = os.environ.copy()
    env["PGPASSWORD"] = cfg["password"]

    with open(csv_path, "r") as f:
        result = subprocess.run(psql_cmd, stdin=f, env=env, capture_output=True, text=True)

    if result.returncode != 0:
        print(f"   ❌ Error:\n{result.stderr.strip()}")
        return False
    return True


def run_copy_docker(csv_path: Path, table: str, columns: str, cfg: dict) -> bool:
    """
    Ejecuta psql \\copy dentro de un contenedor Docker.
    El CSV se pasa por stdin desde el host (docker exec -i), sin necesidad
    de copiar el archivo dentro del contenedor.
    """
    copy_cmd = f"\\copy {table} ({columns}) FROM STDIN CSV HEADER NULL '';"
    docker_cmd = [
        "docker", "exec", "-i", cfg["container"],
        "psql",
        f"--username={cfg['user']}",
        f"--dbname={cfg['db']}",
        "--command", copy_cmd,
    ]

    with open(csv_path, "r") as f:
        result = subprocess.run(docker_cmd, stdin=f, capture_output=True, text=True)

    if result.returncode != 0:
        print(f"   ❌ Error:\n{result.stderr.strip()}")
        return False
    return True


def main():
    parser = argparse.ArgumentParser(
        description="Carga datasets sintéticos en PostgreSQL (EquineLead).",
        epilog="""
Ejemplos:
  python load_seed_data.py --mode local
  python load_seed_data.py --mode docker
  python load_seed_data.py --mode local --host 44.202.43.214 --password MyPwd
        """,
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument("--mode",      choices=["local", "docker"], required=True,
                        help="'local' = psql directo | 'docker' = via docker exec")
    parser.add_argument("--host",      default="localhost",      help="Host PostgreSQL (default: localhost)")
    parser.add_argument("--port",      default="5432",           help="Puerto PostgreSQL (default: 5432)")
    parser.add_argument("--db",        default="NoCountryE48DB", help="Nombre de la base de datos")
    parser.add_argument("--user",      default="postgres",       help="Usuario PostgreSQL")
    parser.add_argument("--password",  default=None,             help="Contraseña (default: lee de .env)")
    parser.add_argument("--container", default="equine-postgres",help="Nombre del contenedor Docker (solo --mode docker)")
    parser.add_argument("--csv-dir",   default=str(CSV_DIR),     help=f"Directorio de los CSVs (default: {CSV_DIR})")
    args = parser.parse_args()

    csv_dir  = Path(args.csv_dir)
    password = args.password or read_env_password()

    cfg = {
        "host":      args.host,
        "port":      args.port,
        "db":        args.db,
        "user":      args.user,
        "password":  password,
        "container": args.container,
    }

    print("🐴 EquineLead - Cargador de Datos Sintéticos")
    print("=" * 50)
    print(f"   Modo:      {args.mode.upper()}")
    if args.mode == "docker":
        print(f"   Contenedor: {cfg['container']}")
    else:
        print(f"   Host:       {cfg['host']}:{cfg['port']}")
    print(f"   Base datos: {cfg['db']}")
    print(f"   CSV dir:    {csv_dir}")
    print()

    # Limpiar datos existentes antes de cargar (respetar orden FK)
    print("🧹 Limpiando datos existentes (TRUNCATE en orden FK)...")
    truncate_sql = 'TRUNCATE TABLE "LeadInteractions", "LeadScores", "Users", "Products" RESTART IDENTITY CASCADE;'
    if args.mode == "local":
        tc = ["psql", f"--host={cfg['host']}", f"--port={cfg['port']}",
              f"--username={cfg['user']}", f"--dbname={cfg['db']}", "--command", truncate_sql]
        te = os.environ.copy(); te["PGPASSWORD"] = cfg["password"]
        tr = subprocess.run(tc, env=te, capture_output=True, text=True)
    else:
        tc = ["docker", "exec", "-i", cfg["container"],
              "psql", f"--username={cfg['user']}", f"--dbname={cfg['db']}", "--command", truncate_sql]
        tr = subprocess.run(tc, capture_output=True, text=True)
    if tr.returncode != 0:
        print(f"   ⚠️  TRUNCATE falló: {tr.stderr.strip()}")
    else:
        print("   ✅ Tablas limpiadas.\n")

    errors = []
    for csv_file, table, columns in TABLES:
        csv_path = csv_dir / csv_file
        if not csv_path.exists():
            print(f"⚠️  {csv_file} no encontrado. Ejecuta generate_seed_data.py primero.")
            errors.append(csv_file)
            continue

        size_mb = csv_path.stat().st_size / 1_048_576
        print(f"📥 Cargando {csv_file} ({size_mb:.1f} MB) → {table}...")

        if args.mode == "local":
            ok = run_copy_local(csv_path, table, columns, cfg)
        else:
            ok = run_copy_docker(csv_path, table, columns, cfg)

        if ok:
            print(f"   ✅ OK")
        else:
            errors.append(csv_file)

    print()
    if not errors:
        print("🔄 Reseteando secuencias de auto-incremento...")
        for sql in SEQUENCE_RESETS:
            if args.mode == "local":
                psql_cmd = ["psql", f"--host={cfg['host']}", f"--port={cfg['port']}",
                            f"--username={cfg['user']}", f"--dbname={cfg['db']}", "--command", sql]
                env = os.environ.copy(); env["PGPASSWORD"] = cfg["password"]
                r = subprocess.run(psql_cmd, env=env, capture_output=True, text=True)
            else:
                docker_cmd = ["docker", "exec", "-i", cfg["container"],
                              "psql", f"--username={cfg['user']}", f"--dbname={cfg['db']}", "--command", sql]
                r = subprocess.run(docker_cmd, capture_output=True, text=True)
            if r.returncode != 0:
                print(f"   ⚠️  Secuencia no reseteada: {r.stderr.strip()}")

        print("🎉 Carga completada sin errores.")
        print("   Verifica en Swagger: http://localhost:5286/swagger")
    else:
        print(f"❌ Hubo errores en: {', '.join(errors)}")
        print("   Revisa los mensajes anteriores para más detalles.")
        sys.exit(1)


if __name__ == "__main__":
    main()

"""
generate_seed_data.py
=====================
Generador de datos sintéticos para poblar la base de datos de EquineLead.

Genera CSVs con el esquema EXACTO del Backend C#.
Tiempo estimado: 20-40 segundos para 100k usuarios.

SALIDA:
  docs/data/synthetic/
  ├── products.csv       → Tabla: Products    (50 productos)
  ├── users.csv          → Tabla: Users       (100k usuarios)
  └── interactions.csv   → Tabla: LeadInteractions (~300k interacciones)

USO:
  cd equine-lead/
  PYTHONPATH=src/data-science ./venv/bin/python3 src/data-science/scripts/generate_seed_data.py
"""

import numpy as np
import pandas as pd
from pathlib import Path

# ─── CONFIGURACIÓN ────────────────────────────────────────────────────────────
NUM_USERS        = 100_000
NUM_PRODUCTS     = 50
MIN_INTERACTIONS = 1
MAX_INTERACTIONS = 5
OUTPUT_DIR       = Path("docs/data/synthetic")
SEED             = 42

rng = np.random.default_rng(SEED)

# ─── CATÁLOGOS ────────────────────────────────────────────────────────────────
# Valores enteros alineados con C# Enums (src/backend-csharp/Enums/)
# InteractionSourceEnum: Facebook=1,Instagram=2,Formulario=3,Web=4,Evento=5,Otro=6
SOURCES = np.array([1, 2, 3, 4, 5, 6])

# Pesos realistas de fuentes (ej: Instagram y Web dominan, Evento es mínimo)
SRC_WEIGHTS = np.array([15, 40, 10, 25, 5, 5], dtype=float)
SRC_WEIGHTS /= SRC_WEIGHTS.sum()

# InteractionTypeEnum: View=1,Click=2,Download=3,Consult=4,ContactRequest=5
TYPES   = np.array([1, 2, 3, 4, 5])
WEIGHTS = np.array([4, 3, 2, 2, 1], dtype=float)
WEIGHTS /= WEIGHTS.sum()

FIRST = ["Juan", "Maria", "Carlos", "Ana", "Luis", "Valeria", "Diego", "Sofia",
         "Andres", "Camila", "Jorge", "Isabella", "Sebastian", "Valentina", "Felipe",
         "Laura", "Alejandro", "Daniela", "Ricardo", "Paula", "Martin", "Lucia"]
LAST  = ["Garcia", "Rodriguez", "Lopez", "Martinez", "Gonzalez", "Perez",
         "Sanchez", "Ramirez", "Torres", "Flores", "Rivera", "Gomez", "Herrera"]
CITIES= ["Bogota", "Medellin", "Cali", "Barranquilla", "Lima", "Santiago",
         "Buenos Aires", "Caracas", "Quito", "Ciudad de Mexico", "Montevideo"]
DOMS  = ["gmail.com", "hotmail.com", "yahoo.com", "outlook.com", "empresa.com"]

PRODUCT_CATALOG = [
    ("Silla de Montar Premium Cuero", 1200.00, "Equipamiento"),
    ("Silla de Trabajo Western", 850.00, "Equipamiento"),
    ("Silla de Salto Competencia", 1800.00, "Equipamiento"),
    ("Silla de Doma Clasica", 2200.00, "Equipamiento"),
    ("Estribos de Aluminio Ligero", 120.00, "Equipamiento"),
    ("Estribos de Acero Inoxidable", 85.00, "Equipamiento"),
    ("Estribos de Seguridad Plegables", 175.00, "Equipamiento"),
    ("Cinchon de Neopreno", 65.00, "Equipamiento"),
    ("Cinchon de Cuero Trenzado", 140.00, "Equipamiento"),
    ("Sudadero de Gel Antichoques", 95.00, "Equipamiento"),
    ("Brida de Competencia Cuero Italiano", 350.00, "Accesorios"),
    ("Brida de Doma Completa", 420.00, "Accesorios"),
    ("Cabezada de Cuero con Frontalera", 210.00, "Accesorios"),
    ("Cabezada de Cuadra Nylon", 35.00, "Accesorios"),
    ("Mordico Loose Ring Acero", 55.00, "Accesorios"),
    ("Mordico Pelham Cromado", 80.00, "Accesorios"),
    ("Filete de Goma Suave", 45.00, "Accesorios"),
    ("Riendas de Cuero Cosidas", 110.00, "Accesorios"),
    ("Riendas de Goma Antideslizante", 60.00, "Accesorios"),
    ("Trensilla de Pelota", 75.00, "Accesorios"),
    ("Casco Certificado ASTM/SEI", 320.00, "Seguridad"),
    ("Casco de Competencia Ventilado", 480.00, "Seguridad"),
    ("Chaleco Protector Nivel 3", 280.00, "Seguridad"),
    ("Chaleco de Airbag Ecuestre", 750.00, "Seguridad"),
    ("Protectores de Canilla Delantera", 90.00, "Seguridad"),
    ("Protectores de Tendones Neopreno", 75.00, "Seguridad"),
    ("Mascarilla Antimoscas", 28.00, "Seguridad"),
    ("Polainas de Cuero", 180.00, "Seguridad"),
    ("Bota de Cuero Profesional", 450.00, "Vestimenta"),
    ("Bota de Campo Caucho", 95.00, "Vestimenta"),
    ("Bota de Paddock Cuero", 200.00, "Vestimenta"),
    ("Pantalon de Montar con Grip", 155.00, "Vestimenta"),
    ("Pantalon de Competencia Blanco", 185.00, "Vestimenta"),
    ("Guantes de Montar Cuero", 55.00, "Vestimenta"),
    ("Guantes de Competencia", 80.00, "Vestimenta"),
    ("Camisa de Polo Ecuestre", 75.00, "Vestimenta"),
    ("Chaqueta de Competencia Azul", 310.00, "Vestimenta"),
    ("Kit de Aseo Profesional 12 piezas", 85.00, "Cuidado"),
    ("Manta Termica 300g", 180.00, "Cuidado"),
    ("Manta de Lluvia Impermeable", 145.00, "Cuidado"),
    ("Manta de Viaje Polar", 120.00, "Cuidado"),
    ("Unguento Cicatrizante 500ml", 32.00, "Cuidado"),
    ("Shampu Blanqueador para Tordillos", 22.00, "Cuidado"),
    ("Vendas de Trabajo 4 unidades", 48.00, "Cuidado"),
    ("Vendas de Cuadra Polar", 42.00, "Cuidado"),
    ("Cabezada de Transporte Acolchada", 95.00, "Transporte"),
    ("Bolso de Montura Grande", 220.00, "Transporte"),
    ("Maleta de Equipamiento Rodante", 340.00, "Transporte"),
    ("Soportes de Silla de Pared x2", 58.00, "Transporte"),
    ("Funda de Silla Acolchada", 78.00, "Transporte"),
    ("Contenedor de Alimentacion 25L", 45.00, "Transporte"),
]

print("🐴 EquineLead - Generador de Datos Sintéticos")
print("=" * 60)

# ─── PRODUCTOS ────────────────────────────────────────────────────────────────
df_products = pd.DataFrame(
    [(i+1, n, p, c) for i, (n, p, c) in enumerate(PRODUCT_CATALOG[:NUM_PRODUCTS])],
    columns=["ProductId", "ProductName", "ProductPrice", "ProductCategory"]
)
print(f"✅ {len(df_products)} productos generados.")

# ─── USUARIOS ─────────────────────────────────────────────────────────────────
# Índices vectorizados con NumPy
fi = rng.integers(0, len(FIRST), NUM_USERS)
li = rng.integers(0, len(LAST),  NUM_USERS)
ci = rng.integers(0, len(CITIES),NUM_USERS)
di = rng.integers(0, len(DOMS),  NUM_USERS)

fn = pd.Series([FIRST[i] for i in fi])
ln = pd.Series([LAST[i]  for i in li])

# UserTypeEnum: B2C=1, B2B=2
user_types = rng.choice([1, 2], NUM_USERS)  # 1=B2C, 2=B2B
is_b2b = user_types == 2
budgets = np.where(is_b2b,
    rng.integers(10_000, 100_001, NUM_USERS),
    rng.integers(500, 20_001, NUM_USERS)).astype(float)

# Fechas concentradas en los últimos 4 meses (120 días) para ver tendencia
base_date = np.datetime64("2026-03-01", "D")
creation_days = rng.integers(0, 120, NUM_USERS)
created_dates = (base_date - creation_days.astype("timedelta64[D]")).astype(str)

# Teléfonos como strings
phone_nums = rng.integers(3_000_000_000, 3_220_000_000, NUM_USERS)

df_users = pd.DataFrame({
    "UserId":        np.arange(1, NUM_USERS + 1),
    "UserName":      fn + " " + ln,
    "UserType":      user_types,
    "UserBudget":    budgets,
    "UserPhone":     ["+57" + str(phone_nums[j]) for j in range(NUM_USERS)],
    "UserEmail":     [f"{fn[j].lower()}.{ln[j].lower()}@{DOMS[di[j]]}" for j in range(NUM_USERS)],
    "UserCity":      [CITIES[i] for i in ci],
    "UserCreatedAt": created_dates,
})
print(f"✅ {len(df_users):,} usuarios generados.")

# ─── INTERACCIONES ────────────────────────────────────────────────────────────
n_ints = rng.integers(MIN_INTERACTIONS, MAX_INTERACTIONS + 1, NUM_USERS)
total  = int(n_ints.sum())

rep_uids  = np.repeat(np.arange(1, NUM_USERS+1), n_ints)
prod_ids  = rng.integers(1, NUM_PRODUCTS+1, total)
src_idx   = rng.choice(len(SOURCES), total, p=SRC_WEIGHTS)
typ_idx   = rng.choice(len(TYPES), total, p=WEIGHTS)

# Interacciones también concentradas en los últimos 4 meses
int_days  = rng.integers(0, 120, total)
int_dates = (base_date - int_days.astype("timedelta64[D]")).astype(str)

df_int = pd.DataFrame({
    "InteractionId":           np.arange(1, total+1),
    "UserId":                  rep_uids,
    "ProductId":               prod_ids,
    "InteractionSource":       SOURCES[src_idx],
    "InteractionType":         TYPES[typ_idx],
    "InteractionDate":         int_dates,
    "InteractionMetadataJson": "",
})
print(f"✅ {total:,} interacciones generadas.")

# ─── EXPORTAR ─────────────────────────────────────────────────────────────────
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
print("\n💾 Exportando CSVs...")

p = OUTPUT_DIR / "products.csv";     df_products.to_csv(p, index=False)
u = OUTPUT_DIR / "users.csv";        df_users.to_csv(u, index=False)
i = OUTPUT_DIR / "interactions.csv"; df_int.to_csv(i, index=False)

print(f"📁 Archivos generados:")
print(f"   → {p}  ({p.stat().st_size/1e6:.1f} MB)")
print(f"   → {u}  ({u.stat().st_size/1e6:.1f} MB)")
print(f"   → {i}  ({i.stat().st_size/1e6:.1f} MB)")
print(f"\n   Cargar: python src/data-science/scripts/load_seed_data.py --mode local")

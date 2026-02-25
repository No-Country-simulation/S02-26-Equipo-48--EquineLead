import random
import pandas as pd
from datetime import datetime, timedelta, timezone
from model.lead_scoring import LeadScoring
import matplotlib.ticker as ticker

# Configuración de Matplotlib para visualización gráfica
import matplotlib
matplotlib.use("TkAgg") # Backend necesario para entornos Linux con interfaz gráfica
import matplotlib.pyplot as plt

# --- CONFIGURACIÓN DE LA SIMULACIÓN ---
num_leads = 100 # Cantidad configurable de leads a simular
user_types = ["B2B", "B2C"]
interaction_types = [1, 2, 3, 4, 5] # 1: Visita, 2: Click, 3: Registro, 4: Consulta, 5: Contacto

leads_data = []

print(f"🚀 Generando simulación de {num_leads} leads...")

# Generar perfiles de leads aleatorios para probar la robustez del modelo
for i in range(num_leads):
    user_type = random.choice(user_types)
    user_budget = random.randint(100, 60000) # Presupuesto entre 100 y 60,000 USD

    interactions = []

    # Generar de 1 a 4 interacciones aleatorias por cada lead
    for _ in range(random.randint(1, 4)):
        interaction = {
            "type": random.choices(
                interaction_types,
                weights=[4, 3, 2, 1, 1]  # Sesgo: más visitas y clicks que contactos directos
            )[0],
            "date": datetime.now(timezone.utc) - timedelta(days=random.randint(1, 400)) # Entre ayer y hace 400 días
        }
        interactions.append(interaction)

    # --- PROCESAMIENTO CON EL MOTOR DE SCORING ---
    lead = LeadScoring(user_type, user_budget, interactions)
    score = lead.calculate_score()
    classification = lead.get_classification()

    # Guardar resultados para análisis posterior con Pandas
    leads_data.append({
        "UserType": user_type,
        "Budget": user_budget,
        "Interactions": len(interactions),
        "InteractionDetail": ", ".join([str(i["type"]) for i in interactions]),
        "Score": score,
        "Classification": classification
    })

# Convertir la lista a un DataFrame de Pandas para análisis tabular
df = pd.DataFrame(leads_data)

# --- RESULTADOS EN CONSOLA ---
print("\n📊 Muestra de los primeros 10 leads generados:")
print(df.head(10))

print("\n📈 Resumen estadístico de la clasificación:")
print(df["Classification"].value_counts())

# --- VISUALIZACIÓN GRÁFICA ---

# 1. Histograma: Distribución de Scores
# PROPÓSITO: Ver la frecuencia de los puntajes. 
plt.figure(figsize=(8,5))
plt.hist(df['Score'], bins=10, color='skyblue', edgecolor='black')
plt.title(f'Distribución de Score de Leads (Simulación {num_leads} muestras)')
plt.xlabel('Puntaje (Score)')
plt.ylabel('Cantidad de Leads')
plt.gca().yaxis.set_major_locator(ticker.MaxNLocator(integer=True)) # Forzar números enteros en el eje Y
plt.grid(axis='y', linestyle='--', alpha=0.7)
plt.show()

# 2. Gráfico de Barras: Comparativa Cold / Warm / Hot
# PROPÓSITO: Visualizar cuántos leads caen en cada categoría lógica. 
plt.figure(figsize=(6,4))
classification_counts = df['Classification'].value_counts()
classification_counts.plot(kind='bar', color=['red','orange','green']) # Orden: Cold, Warm, Hot
plt.title(f'Leads por Clasificación Final (n={num_leads})')
plt.xlabel('Categoría')
plt.ylabel('Cantidad')
plt.gca().yaxis.set_major_locator(ticker.MaxNLocator(integer=True)) # Forzar números enteros en el eje Y
plt.xticks(rotation=0)
plt.show()

# 3. Boxplot: Distribución de Scores por Clasificación
# PROPÓSITO: Ver si los rangos de score están bien definidos para cada categoría.
plt.figure(figsize=(8,5))
df.boxplot(column='Score', by='Classification', patch_artist=True, 
           boxprops=dict(facecolor="lightblue"))
plt.title(f'Distribución de Scores por Categoría (n={num_leads})')
plt.suptitle("") 
plt.xlabel('Clasificación')
plt.ylabel('Puntaje (Score)')
plt.show()
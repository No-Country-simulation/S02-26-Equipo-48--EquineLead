import random
import pandas as pd
from datetime import datetime, timedelta
from model.lead_scoring import LeadScoring

import matplotlib
matplotlib.use("TkAgg")
import matplotlib.pyplot as plt


# Posibles valores
user_types = ["B2B", "B2C"]
interaction_types = [1, 2, 3, 4, 5]


leads_data = []

for i in range(20):
    user_type = random.choice(user_types)
    user_budget = random.randint(100, 60000)

    interactions = []

    # Mayor variabilidad en cantidad de interacciones
    for _ in range(random.randint(1, 4)):
        interaction = {
            "type": random.choices(
                interaction_types,
                weights=[4, 3, 2, 1, 1]  # más probabilidad de visitas y clicks
            )[0],
            "date": datetime.now() - timedelta(days=random.randint(1, 400))
        }

        interactions.append(interaction)

    lead = LeadScoring(user_type, user_budget, interactions)
    score = lead.calculate_score()
    classification = lead.get_classification()

    leads_data.append({
        "UserType": user_type,
        "Budget": user_budget,
        "Interactions": len(interactions),
        "InteractionDetail": ", ".join([str(i["type"]) for i in interactions]),
        "Score": score,
        "Classification": classification
    })

df = pd.DataFrame(leads_data)

print(df)
print("\nDistribución de Leads:")
print(df["Classification"].value_counts())

import matplotlib.pyplot as plt

# Histograma de Scores
plt.figure(figsize=(8,5))
plt.hist(df['Score'], bins=10, color='skyblue', edgecolor='black')
plt.title('Distribución de Score de Leads')
plt.xlabel('Score')
plt.ylabel('Cantidad de Leads')
plt.grid(axis='y', linestyle='--', alpha=0.7)
plt.show()

# Gráfico de barras por Clasificación
plt.figure(figsize=(6,4))
df['Classification'].value_counts().plot(kind='bar', color=['green','orange','red'])
plt.title('Leads por Clasificación')
plt.xlabel('Clasificación')
plt.ylabel('Cantidad de Leads')
plt.xticks(rotation=0)
plt.show()
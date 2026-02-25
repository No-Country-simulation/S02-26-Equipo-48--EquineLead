from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from datetime import datetime, timezone

# Importamos el motor de lógica (LeadScoring)
from model.lead_scoring import LeadScoring

# Inicialización de la aplicación FastAPI con título descriptivo
app = FastAPI(title="EquineLead Scoring API v1")

# Endpoint de Bienvenida (Root): Útil para saludar al sistema y verificar que está online
@app.get("/")
def read_root():
    return {
        "message": "EquineLead Scoring API is running",
        "endpoints": {
            "calculate_score": "/api/v1/scoring/calculate",
            "documentation": "/docs"
        },
        "version": "v1.0"
    }


# Modelo de datos para una interacción individual (Input del Backend)
class Interaction(BaseModel):
    interactionType: int      # 1=Visita, 2=Click, 3=Registro, 4=Consulta, 5=Contacto
    interactionDate: datetime # Fecha histórica de la acción


# Estructura completa de la petición de Scoring (Contrato acordado con Backend)
class ScoringRequest(BaseModel):
    userId: str
    userType: str             # "B2B" o "B2C"
    userBudget: float         # Presupuesto declarado
    createdAt: datetime       # Fecha de creación del usuario
    interactions: List[Interaction] # Lista histórica de acciones


# Endpoint Principal: Procesa los datos y devuelve el cálculo final
@app.post("/api/v1/scoring/calculate")
def calculate_score(request: ScoringRequest):
    """
    Recibe los datos del lead desde el Backend y aplica el modelo de Scoring.
    """

    # 1. Adaptar el formato de interacciones para el motor LeadScoring
    formatted_interactions = [
        {
            "type": interaction.interactionType,
            "date": interaction.interactionDate
        }
        for interaction in request.interactions
    ]

    # 2. Instanciar la lógica de negocio con los datos del request
    lead = LeadScoring(
        user_type=request.userType,
        user_budget=request.userBudget,
        interactions=formatted_interactions
    )

    # 3. Ejecutar los cálculos (Puntos por interacción + Budget + Tipo - Penalización)
    score = lead.calculate_score()
    classification_label = lead.get_classification()

    # 4. Mapear clasificación textual a valores numéricos según contrato SQL (Isabel)
    classification_map = {
        "Cold": 1,
        "Warm": 2,
        "Hot": 3
    }

    # 5. Retornar el resultado alineado al contrato RESPONSE: Data Science -> Backend
    return {
        "userId": request.userId,
        "leadScoreValue": score,
        "leadScoreClassification": classification_map[classification_label],
        "leadScoreLabel": classification_label,
        "scoreDate": datetime.now(timezone.utc),
        "scoreModelVersion": "v1-rule-based"
    }

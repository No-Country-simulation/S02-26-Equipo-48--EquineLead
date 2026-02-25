from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from datetime import datetime

from model.lead_scoring import LeadScoring

app = FastAPI(title="EquineLead Scoring API v1")


class Interaction(BaseModel):
    interactionType: int
    interactionDate: datetime


class ScoringRequest(BaseModel):
    userId: str
    userType: str
    userBudget: float
    createdAt: datetime
    interactions: List[Interaction]


@app.post("/api/v1/scoring/calculate")
def calculate_score(request: ScoringRequest):

    interactions = [
        {
            "type": interaction.interactionType,
            "date": interaction.interactionDate
        }
        for interaction in request.interactions
    ]

    lead = LeadScoring(
        user_type=request.userType,
        user_budget=request.userBudget,
        interactions=interactions
    )

    score = lead.calculate_score()
    classification_label = lead.get_classification()

    classification_map = {
        "Cold": 1,
        "Warm": 2,
        "Hot": 3
    }

    return {
        "userId": request.userId,
        "leadScoreValue": score,
        "leadScoreClassification": classification_map[classification_label],
        "leadScoreLabel": classification_label,
        "scoreDate": datetime.utcnow(),
        "scoreModelVersion": "v1-rule-based"
    }

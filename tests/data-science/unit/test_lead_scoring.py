"""
###############################################################################
# Test: test_lead_scoring.py (Unit)
# Propósito: Validar los cálculos matemáticos de la lógica de Scoring
# 
# Analogía: Revisa que la calculadora del cerebro esté calibrada.
###############################################################################
"""
import pytest
from datetime import datetime, timezone
try:
    from src.data_science.model.lead_scoring import LeadScoring
except ImportError:
    pass # Manejado en los tests de salud

def test_calculate_budget_points():
    lead = LeadScoring(user_type="B2C", user_budget=5000, interactions=[])
    assert lead.calculate_budget_points() == 15

def test_calculate_interaction_points():
    interactions = [
        {"type": 1, "date": datetime.now(timezone.utc)}, # 5 pts
        {"type": 5, "date": datetime.now(timezone.utc)}  # 40 pts
    ]
    lead = LeadScoring(user_type="B2C", user_budget=1000, interactions=interactions)
    assert lead.calculate_interaction_points() == 45

def test_full_score_calculation():
    interactions = [{"type": 4, "date": datetime.now(timezone.utc)}] # 25 pts
    # User Type B2B = 20 pts, Budget 60000 = 40 pts
    lead = LeadScoring(user_type="B2B", user_budget=60000, interactions=interactions)
    # Total: 25 + 20 + 40 = 85
    assert lead.calculate_score() == 85
    assert lead.get_classification() == "Hot"

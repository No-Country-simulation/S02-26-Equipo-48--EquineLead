"""
###############################################################################
# Test: test_health.py
# Propósito: Verificar la salud básica e integridad de los imports
# 
# Analogía: Es el "check engine" inicial; si esto falla, el código no arranca.
###############################################################################
"""

import pytest
try:
    from src.data_science.model.lead_scoring import LeadScoring
    IMPORT_SUCCESS = True
except ImportError:
    IMPORT_SUCCESS = False

def test_lead_scoring_import():
    """Verifica que el modelo LeadScoring sea importable."""
    assert IMPORT_SUCCESS, "Error: No se pudo importar LeadScoring. Revisar estructura de carpetas (guión vs guión bajo)."

def test_lead_scoring_instantiation():
    """Verifica que se pueda crear una instancia del modelo."""
    if not IMPORT_SUCCESS:
        pytest.skip("Saltando porque el import falló")
    
    lead = LeadScoring(user_type="B2B", user_budget=1000, interactions=[])
    assert lead is not None
    assert lead.user_budget == 1000

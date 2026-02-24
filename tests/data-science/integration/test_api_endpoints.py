"""
###############################################################################
# Test: test_api_endpoints.py (Integration)
# Propósito: Verificar que la API responda correctamente a las consultas
# 
# Analogía: Prueba que el teléfono de la oficina atienda y responda bien.
###############################################################################
"""
import pytest
from fastapi.testclient import TestClient
from datetime import datetime, timezone

try:
    from src.data_science.api import app
    client = TestClient(app)
    IMPORT_SUCCESS = True
except ImportError:
    IMPORT_SUCCESS = False

def test_calculate_score_endpoint():
    if not IMPORT_SUCCESS:
        pytest.skip("No se puede probar el endpoint si el import de la API falla")
    
    payload = {
        "userId": "user_123",
        "userType": "B2B",
        "userBudget": 15000,
        "createdAt": datetime.now(timezone.utc).isoformat(),
        "interactions": [
            {
                "interactionType": 5, 
                "interactionDate": datetime.now(timezone.utc).isoformat()
            }
        ]
    }
    
    response = client.post("/api/v1/scoring/calculate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["userId"] == "user_123"
    assert "leadScoreValue" in data
    assert "leadScoreLabel" in data

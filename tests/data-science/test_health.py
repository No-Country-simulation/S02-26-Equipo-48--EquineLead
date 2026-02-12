"""
Health Check Tests - Verificación básica de ejecución

Analogía: Este test es como el "check engine light" de un auto.
No verifica que el auto corra bien, solo que el motor enciende.
"""

import pytest


def test_application_health():
    """
    Test básico para verificar que pytest funciona correctamente.
    
    Este test siempre debe pasar si el entorno está configurado.
    """
    assert True, "El entorno de testing debe estar configurado correctamente"


def test_basic_math_operations():
    """
    Test básico para verificar operaciones matemáticas.
    
    Valida que Python y pytest están funcionando como se espera.
    """
    result = 2 + 2
    assert result == 4, f"Esperado 4, pero obtuve {result}"


def test_import_pytest():
    """
    Verifica que pytest está instalado y disponible.
    """
    assert pytest is not None, "pytest debe estar instalado"


class TestEnvironmentSetup:
    """
    Suite de tests para verificar el entorno de desarrollo.
    """
    
    def test_python_version(self):
        """Verifica que Python 3.x está siendo usado"""
        import sys
        assert sys.version_info.major == 3, "Debe usar Python 3.x"
    
    def test_basic_list_operations(self):
        """Test básico de operaciones con listas"""
        test_list = [1, 2, 3]
        assert len(test_list) == 3
        assert 2 in test_list

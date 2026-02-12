# 🧠 Data Science - Tests

> **Analogía**: El módulo Data Science es el **cerebro** del auto de carreras EquineLead. Estos tests verifican que el sistema de navegación (IA/ML) procese datos correctamente, tome decisiones inteligentes, y guíe al vehículo por la ruta óptima.

---

## 🎯 **Propósito**

Esta carpeta contiene todos los tests para el componente Data Science del proyecto EquineLead, que incluye:

- API FastAPI para servicios ML
- Modelos de sentiment analysis
- Lead scoring engine
- Segmentación de clientes

---

## 🏗️ **Estructura de Tests**

```
data-science/
├── unit/                         # Tests unitarios
│   ├── test_sentiment_analysis.py  # Tests de análisis de sentimiento
│   ├── test_lead_scoring.py        # Tests de scoring de leads
│   └── __init__.py
├── integration/                  # Tests de integración
│   ├── test_api_endpoints.py     # Tests de endpoints FastAPI
│   └── __init__.py
├── test_health.py                # ✅ Test básico de salud
├── requirements-test.txt         # Dependencias para testing
├── pytest.ini                    # Configuración de pytest
└── README.md                     # Este archivo
```

---

## 🚗 **La Analogía del Cerebro**

| Tipo de Test | Qué Verifica | Analogía |
|--------------|--------------|----------|
| **Health Check** | ¿Python y pytest funcionan? | ¿El cerebro está encendido? |
| **Unit Tests** | ¿Modelos ML predicen correctamente? | ¿El cerebro procesa información? |
| **Integration Tests** | ¿La API responde correctamente? | ¿El cerebro se comunica con otros sistemas? |

---

## 🚀 **Cómo Ejecutar los Tests**

### **Opción 1: Usando el script de automatización** (Recomendado)

```bash
# Desde la raíz del proyecto
./tests/scripts/run_datascience_tests.sh
```

Este script:
1. ✅ Verifica que Python 3 esté instalado
2. ✅ Instala dependencias (pytest, etc.)
3. ✅ Ejecuta todos los tests
4. ✅ Muestra resultados con colores

---

### **Opción 2: Manualmente con pytest**

```bash
# Navegar a la carpeta de tests
cd tests/data-science

# Ejecutar todos los tests
pytest

# Ejecutar con más detalle
pytest -v

# Ejecutar solo un archivo específico
pytest test_health.py

# Ejecutar con cobertura de código
pytest --cov=src/data-science
```

---

## 📦 **Requisitos**

### **Software Necesario**

- **Python 3.8+** - [Descargar aquí](https://www.python.org/downloads/)
- **pytest** - Framework de testing
- **pytest-cov** - Para cobertura de código (opcional)

### **Instalación de Dependencias**

```bash
# Instalar pytest
pip install pytest pytest-cov

# O instalar desde requirements-test.txt
pip install -r tests/data-science/requirements-test.txt
```

### **Verificar Instalación**

```bash
# Verificar que Python está instalado
python3 --version

# Verificar que pytest está instalado
pytest --version
```

---

## 🧪 **Tests Actuales**

### **1. Health Check Test** ✅

**Archivo**: `test_health.py`

**Propósito**: Verificar que el entorno de testing funciona correctamente.

```python
def test_application_health():
    """Test básico para verificar que pytest funciona"""
    assert True
```

**Cuándo se ejecuta**:
- En cada push a GitHub
- Antes de aprobar un Pull Request
- Localmente antes de hacer commit

---

## 🎓 **Para Principiantes**

### **¿Qué es pytest?**

**pytest** es un framework de testing para Python. Es como un "profesor automático" que:

1. Encuentra todos los archivos `test_*.py`
2. Ejecuta todas las funciones que empiezan con `test_`
3. Verifica si pasan o fallan
4. Te muestra un reporte detallado

### **Anatomía de un Test**

```python
def test_nombre_descriptivo():
    """Descripción de qué prueba este test"""
    
    # Arrange (Preparar): Configurar datos de prueba
    input_data = "texto de ejemplo"
    expected_result = "positivo"
    
    # Act (Actuar): Ejecutar la función a probar
    actual_result = analyze_sentiment(input_data)
    
    # Assert (Afirmar): Verificar el resultado
    assert actual_result == expected_result
```

### **Convenciones de Nombres**

```
test_[función]_[escenario]_[resultado_esperado]

Ejemplos:
✅ test_sentiment_analysis_positive_text_returns_positive
✅ test_lead_scoring_high_engagement_returns_high_score
✅ test_api_endpoint_invalid_data_returns_400
```

---

## 📊 **Tipos de Tests**

### **1. Tests Unitarios** (Unit Tests)

**Qué prueban**: Una función individual, aislada.

**Ejemplo**:
```python
def test_calculate_lead_score_with_high_engagement():
    """Test de scoring con alto engagement"""
    # Arrange
    lead_data = {
        "visits": 10,
        "time_on_site": 300,
        "pages_viewed": 15
    }
    
    # Act
    score = calculate_lead_score(lead_data)
    
    # Assert
    assert score > 80
    assert score <= 100
```

---

### **2. Tests de API** (Integration Tests)

**Qué prueban**: Endpoints de FastAPI funcionando correctamente.

**Ejemplo**:
```python
from fastapi.testclient import TestClient

def test_sentiment_endpoint_returns_correct_format():
    """Test de endpoint de sentiment analysis"""
    # Arrange
    client = TestClient(app)
    payload = {"text": "I love this product!"}
    
    # Act
    response = client.post("/api/sentiment", json=payload)
    
    # Assert
    assert response.status_code == 200
    assert "sentiment" in response.json()
    assert response.json()["sentiment"] in ["positive", "negative", "neutral"]
```

---

### **3. Tests de Modelos ML**

**Qué prueban**: Que los modelos ML predicen correctamente.

**Ejemplo**:
```python
def test_sentiment_model_accuracy():
    """Test de precisión del modelo de sentiment"""
    # Arrange
    test_cases = [
        ("I love this!", "positive"),
        ("This is terrible", "negative"),
        ("It's okay", "neutral")
    ]
    
    # Act & Assert
    for text, expected_sentiment in test_cases:
        result = sentiment_model.predict(text)
        assert result == expected_sentiment
```

---

## 🔄 **Integración con Jenkins**

Estos tests se ejecutan automáticamente cuando:

1. **Push a feature branch** → Ejecuta health checks
2. **Pull Request** → Ejecuta todos los tests
3. **Merge a dev/main** → Ejecuta tests + validaciones adicionales

Ver: [Jenkinsfile.datascience](../../ci-cd/jenkins/Jenkinsfile.datascience)

---

## 📈 **Roadmap de Tests**

| Fase | Descripción | Estado |
|------|-------------|--------|
| **Fase 1** | Health checks básicos | ✅ Completado |
| **Fase 2** | Tests de modelos ML | ⚠️ Pendiente |
| **Fase 3** | Tests de endpoints FastAPI | ⚠️ Pendiente |
| **Fase 4** | Tests de integración completa | ⚠️ Pendiente |

---

## 🐛 **Troubleshooting**

### **Error: "pytest: command not found"**

**Solución**: Instala pytest
```bash
pip install pytest
# o
pip3 install pytest
```

### **Error: "ModuleNotFoundError"**

**Solución**: Instala las dependencias del proyecto
```bash
pip install -r src/data-science/requirements.txt
```

### **Tests pasan localmente pero fallan en Jenkins**

**Posibles causas**:
- Modelos ML no están en el repositorio (son muy grandes)
- Variables de entorno diferentes
- Versiones de librerías diferentes

**Solución**: Usa `requirements.txt` con versiones fijas
```
pytest==7.4.0
fastapi==0.103.0
```

---

## 🤝 **Cómo Contribuir**

### **Agregar un Nuevo Test**

1. Crea un archivo `test_*.py` en `unit/` o `integration/`
2. Sigue la convención de nombres
3. Usa el patrón Arrange-Act-Assert
4. Ejecuta localmente antes de commit

```bash
# Ejecutar solo tus nuevos tests
pytest tests/data-science/unit/test_tu_nuevo_test.py -v
```

---

## 📚 **Recursos Adicionales**

- [Documentación oficial de pytest](https://docs.pytest.org/)
- [Testing FastAPI](https://fastapi.tiangolo.com/tutorial/testing/)
- [Best Practices de Testing en Python](https://realpython.com/pytest-python-testing/)

---

## 🔗 **Enlaces Relacionados**

- [⬆️ Volver a Tests Principal](../README.md)
- [📖 Scripts de Automatización](../scripts/README.md)
- [📖 Jenkins CI/CD](../../ci-cd/jenkins/README.md)

---

> **Recuerda**: Un cerebro bien probado toma decisiones inteligentes. ¡Escribe tests para tu IA! 🧠✨

# ============================================================
# Data Science (FastAPI) - Dockerfile
# Runtime Python 3.12-slim
# ============================================================

FROM python:3.12-slim
WORKDIR /app

# Copiar dependencias e instalarlas primero (cache de capas)
COPY requirements.txt ./
RUN pip install --no-cache-dir --default-timeout=100 -r requirements.txt

# Copiar el código fuente del módulo
COPY . ./

# Exponer el puerto del servicio
EXPOSE 8090

# Comando de arranque (sin --reload en producción)
CMD ["python", "-m", "uvicorn", "api:app", "--host", "0.0.0.0", "--port", "8090"]

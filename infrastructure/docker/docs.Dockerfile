FROM python:3.10-slim

WORKDIR /repo

# Instalación de dependencias de MkDocs y Material Theme
RUN pip install --no-cache-dir \
    mkdocs-material \
    mkdocs-mermaid2-plugin \
    mkdocs-exclude

# Copiar y configurar el script de entrada
COPY infrastructure/docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Exponer puerto por defecto de mkdocs serve
EXPOSE 8000

# Usar el script de entrada para preparar symlinks antes de iniciar
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

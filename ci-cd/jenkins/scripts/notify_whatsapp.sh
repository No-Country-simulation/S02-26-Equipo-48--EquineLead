#!/bin/bash

# notify_whatsapp.sh
# Script para enviar notificaciones de Jenkins y adjuntar reportes .md vía WAHA

STATUS=$1
BRANCH_ARG=$2
if [ -z "$BRANCH_ARG" ] || [ "$BRANCH_ARG" == "unknown" ]; then
    BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown")
else
    BRANCH=$BRANCH_ARG
fi

COMMIT_HASH=$3
BUILD_REPORT=$4
TEST_REPORT=$5

PROJECT_NAME=${PROJECT_NAME:-"EquineLead"}
WAHA_URL=${WAHA_URL:-"http://${APP_SERVER_IP:-localhost}:3005"}
WAHA_SESSION=${WAHA_SESSION:-"default"}
RECIPIENT=${WAHA_RECIPIENT}

if [ -z "$STATUS" ]; then
    echo "Uso: $0 <STATUS> [BRANCH] [COMMIT_HASH] [BUILD_REPORT] [TEST_REPORT]"
    exit 1
fi

# Selección de Icono
[ "$STATUS" == "SUCCESS" ] && ICON="✅" || ICON="❌"

# Metadatos del Git
AUTHOR=$(git log -1 --pretty=format:'%an')
# Fecha en formato Perú (GMT-5)
TIMEZONE_DATE=$(TZ="America/Lima" date "+%Y-%m-%d %H:%M:%S")
SHORT_COMMIT=${COMMIT_HASH:-$(git rev-parse --short HEAD)}

# 1. Construcción del Mensaje de Resumen
MESSAGE="*${ICON} ${PROJECT_NAME}* | Reporte Generado\n"
MESSAGE+="━━━━━━━━━━━━━━━━━━━━\n"
MESSAGE+="*Rama:* ${BRANCH}\n"
MESSAGE+="*Autor:* ${AUTHOR}\n"
MESSAGE+="*Fecha:* ${TIMEZONE_DATE} (PE)\n"
MESSAGE+="*Commit:* ${SHORT_COMMIT}\n\n"
MESSAGE+="📂 *Reportes adjuntos debajo:*\n"
MESSAGE+="• Reporte de Compilación\n"
MESSAGE+="• Reporte de Ejecución de Tests\n\n"
MESSAGE+="🔗 *Log Jenkins:* http://129.151.114.218:8080/\n"
MESSAGE+="\n_Enviado automáticamente por Jenkins_"

# Función para enviar texto
send_text() {
    local text="$1"
    local escaped_text
    escaped_text=$(echo -e "$text" | python3 -c 'import json, sys; print(json.dumps(sys.stdin.read()))')
    
    echo ">>> Enviando mensaje de texto..."
    curl -s -X POST "${WAHA_URL}/api/sendText" \
         -H "Content-Type: application/json" \
         -H "X-Api-Key: ${WAHA_API_KEY}" \
         -d "{
           \"chatId\": \"$RECIPIENT\",
           \"text\": $escaped_text,
           \"session\": \"$WAHA_SESSION\"
         }"
    echo -e "\n"
}

# Función para enviar archivo (base64)
send_file() {
    local file_path="$1"
    local filename=$(basename "$file_path")
    
    echo ">>> Verificando archivo: $file_path"
    if [ -f "$file_path" ]; then
        ls -lh "$file_path"
        local b64_data=$(base64 -w 0 "$file_path")
        
        echo ">>> Enviando adjunto: $filename ..."
        curl -s -X POST "${WAHA_URL}/api/sendFile" \
             -H "Content-Type: application/json" \
             -H "X-Api-Key: ${WAHA_API_KEY}" \
             -d "{
               \"chatId\": \"$RECIPIENT\",
               \"file\": {
                 \"mimetype\": \"application/octet-stream\",
                 \"filename\": \"$filename\",
                 \"data\": \"$b64_data\"
               },
               \"session\": \"$WAHA_SESSION\"
             }"
        echo -e "\n"
    else
        echo "⚠️ Error: El archivo $file_path no existe o está vacío."
    fi
}

echo "Enviando notificación a WhatsApp..."

# Enviar resumen primero
send_text "$MESSAGE"

# Pequeña pausa para asegurar el orden en WhatsApp
sleep 2

# Enviar reportes
if [ ! -z "$BUILD_REPORT" ]; then send_file "$BUILD_REPORT"; fi
sleep 1
if [ ! -z "$TEST_REPORT" ]; then send_file "$TEST_REPORT"; fi

echo "✅ Proceso de notificación finalizado."

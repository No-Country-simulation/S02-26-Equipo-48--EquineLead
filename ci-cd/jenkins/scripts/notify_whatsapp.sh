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

# 1. Subir reportes a dpaste.com y construir URLs
upload_to_dpaste() {
    local file_path="$1"
    if [ -f "$file_path" ]; then
        local url
        url=$(curl -s --max-time 15 -X POST "https://dpaste.com/api/v2/" \
             --data-urlencode "content@$file_path" \
             -d "syntax=text&expiry_days=7")
        echo "$url"
    else
        echo ""
    fi
}

echo "Subiendo reportes a dpaste.com..."
BUILD_URL=""
TEST_URL=""
[ ! -z "$BUILD_REPORT" ] && BUILD_URL=$(upload_to_dpaste "$BUILD_REPORT")
[ ! -z "$TEST_REPORT" ]  && TEST_URL=$(upload_to_dpaste "$TEST_REPORT")

# 2. Construcción del Mensaje de Resumen con links
MESSAGE="*${ICON} ${PROJECT_NAME}* | Reporte Generado\n"
MESSAGE+="━━━━━━━━━━━━━━━━━━━━\n"
MESSAGE+="*Rama:* ${BRANCH}\n"
MESSAGE+="*Autor:* ${AUTHOR}\n"
MESSAGE+="*Fecha:* ${TIMEZONE_DATE} (PE)\n"
MESSAGE+="*Commit:* ${SHORT_COMMIT}\n\n"
if [ ! -z "$BUILD_URL" ]; then
    MESSAGE+="📦 *Compilación:* ${BUILD_URL}\n"
fi
if [ ! -z "$TEST_URL" ]; then
    MESSAGE+="🧪 *Tests:* ${TEST_URL}\n"
fi
MESSAGE+="\n🔗 *Log Jenkins:* http://129.151.114.218:8080/\n"
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

# Función para enviar archivo (base64 via Python para evitar problemas de shell)
send_file() {
    local file_path="$1"
    local filename=$(basename "$file_path")

    echo ">>> Verificando archivo: $file_path"
    if [ -f "$file_path" ]; then
        ls -lh "$file_path"
        echo ">>> Enviando adjunto: $filename ..."

        # Python construye el JSON y hace el POST directamente para evitar
        # problemas de escape de caracteres en bloques grandes de base64
        python3 - <<PYEOF
import base64, json, urllib.request, os

file_path = "$file_path"
filename  = "$filename"
waha_url  = os.environ.get("WAHA_URL", "http://localhost:3005")
api_key   = os.environ.get("WAHA_API_KEY", "")
recipient = os.environ.get("WAHA_RECIPIENT", "")
session   = os.environ.get("WAHA_SESSION", "default")

with open(file_path, "rb") as f:
    b64 = base64.b64encode(f.read()).decode()

payload = json.dumps({
    "session": session,
    "chatId": recipient,
    "caption": filename,
    "file": {
        "mimetype": "application/octet-stream",
        "filename": filename,
        "data": b64
    }
}).encode("utf-8")

req = urllib.request.Request(
    f"{waha_url}/api/sendFile",
    data=payload,
    headers={
        "Content-Type": "application/json",
        "X-Api-Key": api_key
    }
)
try:
    with urllib.request.urlopen(req) as resp:
        print(">>> Respuesta API:", resp.read().decode())
except Exception as e:
    print(">>> Error al enviar:", str(e))
PYEOF

    else
        echo "⚠️ Error: El archivo $file_path no existe o está vacío."
    fi
}

echo "Enviando notificación a WhatsApp..."
send_text "$MESSAGE"
echo "✅ Proceso de notificación finalizado."

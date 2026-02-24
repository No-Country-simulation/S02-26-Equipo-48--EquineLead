#!/bin/bash

# notify_whatsapp.sh
# Script para enviar notificaciones de Jenkins a través de WAHA (WhatsApp HTTP API)

STATUS=$1
# Intentar obtener la rama de los argumentos, sino del entorno o de git
BRANCH_ARG=$2
if [ -z "$BRANCH_ARG" ] || [ "$BRANCH_ARG" == "unknown" ]; then
    BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown")
else
    BRANCH=$BRANCH_ARG
fi

COMMIT_HASH=$3
SUMMARY_FILE=$4
PROJECT_NAME=${PROJECT_NAME:-"EquineLead"}
WAHA_URL=${WAHA_URL:-"http://${APP_SERVER_IP:-localhost}:3005"}
WAHA_SESSION=${WAHA_SESSION:-"default"}
RECIPIENT=${WAHA_RECIPIENT}

if [ -z "$STATUS" ]; then
    echo "Uso: $0 <STATUS> [BRANCH] [COMMIT_HASH] [SUMMARY_FILE]"
    exit 1
fi

# Selección de Icono y Título
if [ "$STATUS" == "SUCCESS" ]; then
    ICON="✅"
    MSG="¡Build Exitoso!"
elif [ "$STATUS" == "FAILURE" ]; then
    ICON="❌"
    MSG="¡Build Fallido!"
else
    ICON="⚠️"
    MSG="Build con estado: $STATUS"
fi

# Metadatos del Git
LAST_COMMIT_AUTHOR=$(git log -1 --pretty=format:'%an')
 gestion_date=$(date "+%Y-%m-%d %H:%M:%S")
short_commit=${COMMIT_HASH:-$(git rev-parse --short HEAD)}

# Construcción del Mensaje
MESSAGE="*${ICON} ${PROJECT_NAME} Notification*\n\n"
MESSAGE+="*Estado:* ${MSG}\n"
MESSAGE+="*Rama:* ${BRANCH}\n"
MESSAGE+="*Autor:* ${LAST_COMMIT_AUTHOR}\n"
MESSAGE+="*Fecha de testeo:* ${gestion_date}\n"
MESSAGE+="*Commit:* ${short_commit}\n"

# Incluir Resumen si existe el archivo
if [ -f "$SUMMARY_FILE" ] && [ -s "$SUMMARY_FILE" ]; then
    MESSAGE+="\n*📋 RESUMEN DETALLADO:*\n"
    MESSAGE+="\`\`\`\n"
    # Limpiamos códigos ANSI (colores) que no se ven bien en WhatsApp
    CLEAN_SUMMARY=$(sed 's/\x1b\[[0-9;]*m//g' "$SUMMARY_FILE")
    MESSAGE+="${CLEAN_SUMMARY}\n"
    MESSAGE+="\`\`\`\n"
fi

MESSAGE+="\n🔗 *Log Completo:*\nhttp://129.151.114.218:8080/\n"
MESSAGE+="\n_Enviado automáticamente por Jenkins_"

# --- ESCAPE PARA JSON (CRITICO para evitar "Bad control character") ---
# 1. Escapar comillas dobles
# 2. Escapar saltos de línea literales (convertirlos en \n)
# Usamos python si está disponible por ser más robusto, sino sed.
if command -v python3 &>/dev/null; then
    ESCAPED_MESSAGE=$(echo -e "$MESSAGE" | python3 -c 'import json, sys; print(json.dumps(sys.stdin.read()))')
    # json.dumps ya añade las comillas al principio y al final y escapa todo
    JSON_PAYLOAD="{
      \"chatId\": \"$RECIPIENT\",
      \"text\": $ESCAPED_MESSAGE,
      \"session\": \"$WAHA_SESSION\"
    }"
else
    # Fallback con sed si no hay python (menos robusto pero funcional)
    ESCAPED_MESSAGE=$(echo -e "$MESSAGE" | sed 's/"/\\"/g' | awk '{printf "%s\\n", $0}' | sed 's/\\n$//')
    JSON_PAYLOAD="{
      \"chatId\": \"$RECIPIENT\",
      \"text\": \"$ESCAPED_MESSAGE\",
      \"session\": \"$WAHA_SESSION\"
    }"
fi

# Nota: El uso de --data-binary @- con curl permite enviar el payload sin que el shell lo interprete
echo "$JSON_PAYLOAD" | curl -s -X POST "${WAHA_URL}/api/sendText" \
     -H "Content-Type: application/json" \
     -H "X-Api-Key: ${WAHA_API_KEY}" \
     --data-binary @-

echo ""
echo "Notificación enviada con estado $STATUS"

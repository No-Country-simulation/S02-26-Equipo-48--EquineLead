#!/bin/bash

# notify_whatsapp.sh
# Script para enviar notificaciones de Jenkins a través de WAHA (WhatsApp HTTP API)

STATUS=$1
BRANCH=$2
PROJECT_NAME=${PROJECT_NAME:-"EquineLead"}
WAHA_URL=${WAHA_URL:-"http://localhost:3005"}
WAHA_SESSION=${WAHA_SESSION:-"default"}
RECIPIENT=${WAHA_RECIPIENT}

if [ -z "$STATUS" ] || [ -z "$BRANCH" ]; then
    echo "Uso: $0 <STATUS> <BRANCH>"
    exit 1
fi

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

LAST_COMMIT_AUTHOR=$(git log -1 --pretty=format:'%an')
MESSAGE="*${ICON} ${PROJECT_NAME} Notification*
-------------------------
*Estado:* ${MSG}
*Rama:* ${BRANCH}
*Autor:* ${LAST_COMMIT_AUTHOR}
-------------------------
_Enviado automáticamente por Jenkins_"

# Enviar vía WAHA API
curl -s -X POST "${WAHA_URL}/api/sendText" \
     -H "Content-Type: application/json" \
     -H "X-Api-Key: ${WAHA_API_KEY}" \
     -d "{
           \"chatId\": \"${RECIPIENT}\",
           \"text\": \"${MESSAGE}\",
           \"session\": \"${WAHA_SESSION}\"
         }"

echo "Notificación enviada con estado $STATUS"

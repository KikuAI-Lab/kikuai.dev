#!/usr/bin/env bash
set -euo pipefail

if [[ -z "${TELEGRAM_BOT_TOKEN:-}" ]]; then
  echo "Set TELEGRAM_BOT_TOKEN environment variable" >&2
  exit 1
fi

API="https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}"
echo "Waiting for an incoming message to the bot... (send /start to the bot)"

while true; do
  UPD=$(curl -sS "${API}/getUpdates")
  CHAT_ID=$(echo "$UPD" | grep -o '"chat":{[^}]*}' | grep -o '"id":[0-9-]*' | head -n1 | cut -d: -f2)
  if [[ -n "$CHAT_ID" ]]; then
    echo "TELEGRAM_CHAT_ID=$CHAT_ID"
    exit 0
  fi
  sleep 3
done


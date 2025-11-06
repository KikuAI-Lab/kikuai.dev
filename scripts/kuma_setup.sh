#!/usr/bin/env bash
set -euo pipefail

KUMA_URL="http://127.0.0.1:3001"
USERNAME="admin"
PASSWORD="Adm1n!KikuAI-2025"
TELEGRAM_BOT_TOKEN="8432239884:AAEDyDE2k53JeQEcj15WvBmS-twW8S-fDSI"
TELEGRAM_CHAT_ID="249626104"
SERVER_IP="46.62.196.222"

COOKIE=$(mktemp)
trap "rm -f $COOKIE" EXIT

echo "Logging in..."
curl -s -c "$COOKIE" -X POST -H "Content-Type: application/json" \
  -d "{\"username\":\"$USERNAME\",\"password\":\"$PASSWORD\"}" \
  "$KUMA_URL/api/login" > /dev/null

echo "Enabling public status page..."
curl -s -b "$COOKIE" -X PUT -H "Content-Type: application/json" \
  -d '{"title":"KikuAI Status","description":"Service status and uptime monitoring","footer":"Powered by Uptime Kuma","publicGroupList":[]}' \
  "$KUMA_URL/api/status-page" > /dev/null

echo "Adding Telegram notification..."
NOTIF_RESP=$(curl -s -b "$COOKIE" -X POST -H "Content-Type: application/json" \
  -d "{\"name\":\"Telegram\",\"type\":\"telegram\",\"isDefault\":true,\"telegramBotToken\":\"$TELEGRAM_BOT_TOKEN\",\"telegramChatID\":\"$TELEGRAM_CHAT_ID\"}" \
  "$KUMA_URL/api/notification")
echo "Notification: $NOTIF_RESP"

echo "Adding monitors..."
curl -s -b "$COOKIE" -X POST -H "Content-Type: application/json" \
  -d '{"name":"Portal Health","type":"http","url":"https://kikuai.dev/healthz","interval":30,"maxretries":2,"retryInterval":10,"method":"GET"}' \
  "$KUMA_URL/api/monitor" > /dev/null

curl -s -b "$COOKIE" -X POST -H "Content-Type: application/json" \
  -d '{"name":"Status Page","type":"http","url":"https://status.kikuai.dev","interval":60,"maxretries":2,"retryInterval":10,"method":"GET"}' \
  "$KUMA_URL/api/monitor" > /dev/null

curl -s -b "$COOKIE" -X POST -H "Content-Type: application/json" \
  -d "{\"name\":\"SSH Port\",\"type\":\"port\",\"hostname\":\"$SERVER_IP\",\"port\":22,\"interval\":60}" \
  "$KUMA_URL/api/monitor" > /dev/null

curl -s -b "$COOKIE" -X POST -H "Content-Type: application/json" \
  -d "{\"name\":\"HTTP Port\",\"type\":\"port\",\"hostname\":\"$SERVER_IP\",\"port\":80,\"interval\":60}" \
  "$KUMA_URL/api/monitor" > /dev/null

curl -s -b "$COOKIE" -X POST -H "Content-Type: application/json" \
  -d "{\"name\":\"HTTPS Port\",\"type\":\"port\",\"hostname\":\"$SERVER_IP\",\"port\":443,\"interval\":60}" \
  "$KUMA_URL/api/monitor" > /dev/null

curl -s -b "$COOKIE" -X POST -H "Content-Type: application/json" \
  -d "{\"name\":\"Server Ping\",\"type\":\"ping\",\"hostname\":\"$SERVER_IP\",\"interval\":60}" \
  "$KUMA_URL/api/monitor" > /dev/null

echo "Setup complete!"


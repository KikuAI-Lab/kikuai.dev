#!/usr/bin/env python3
import requests
import json

BASE_URL = "http://127.0.0.1:3001"
USERNAME = "admin"
PASSWORD = "Adm1n!KikuAI-2025"

session = requests.Session()

login_resp = session.post(
    f"{BASE_URL}/api/login",
    json={"username": USERNAME, "password": PASSWORD}
)
print(f"Login: {login_resp.status_code}")

notification_resp = session.post(
    f"{BASE_URL}/api/notification",
    json={
        "name": "Telegram",
        "type": "telegram",
        "isDefault": True,
        "telegramBotToken": "8432239884:AAEDyDE2k53JeQEcj15WvBmS-twW8S-fDSI",
        "telegramChatID": "249626104"
    }
)
print(f"Notification: {notification_resp.status_code} - {notification_resp.text[:200]}")

monitor_resp = session.post(
    f"{BASE_URL}/api/monitor",
    json={
        "name": "Portal Health",
        "type": "http",
        "url": "https://kikuai.dev/healthz",
        "interval": 30,
        "maxretries": 3,
        "method": "GET"
    }
)
print(f"Monitor: {monitor_resp.status_code} - {monitor_resp.text[:200]}")


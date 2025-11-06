# Uptime Kuma Manual Setup Guide

Since API endpoints are not accessible, complete setup via browser:

## 1. Enable Public Status Page

1. Go to https://status.kikuai.dev/settings/status-page
2. Enable "Public Status Page"
3. Configure:
   - Title: "KikuAI Status"
   - Description: "Service status and uptime monitoring"
   - Footer: "Powered by Uptime Kuma"
4. Save

## 2. Add Telegram Notification

1. Go to https://status.kikuai.dev/settings/notifications
2. Click "Add Notification"
3. Select "Telegram"
4. Fill in:
   - Name: Telegram
   - Bot Token: `8432239884:AAEDyDE2k53JeQEcj15WvBmS-twW8S-fDSI`
   - Chat ID: `249626104`
5. Check "Set as Default"
6. Save

## 3. Add Monitors

Go to https://status.kikuai.dev/add for each monitor:

### Portal Health (HTTPS)
- Type: HTTP(s)
- Name: Portal Health
- URL: https://kikuai.dev/healthz
- Interval: 30 seconds
- Method: GET
- Notification: Telegram (default)
- Failure threshold: 2 failures → WARNING, 5 → CRITICAL

### Status Page (HTTPS)
- Type: HTTP(s)
- Name: Status Page
- URL: https://status.kikuai.dev
- Interval: 60 seconds
- Method: GET
- Notification: Telegram (default)

### SSH Port (TCP)
- Type: Port
- Name: SSH Port
- Hostname: 46.62.196.222
- Port: 22
- Interval: 60 seconds
- Notification: Telegram (default)

### HTTP Port (TCP)
- Type: Port
- Name: HTTP Port
- Hostname: 46.62.196.222
- Port: 80
- Interval: 60 seconds
- Notification: Telegram (default)

### HTTPS Port (TCP)
- Type: Port
- Name: HTTPS Port
- Hostname: 46.62.196.222
- Port: 443
- Interval: 60 seconds
- Notification: Telegram (default)

### Server Ping
- Type: Ping
- Name: Server Ping
- Hostname: 46.62.196.222
- Interval: 60 seconds
- Notification: Telegram (default)

### TLS Expiry (kikuai.dev)
- Type: HTTP(s) - Certificate
- Name: TLS kikuai.dev
- URL: https://kikuai.dev
- Interval: 3600 seconds (1 hour)
- Expiry thresholds: 21 days (warning), 7 days (critical), 3 days (critical)
- Notification: Telegram (default)

### TLS Expiry (wildcard)
- Type: HTTP(s) - Certificate
- Name: TLS *.kikuai.dev
- URL: https://status.kikuai.dev
- Interval: 3600 seconds (1 hour)
- Expiry thresholds: 21 days (warning), 7 days (critical), 3 days (critical)
- Notification: Telegram (default)

## 4. Configure Alert Rules

For each monitor:
1. Edit monitor
2. Go to "Notification" section
3. Set failure thresholds:
   - 2 consecutive failures → WARNING (select Telegram)
   - 5 consecutive failures → CRITICAL (select Telegram)
4. Save

## Verification

- Public status page: https://status.kikuai.dev/status-page
- All monitors should show "UP" status
- Test alert: Temporarily stop a service and verify Telegram notification


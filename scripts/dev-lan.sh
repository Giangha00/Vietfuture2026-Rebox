#!/usr/bin/env bash
# Bind all interfaces, but print real URLs. Do not open http://0.0.0.0:3000
# (browsers treat 0.0.0.0 as invalid / blank page).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

IP="$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || true)"

echo ""
echo "Do not open http://0.0.0.0:3000 — that is a bind address, not a website."
echo ""
echo "On THIS Mac:     http://127.0.0.1:3000"
if [[ -n "${IP}" ]]; then
  echo "Send to team:    http://${IP}:3000"
  echo "Admin (team):    http://${IP}:5001/admin"
  echo ""
  echo "Restart this command after Wi-Fi/IP changes so Next allows the new host."
else
  echo "Send to team:    could not detect Wi-Fi IP. Run: ipconfig getifaddr en0"
fi
echo ""

exec npx next dev --hostname 0.0.0.0 --port 3000

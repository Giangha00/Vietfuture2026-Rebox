#!/usr/bin/env bash
# Print LAN URLs to share with teammates (same Wi-Fi).
set -euo pipefail
IP="$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || true)"
if [[ -z "${IP}" ]]; then
  echo "Could not detect Wi-Fi IP. Check you are connected, then run: ipconfig getifaddr en0"
  exit 1
fi
echo "Share these (same Wi-Fi). Do not send localhost."
echo "  App:   http://${IP}:3000"
echo "  API:   http://${IP}:5001/api/health"
echo "  Admin: http://${IP}:5001/admin"
echo ""
echo "On this machine run:"
echo "  cd rebox-backend && composer run serve:lan"
echo "  cd rebox && npm run dev:lan"
echo "  (AI stays local) cd rebox-ai && bash scripts/start_ai_service.sh"

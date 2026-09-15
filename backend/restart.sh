#!/usr/bin/env bash
# Hentikan proses yang memakai PORT, lalu jalankan ulang backend DAAK.
set -u

cd "$(dirname "$0")" || exit 1

PORT="${1:-$(grep -E '^PORT=' .env 2>/dev/null | cut -d= -f2 | tr -d '[:space:]')}"
PORT="${PORT:-3020}"

echo "==> Mengecek port $PORT ..."
PIDS="$(lsof -ti tcp:"$PORT" 2>/dev/null)"

if [ -z "$PIDS" ]; then
  echo "    Port $PORT bebas."
else
  echo "    Proses yang memakai port $PORT:"
  lsof -nP -iTCP:"$PORT" -sTCP:LISTEN 2>/dev/null
  echo
  read -r -p "    Hentikan proses di atas? [y/N] " JAWAB
  case "$JAWAB" in
    [yY]*)
      kill $PIDS 2>/dev/null
      sleep 2
      SISA="$(lsof -ti tcp:"$PORT" 2>/dev/null)"
      if [ -n "$SISA" ]; then
        echo "    Masih hidup, memaksa berhenti (kill -9)..."
        kill -9 $SISA 2>/dev/null
        sleep 1
      fi
      echo "    Port $PORT sudah dibebaskan."
      ;;
    *)
      echo "    Dibatalkan. Tidak ada proses yang dihentikan."
      exit 1
      ;;
  esac
fi

echo
echo "==> Menjalankan npm run start:dev ..."
exec npm run start:dev

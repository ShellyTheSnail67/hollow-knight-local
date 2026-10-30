#!/usr/bin/env bash
set -euo pipefail

PORT="${PORT:-8000}"
HOST="${HOST:-0.0.0.0}"

cd "$(dirname "$0")"
python3 -m http.server "$PORT" --bind "$HOST"

#!/usr/bin/env bash
set -euo pipefail

PREVIOUS_RELEASE="${1:-}"
if [[ -z "$PREVIOUS_RELEASE" ]]; then
  echo "Usage: $0 <previous-release-sha>"
  exit 1
fi

APP_BASE="/opt/rightbricks"
TARGET="$APP_BASE/releases/$PREVIOUS_RELEASE"

if [[ ! -d "$TARGET" ]]; then
  echo "Release not found: $TARGET"
  exit 1
fi

ln -sfn "$TARGET" "$APP_BASE/current"
cd "$APP_BASE/current/backend"
docker compose -f infra/docker/docker-compose.yml up -d --build

echo "[rollback] switched to $PREVIOUS_RELEASE"

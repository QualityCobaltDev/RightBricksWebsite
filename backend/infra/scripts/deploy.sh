#!/usr/bin/env bash
set -euo pipefail

RELEASE_SHA="${1:-}"
if [[ -z "$RELEASE_SHA" ]]; then
  echo "Usage: $0 <git-sha-or-tag>"
  exit 1
fi

APP_BASE="/opt/rightbricks"
RELEASES_DIR="$APP_BASE/releases"
CURRENT_LINK="$APP_BASE/current"
RELEASE_DIR="$RELEASES_DIR/$RELEASE_SHA"

mkdir -p "$RELEASES_DIR"

if [[ ! -d "$RELEASE_DIR" ]]; then
  git clone /opt/rightbricks/repo "$RELEASE_DIR"
fi

cd "$RELEASE_DIR"
git fetch --all --tags
git checkout "$RELEASE_SHA"

cp /opt/rightbricks/shared/.env.production backend/.env.production

cd backend
docker compose -f infra/docker/docker-compose.yml pull || true
docker compose -f infra/docker/docker-compose.yml up -d --build
docker compose -f infra/docker/docker-compose.yml exec -T app npx prisma migrate deploy

ln -sfn "$RELEASE_DIR" "$CURRENT_LINK"

echo "[deploy] release $RELEASE_SHA is live"

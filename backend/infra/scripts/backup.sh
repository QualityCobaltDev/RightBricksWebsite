#!/usr/bin/env bash
set -euo pipefail

APP_ROOT="/opt/rightbricks/current/backend"
BACKUP_ROOT="/opt/rightbricks/backups"
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"

mkdir -p "$BACKUP_ROOT/db" "$BACKUP_ROOT/uploads"

cd "$APP_ROOT"

echo "[backup] exporting PostgreSQL"
docker compose -f infra/docker/docker-compose.yml exec -T postgres \
  pg_dump -U rightbricks_app -d rightbricks_prod -Fc > "$BACKUP_ROOT/db/rightbricks_${STAMP}.dump"

echo "[backup] archiving uploads volume"
docker run --rm \
  -v rightbricks_pgdata:/data:ro \
  -v "$BACKUP_ROOT/uploads":/backup \
  busybox tar -czf "/backup/uploads_${STAMP}.tar.gz" /data

echo "[backup] done"

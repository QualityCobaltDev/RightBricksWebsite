#!/usr/bin/env bash
set -euo pipefail

if [[ $# -ne 1 ]]; then
  echo "Usage: $0 /absolute/path/to/rightbricks_YYYYMMDDTHHMMSSZ.dump"
  exit 1
fi

DUMP_FILE="$1"
APP_ROOT="/opt/rightbricks/current/backend"

cd "$APP_ROOT"

echo "[restore] terminating active sessions"
docker compose -f infra/docker/docker-compose.yml exec -T postgres \
  psql -U rightbricks_app -d postgres -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname='rightbricks_prod' AND pid <> pg_backend_pid();"

echo "[restore] recreating database"
docker compose -f infra/docker/docker-compose.yml exec -T postgres \
  psql -U rightbricks_app -d postgres -c "DROP DATABASE IF EXISTS rightbricks_prod;"
docker compose -f infra/docker/docker-compose.yml exec -T postgres \
  psql -U rightbricks_app -d postgres -c "CREATE DATABASE rightbricks_prod;"

echo "[restore] restoring dump"
cat "$DUMP_FILE" | docker compose -f infra/docker/docker-compose.yml exec -T postgres \
  pg_restore -U rightbricks_app -d rightbricks_prod --clean --if-exists --no-owner

echo "[restore] completed"

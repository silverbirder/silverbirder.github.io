#!/usr/bin/env bash
# Local Postgres container runner for apps/api

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="${SCRIPT_DIR}/../.env"

if [ -f "$ENV_FILE" ]; then
  set -a
  # shellcheck disable=SC1090
  source "$ENV_FILE"
  set +a
else
  echo "Environment file '$ENV_FILE' not found."
  exit 1
fi

if [ -z "${DATABASE_URL:-}" ]; then
  echo "DATABASE_URL is not set. Please update $ENV_FILE and try again."
  exit 1
fi

DB_CONTAINER_NAME="silverbirder-postgres"

if ! command -v docker >/dev/null 2>&1; then
  echo -e "Docker is not installed. Please install Docker and try again.\nDocker install guide: https://docs.docker.com/engine/install/"
  exit 1
fi

RUNNING_CONTAINER_ID=$(docker ps -q -f "name=^/${DB_CONTAINER_NAME}$")
if [ -n "$RUNNING_CONTAINER_ID" ]; then
  echo "Database container '$DB_CONTAINER_NAME' already running"
  exit 0
fi

EXISTING_CONTAINER_ID=$(docker ps -aq -f "name=^/${DB_CONTAINER_NAME}$")
if [ -n "$EXISTING_CONTAINER_ID" ]; then
  docker start "$DB_CONTAINER_NAME"
  echo "Existing database container '$DB_CONTAINER_NAME' started"
  exit 0
fi

DB_PASSWORD=$(echo "$DATABASE_URL" | awk -F':' '{print $3}' | awk -F'@' '{print $1}')
DB_PORT=$(echo "$DATABASE_URL" | awk -F':' '{print $4}' | awk -F'/' '{print $1}')

if [ "$DB_PASSWORD" = "password" ]; then
  echo "You are using the default database password"
  read -r -p "Should we generate a random password for you? [y/N]: " REPLY
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Please change the default password in the .env file and try again"
    exit 1
  fi
  DB_PASSWORD=$(openssl rand -base64 12 | tr '+/' '-_')
  sed -i -e "s#:password@#:$DB_PASSWORD@#" "$ENV_FILE"
fi

docker run -d \
  --name "$DB_CONTAINER_NAME" \
  -e POSTGRES_USER="postgres" \
  -e POSTGRES_PASSWORD="$DB_PASSWORD" \
  -e POSTGRES_DB="silverbirder_api" \
  -p "$DB_PORT":5432 \
  docker.io/postgres && echo "Database container '$DB_CONTAINER_NAME' was successfully created"

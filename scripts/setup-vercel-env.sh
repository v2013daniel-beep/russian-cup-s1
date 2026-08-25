#!/usr/bin/env bash
set -e

export PATH="$PWD/node:$PATH"

if [ -z "$VERCEL_TOKEN" ]; then
  echo "Error: VERCEL_TOKEN environment variable is not set."
  echo "Usage: VERCEL_TOKEN=your_token bash scripts/setup-vercel-env.sh"
  exit 1
fi

set_env() {
  local key="$1"
  local value="$2"
  local env="${3:-production}"

  echo "Setting $key for $env..."
  vercel env rm "$key" "$env" --yes --token "$VERCEL_TOKEN" 2>/dev/null || true
  printf '%s\n' "$value" | vercel env add "$key" "$env" --token "$VERCEL_TOKEN"
}

# Read .env values
DATABASE_URL=$(grep '^DATABASE_URL=' .env | cut -d'=' -f2- | sed 's/^"//; s/"$//')
ADMIN_PASSWORD=$(grep '^ADMIN_PASSWORD=' .env | cut -d'=' -f2- | sed 's/^"//; s/"$//')
JWT_SECRET=$(grep '^JWT_SECRET=' .env | cut -d'=' -f2- | sed 's/^"//; s/"$//')
ROBOKASSA_MERCHANT_LOGIN=$(grep '^ROBOKASSA_MERCHANT_LOGIN=' .env | cut -d'=' -f2- | sed 's/^"//; s/"$//')
ROBOKASSA_PASSWORD_1=$(grep '^ROBOKASSA_PASSWORD_1=' .env | cut -d'=' -f2- | sed 's/^"//; s/"$//')
ROBOKASSA_PASSWORD_2=$(grep '^ROBOKASSA_PASSWORD_2=' .env | cut -d'=' -f2- | sed 's/^"//; s/"$//')
ROBOKASSA_TEST_MODE=$(grep '^ROBOKASSA_TEST_MODE=' .env | cut -d'=' -f2- | sed 's/^"//; s/"$//')
TELEGRAM_BOT_TOKEN=$(grep '^TELEGRAM_BOT_TOKEN=' .env | cut -d'=' -f2- | sed 's/^"//; s/"$//')
TELEGRAM_ADMIN_CHAT_ID=$(grep '^TELEGRAM_ADMIN_CHAT_ID=' .env | cut -d'=' -f2- | sed 's/^"//; s/"$//')
NEXT_PUBLIC_APP_URL=$(grep '^NEXT_PUBLIC_APP_URL=' .env | cut -d'=' -f2- | sed 's/^"//; s/"$//')

set_env "DATABASE_URL" "$DATABASE_URL"
set_env "JWT_SECRET" "$JWT_SECRET"
set_env "ADMIN_PASSWORD" "$ADMIN_PASSWORD"
set_env "NEXT_PUBLIC_APP_URL" "${NEXT_PUBLIC_APP_URL:-https://russiancupturnament.com}"
set_env "ROBOKASSA_MERCHANT_LOGIN" "$ROBOKASSA_MERCHANT_LOGIN"
set_env "ROBOKASSA_PASSWORD_1" "$ROBOKASSA_PASSWORD_1"
set_env "ROBOKASSA_PASSWORD_2" "$ROBOKASSA_PASSWORD_2"
set_env "ROBOKASSA_TEST_MODE" "$ROBOKASSA_TEST_MODE"
set_env "TELEGRAM_BOT_TOKEN" "$TELEGRAM_BOT_TOKEN"
set_env "TELEGRAM_ADMIN_CHAT_ID" "$TELEGRAM_ADMIN_CHAT_ID"

echo "All environment variables set."

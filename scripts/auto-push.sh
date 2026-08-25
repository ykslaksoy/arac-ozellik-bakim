#!/usr/bin/env bash
# Commit sonrası GitHub'a gönder
set -euo pipefail
cd "$(dirname "$0")/.."

if [ -z "${GITHUB_TOKEN:-}${GH_TOKEN:-}" ]; then
  echo "GITHUB_TOKEN yok — push atlandı"
  exit 0
fi

TOKEN="${GITHUB_TOKEN:-$GH_TOKEN}"
git remote set-url origin "https://x-access-token:${TOKEN}@github.com/ykslaksoy/arac-ozellik-bakim.git"
git push origin HEAD:main
git remote set-url origin "https://github.com/ykslaksoy/arac-ozellik-bakim.git"
echo "GitHub'a gönderildi."

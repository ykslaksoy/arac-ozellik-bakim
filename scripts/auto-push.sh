#!/usr/bin/env bash
# Commit sonrası GitHub'a gönder
set -euo pipefail
cd "$(dirname "$0")/.."

TOKEN="${GITHUB_TOKEN:-${GH_TOKEN:-}}"
if [ -z "$TOKEN" ] && [ -f /home/ubuntu/.config/arac-ozellik-bakim/github_token ]; then
  TOKEN="$(cat /home/ubuntu/.config/arac-ozellik-bakim/github_token)"
fi

if [ -z "$TOKEN" ]; then
  echo "GITHUB_TOKEN yok — push atlandı"
  exit 0
fi

git remote set-url origin "https://x-access-token:${TOKEN}@github.com/ykslaksoy/arac-ozellik-bakim.git"
git push origin HEAD:main
git remote set-url origin "https://github.com/ykslaksoy/arac-ozellik-bakim.git"
echo "GitHub'a gönderildi."

#!/usr/bin/env bash
# Commit sonrası GitHub'a gönder
set -euo pipefail
cd "$(dirname "$0")/.."

push_with_token() {
  local token="$1"
  git remote set-url origin "https://x-access-token:${token}@github.com/ykslaksoy/arac-ozellik-bakim.git"
  git push origin HEAD:main
  git remote set-url origin "https://github.com/ykslaksoy/arac-ozellik-bakim.git"
}

if command -v gh >/dev/null 2>&1 && gh auth status >/dev/null 2>&1; then
  gh auth setup-git >/dev/null 2>&1 || true
  git push origin HEAD:main
  echo "GitHub'a gönderildi."
  exit 0
fi

if [ -n "${GITHUB_TOKEN:-}" ]; then
  push_with_token "$GITHUB_TOKEN"
  echo "GitHub'a gönderildi."
  exit 0
fi

if [ -n "${GH_TOKEN:-}" ]; then
  push_with_token "$GH_TOKEN"
  echo "GitHub'a gönderildi."
  exit 0
fi

echo "GITHUB_TOKEN yok — push atlandı"
exit 0

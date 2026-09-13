#!/usr/bin/env bash
# Tüm uygulama repolarını ~/Documents/projeler altına klonlar.
set -euo pipefail
root="${HOME}/Documents/projeler"
mkdir -p "$root"
cd "$root"

for name in arac-ozellik-bakim dragon sofra-qr-menu; do
  if [ -d "$name" ]; then
    echo "Var, atlandı: $name"
    continue
  fi
  git clone "https://github.com/ykslaksoy/${name}.git"
done

echo
echo "GitHub’da henüz olmayanlar (elle New repository sonrası clone):"
echo "  kuran-hafizlik, dragon-studio, aricilik-egitim, desktop-tutorial, megane-3-ayna-sensor"
echo "Klasör: $root"

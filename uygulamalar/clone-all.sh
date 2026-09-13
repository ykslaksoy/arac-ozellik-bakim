#!/usr/bin/env bash
# Cursor pin’lerinin GitHub’da duranlarını klonlar.
set -euo pipefail
root="${HOME}/Documents/projeler"
mkdir -p "$root"
cd "$root"

if [ ! -d superarac ]; then
  git clone "https://github.com/ykslaksoy/arac-ozellik-bakim.git" superarac
else
  echo "Var, atlandı: superarac"
fi

if [ ! -d qrmenu ]; then
  git clone "https://github.com/ykslaksoy/sofra-qr-menu.git" qrmenu
else
  echo "Var, atlandı: qrmenu"
fi

if [ ! -d dragon ]; then
  git clone "https://github.com/ykslaksoy/dragon.git" dragon
else
  echo "Var, atlandı: dragon"
fi

echo
echo "GitHub’da henüz olmayan pinler (New repository sonrası clone):"
echo "  Süper Kuzu            ->  superkuzu"
echo "  SuperAri              ->  superari"
echo "  Kur’an Hafızlık Yolu  ->  kuran-hafizlik-yolu"
echo "  Dragon Studio         ->  dragon-studio"
echo "Klasör: $root"

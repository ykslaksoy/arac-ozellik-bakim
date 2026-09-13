#!/usr/bin/env bash
# Mevcut GitHub repolarını klonlar. SüperAraç reposu zaten var: arac-ozellik-bakim.
set -euo pipefail
root="${HOME}/Documents/projeler"
mkdir -p "$root"
cd "$root"

if [ ! -d arac-ozellik-bakim ]; then
  git clone "https://github.com/ykslaksoy/arac-ozellik-bakim.git" arac-ozellik-bakim
else
  echo "Var (mevcut repo), atlandı: arac-ozellik-bakim"
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

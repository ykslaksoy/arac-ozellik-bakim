# Mevcut GitHub repolarını klonlar. SüperAraç reposu zaten var: arac-ozellik-bakim.
$root = Join-Path $env:USERPROFILE "Documents\projeler"
New-Item -ItemType Directory -Force -Path $root | Out-Null
Set-Location $root

# Pin SüperAraç → mevcut repo (yeniden adlandırma yok)
if (-not (Test-Path "arac-ozellik-bakim")) {
  git clone "https://github.com/ykslaksoy/arac-ozellik-bakim.git" "arac-ozellik-bakim"
} else { Write-Host "Var (mevcut repo), atlandi: arac-ozellik-bakim" }

if (-not (Test-Path "qrmenu")) {
  git clone "https://github.com/ykslaksoy/sofra-qr-menu.git" "qrmenu"
} else { Write-Host "Var, atlandi: qrmenu" }

if (-not (Test-Path "dragon")) {
  git clone "https://github.com/ykslaksoy/dragon.git" "dragon"
} else { Write-Host "Var, atlandi: dragon" }

Write-Host ""
Write-Host "GitHub'da henuz olmayan pinler (New repository sonrasi clone):"
Write-Host "  Super Kuzu            ->  superkuzu"
Write-Host "  SuperAri              ->  superari"
Write-Host "  Kur'an Hafizlik Yolu  ->  kuran-hafizlik-yolu"
Write-Host "  Dragon Studio         ->  dragon-studio"
Write-Host "Klasor: $root"

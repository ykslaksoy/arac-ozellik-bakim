# Tüm uygulama repolarını Documents\projeler altına klonlar.
$root = Join-Path $env:USERPROFILE "Documents\projeler"
New-Item -ItemType Directory -Force -Path $root | Out-Null
Set-Location $root

$repos = @(
  "arac-ozellik-bakim",
  "dragon",
  "sofra-qr-menu"
)

foreach ($name in $repos) {
  if (Test-Path $name) {
    Write-Host "Var, atlandi: $name"
    continue
  }
  git clone "https://github.com/ykslaksoy/$name.git"
}

Write-Host ""
Write-Host "GitHub'da henuz olmayanlar (elle New repository sonrasi clone):"
Write-Host "  kuran-hafizlik, dragon-studio, aricilik-egitim, desktop-tutorial, megane-3-ayna-sensor"
Write-Host "Klasor: $root"
Write-Host "Cursor: File -> Open Folder ile bu klasoru veya icindeki tek bir uygulamayi ac."

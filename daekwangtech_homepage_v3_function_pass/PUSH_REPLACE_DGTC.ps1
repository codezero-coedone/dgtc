param(
  [string]$RepoUrl = "https://github.com/codezero-coedone/dgtc.git",
  [string]$WorkDir = "$env:USERPROFILE\Desktop\dgtc-final-push"
)

$ErrorActionPreference = "Stop"

Write-Host "[1/7] Clone repo..."
if (Test-Path $WorkDir) { Remove-Item -Recurse -Force $WorkDir }
git clone $RepoUrl $WorkDir
Set-Location $WorkDir

Write-Host "[2/7] Backup current main..."
$backup = "backup-before-final-replace-" + (Get-Date -Format "yyyyMMdd-HHmmss")
git checkout -b $backup
git push origin $backup

git checkout main

Write-Host "[3/7] Wipe existing repo content except .git..."
Get-ChildItem -Force | Where-Object { $_.Name -ne ".git" } | Remove-Item -Recurse -Force

Write-Host "[4/7] Copy final package content..."
$Source = Split-Path -Parent $MyInvocation.MyCommand.Path
Get-ChildItem -Force $Source | Where-Object { $_.Name -notin @(".git") } | Copy-Item -Destination $WorkDir -Recurse -Force

Write-Host "[5/7] Build and verify..."
npm run build
npm run verify

Write-Host "[6/7] Commit..."
git add .
git commit -m "Final Daekwang Tech company homepage delivery"

Write-Host "[7/7] Push..."
git push origin main

Write-Host "DONE. If push is rejected due to remote changes, run: git push origin main --force-with-lease"

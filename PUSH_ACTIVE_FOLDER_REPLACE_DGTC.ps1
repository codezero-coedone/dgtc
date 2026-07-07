param(
  [string]$RepoUrl = "https://github.com/codezero-coedone/dgtc.git",
  [string]$WorkDir = "$env:USERPROFILE\Desktop\dgtc-active-folder-final-push"
)

$ErrorActionPreference = "Stop"

Write-Host "[1/9] Clone repo..."
if (Test-Path $WorkDir) { Remove-Item -Recurse -Force $WorkDir }
git clone $RepoUrl $WorkDir
Set-Location $WorkDir

Write-Host "[2/9] Backup current main branch..."
$backup = "backup-before-active-folder-replace-" + (Get-Date -Format "yyyyMMdd-HHmmss")
git checkout -b $backup
git push origin $backup
git checkout main

Write-Host "[3/9] Replace active deployed folder..."
$sourceRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$sourceActive = Join-Path $sourceRoot "daekwangtech_homepage_v3_function_pass"
$targetActive = Join-Path $WorkDir "daekwangtech_homepage_v3_function_pass"
if (Test-Path $targetActive) { Remove-Item -Recurse -Force $targetActive }
New-Item -ItemType Directory -Force $targetActive | Out-Null
Copy-Item -Path (Join-Path $sourceActive "*") -Destination $targetActive -Recurse -Force

Write-Host "[4/9] Replace root wrangler assets directory to active folder dist..."
Copy-Item -Path (Join-Path $sourceRoot "wrangler.jsonc") -Destination (Join-Path $WorkDir "wrangler.jsonc") -Force

Write-Host "[5/9] Build active folder..."
Set-Location $targetActive
npm run build

Write-Host "[6/9] Verify active folder..."
npm run verify

Write-Host "[7/9] Commit..."
Set-Location $WorkDir
git add .
git commit -m "Replace active deployed Daekwang Tech source with CT-FIX final package"

Write-Host "[8/9] Push main..."
git push origin main

Write-Host "[9/9] Deploy to Cloudflare..."
npx wrangler deploy

Write-Host "DONE. Check: https://dgtc.ejdzm90.workers.dev/?v=ctfix-active-final#/home"
Write-Host "If push is rejected due to remote changes, run inside repo: git push origin main --force-with-lease"

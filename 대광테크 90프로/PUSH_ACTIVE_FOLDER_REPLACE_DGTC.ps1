param(
  [string]$RepoUrl = "https://github.com/codezero-coedone/dgtc.git",
  [string]$WorkDir = "$env:USERPROFILE\Desktop\dgtc-b1-10-final-push"
)

$ErrorActionPreference = "Stop"
$sourceRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$sourceActive = Join-Path $sourceRoot "daekwangtech_homepage_v3_function_pass"
$targetActive = Join-Path $WorkDir "daekwangtech_homepage_v3_function_pass"

Write-Host "[0/10] Check final CT-B1~B10 marker in package..."
$appPath = Join-Path $sourceActive "src\app.js"
$cssPath = Join-Path $sourceActive "src\styles.css"
if (!(Select-String -Path $appPath -Pattern "CT-B1~B10_FINAL_DELIVERY_LOCK" -Quiet)) { throw "CT-B1~B10 app marker missing. Push aborted." }
if (!(Select-String -Path $cssPath -Pattern "CT-B1~B10_FINAL_DELIVERY_LOCK" -Quiet)) { throw "CT-B1~B10 CSS marker missing. Push aborted." }

Write-Host "[1/10] Clone repo..."
if (Test-Path $WorkDir) { Remove-Item -Recurse -Force $WorkDir }
git clone $RepoUrl $WorkDir
Set-Location $WorkDir

Write-Host "[2/10] Backup current main branch..."
$backup = "backup-before-ct-b1-10-final-" + (Get-Date -Format "yyyyMMdd-HHmmss")
git checkout -b $backup
git push origin $backup
git checkout main

Write-Host "[3/10] Replace active deployed folder..."
if (Test-Path $targetActive) { Remove-Item -Recurse -Force $targetActive }
Copy-Item -Path $sourceActive -Destination $targetActive -Recurse -Force

Write-Host "[4/10] Replace root wrangler.jsonc..."
Copy-Item -Path (Join-Path $sourceRoot "wrangler.jsonc") -Destination (Join-Path $WorkDir "wrangler.jsonc") -Force

Write-Host "[5/10] Verify markers after copy..."
if (!(Select-String -Path (Join-Path $targetActive "src\app.js") -Pattern "CT-B1~B10_FINAL_DELIVERY_LOCK" -Quiet)) { throw "Copied active CT-B1~B10 app marker missing. Push aborted." }
if (!(Select-String -Path (Join-Path $targetActive "src\styles.css") -Pattern "CT-B1~B10_FINAL_DELIVERY_LOCK" -Quiet)) { throw "Copied active CT-B1~B10 CSS marker missing. Push aborted." }

Write-Host "[6/10] Build active folder..."
Set-Location $targetActive
npm install
npm run build

Write-Host "[7/10] Verify active folder..."
npm run verify
node --check src/app.js

Write-Host "[8/10] Commit..."
Set-Location $WorkDir
git add .
git commit -m "Finalize Daekwang Tech CT-B1-B10 delivery hardening"

Write-Host "[9/10] Push main..."
git push origin main

Write-Host "[10/10] Deploy to Cloudflare..."
npx wrangler deploy

Write-Host "DONE. Check: https://dgtc.ejdzm90.workers.dev/?v=ct-b1-10-final#/home"
Write-Host "If push is rejected due to remote changes, run inside repo: git push origin main --force-with-lease"

# DGTC active-folder final push package

This package keeps the current repo deployment rule stable:
- root wrangler.jsonc assets.directory = ./daekwangtech_homepage_v3_function_pass/dist
- final site source is placed inside daekwangtech_homepage_v3_function_pass/

Run in PowerShell:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\PUSH_ACTIVE_FOLDER_REPLACE_DGTC.ps1
```

The script clones the repo, creates a backup branch, replaces the active deployed folder, runs build/verify, commits, pushes, and runs wrangler deploy.

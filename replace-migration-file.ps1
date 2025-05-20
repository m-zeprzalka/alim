# PowerShell script to replace the problematic migration file
$ErrorActionPreference = "Stop"

Write-Host "Starting migration file fix process..." -ForegroundColor Cyan

# Paths
$migrationDir = Join-Path $PSScriptRoot "prisma\migrations\20250517205554_optimize_schema"
$migrationFile = Join-Path $migrationDir "migration.sql"
$fixedFile = Join-Path $PSScriptRoot "prisma\fix-migration.sql"
$backupFile = Join-Path $migrationDir "migration.sql.backup"

# Verify paths exist
if (-not (Test-Path $migrationDir)) {
    Write-Host "Error: Migration directory not found: $migrationDir" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $fixedFile)) {
    Write-Host "Error: Fixed migration file not found: $fixedFile" -ForegroundColor Red
    exit 1
}

# Create backup of original migration file
if (Test-Path $migrationFile) {
    Write-Host "Backing up original migration file to: $backupFile" -ForegroundColor Yellow
    Copy-Item -Path $migrationFile -Destination $backupFile -Force
} else {
    Write-Host "Original migration file not found at: $migrationFile" -ForegroundColor Yellow
}

# Copy fixed migration file to replace original
Write-Host "Copying fixed migration file to: $migrationFile" -ForegroundColor Yellow
Copy-Item -Path $fixedFile -Destination $migrationFile -Force

Write-Host "Migration file successfully replaced!" -ForegroundColor Green
Write-Host "`nNow you can run:" -ForegroundColor Cyan
Write-Host "npx prisma migrate resolve --applied 20250517205554_optimize_schema" -ForegroundColor White
Write-Host "npx prisma migrate reset --force" -ForegroundColor White

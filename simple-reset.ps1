# Simpler alternative method to reset database

# Set database URL from .env.local (LOCAL_DATABASE_URL)
$envContent = Get-Content -Path ".env.local" -ErrorAction SilentlyContinue
$localDbUrl = $envContent | Where-Object { $_ -match "LOCAL_DATABASE_URL=" } | ForEach-Object { $_.Split('=')[1].Trim('"') }

if ($localDbUrl) {
    $env:DATABASE_URL = $localDbUrl
    Write-Host "Using database URL from .env.local: $localDbUrl"
} else {
    $env:DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/alim"
    Write-Host "Using default database URL: $env:DATABASE_URL"
}

Write-Host "Resetting database and creating fresh schema..."

# Force Prisma to drop existing database and recreate it
npx prisma migrate reset --force

if ($LASTEXITCODE -eq 0) {
    Write-Host "Database reset successfully" -ForegroundColor Green
} else {
    Write-Host "Error resetting database" -ForegroundColor Red
    exit 1
}

# Generate Prisma client
Write-Host "Generating Prisma client..."
npx prisma generate

if ($LASTEXITCODE -eq 0) {
    Write-Host "Prisma client generated successfully" -ForegroundColor Green
    Write-Host "Database reset process completed successfully!" -ForegroundColor Green
} else {
    Write-Host "Error generating Prisma client" -ForegroundColor Red
    exit 1
}

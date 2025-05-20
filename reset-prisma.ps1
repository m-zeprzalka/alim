# Reset script for Prisma using the URL from .env.local

# Read the DATABASE_URL from .env.local
$envContent = Get-Content -Path ".env.local" -ErrorAction SilentlyContinue
$databaseUrlLine = $envContent | Where-Object { $_ -like "DATABASE_URL=*" }

if ($databaseUrlLine) {
    $databaseUrl = $databaseUrlLine -replace 'DATABASE_URL="(.*)"', '$1'
    $env:DATABASE_URL = $databaseUrl
    Write-Host "Using database URL from .env.local" -ForegroundColor Green
} else {
    Write-Host "DATABASE_URL not found in .env.local. Please check your environment configuration." -ForegroundColor Red
    exit 1
}

Write-Host "Starting database reset using Prisma Migrate..."

# Reset the database schema
Write-Host "Executing schema reset..."
npx prisma migrate reset --force

if ($LASTEXITCODE -eq 0) {
    Write-Host "Database reset successfully" -ForegroundColor Green
} else {
    Write-Host "Error resetting database. Check error messages above." -ForegroundColor Red
    exit 1
}

# Generate Prisma client
Write-Host "Generating Prisma client..."
npx prisma generate

if ($LASTEXITCODE -eq 0) {
    Write-Host "Prisma client generated successfully" -ForegroundColor Green
} else {
    Write-Host "Error generating Prisma client" -ForegroundColor Red
    exit 1
}

Write-Host "Database reset process completed successfully! ✅" -ForegroundColor Green
Write-Host "You can now restart your application to use the new database schema."

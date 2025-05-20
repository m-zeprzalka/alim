# Reset database and apply migrations from scratch

# Set your database URL here
$env:DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/alim"

Write-Host "Resetting database..."

# Check if psql command is available
$psqlExists = Get-Command psql -ErrorAction SilentlyContinue
if (-not $psqlExists) {
    Write-Host "Error: psql command not found. Make sure PostgreSQL is installed and added to PATH." -ForegroundColor Red
    exit 1
}

# Run the reset SQL script
psql $env:DATABASE_URL -f ./prisma/reset-database.sql

if ($LASTEXITCODE -eq 0) {
    Write-Host "Database reset successfully" -ForegroundColor Green
} else {
    Write-Host "Error resetting database" -ForegroundColor Red
    exit 1
}

Write-Host "Creating fresh schema..."

# Create new migration and apply it
npx prisma migrate dev --name initial_setup --create-only

if ($LASTEXITCODE -eq 0) {
    Write-Host "Migration created successfully" -ForegroundColor Green
} else {
    Write-Host "Error creating migration" -ForegroundColor Red
    exit 1
}

# Apply the migration
npx prisma migrate deploy

if ($LASTEXITCODE -eq 0) {
    Write-Host "Migration applied successfully" -ForegroundColor Green
} else {
    Write-Host "Error applying migration" -ForegroundColor Red
    exit 1
}

# Generate Prisma client
Write-Host "Generating Prisma client..."
npx prisma generate

if ($LASTEXITCODE -eq 0) {
    Write-Host "Prisma client generated successfully" -ForegroundColor Green
    Write-Host "Database reset and migration process completed successfully!" -ForegroundColor Green
} else {
    Write-Host "Error generating Prisma client" -ForegroundColor Red
    exit 1
}

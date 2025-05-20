# Full database reset and regeneration script

Write-Host "Starting complete database schema reset..." -ForegroundColor Yellow
Write-Host "This script will completely reset your database!"

# Ensure we're using the correct database URL
Write-Host "Checking environment variables..." -ForegroundColor Blue

# Check for API key in DATABASE_URL
$envDatabaseUrl = $env:DATABASE_URL
if (-not $envDatabaseUrl -or -not $envDatabaseUrl.Contains("api_key")) {
    # Try to load from .env file
    if (Test-Path ".env") {
        $envContent = Get-Content -Path ".env" -ErrorAction SilentlyContinue
        $databaseUrlLine = $envContent | Where-Object { $_ -like "DATABASE_URL=*" }
        
        if ($databaseUrlLine) {
            $dbUrl = $databaseUrlLine -replace 'DATABASE_URL="(.*)"', '$1'
            $env:DATABASE_URL = $dbUrl
            Write-Host "Loaded DATABASE_URL from .env file" -ForegroundColor Green
        }
    }
}

# Check if DATABASE_URL is properly set
if (-not $env:DATABASE_URL) {
    Write-Host "DATABASE_URL is not set! Please check your .env file" -ForegroundColor Red
    exit 1
}

# Generate a fresh migration to reset tables
Write-Host "Resetting Prisma schema..." -ForegroundColor Blue

try {
    # Generate Prisma Client
    Write-Host "Generating Prisma client..."
    npx prisma generate
    
    if ($LASTEXITCODE -ne 0) {
        throw "Failed to generate Prisma client"
    }

    # Generate SQL script for dropping tables
    Write-Host "Creating fresh migration..."
    npx prisma migrate dev --name reset_all --create-only
    
    if ($LASTEXITCODE -ne 0) {
        throw "Failed to create migration"
    }

    # Apply the migration
    Write-Host "Applying migration (this will reset your database)..."
    npx prisma migrate deploy
    
    if ($LASTEXITCODE -ne 0) {
        throw "Failed to apply migration"
    }
    
    # Generate client again to ensure it matches the schema
    Write-Host "Regenerating Prisma client after schema update..."
    npx prisma generate
    
    if ($LASTEXITCODE -ne 0) {
        throw "Failed to regenerate Prisma client"
    }
    
    # Verify database structure
    Write-Host "Verifying database structure..."
    npx prisma db pull --print
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Warning: Could not verify database structure, but migration might still have succeeded." -ForegroundColor Yellow
    }
    
    Write-Host "Database reset complete! ✅" -ForegroundColor Green
    
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
    exit 1
}

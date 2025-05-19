$env:DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/alim"

Write-Host "Setting up database environment..."

try {
    npx prisma migrate resolve --applied "20250519140000_add_hierarchical_court_fields"
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Migration marked as applied successfully"
    }
    
    Write-Host "Generating Prisma client..."
    npx prisma generate
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Prisma client generated successfully"
    }
    
    Write-Host "Migration process completed!"
} catch {
    Write-Host "Error during migration process: $_" -ForegroundColor Red
}

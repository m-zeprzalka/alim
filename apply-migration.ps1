# Prosty skrypt do uruchomienia migracji i wygenerowania klienta Prisma

Write-Host "🔧 Uruchamiam migrację bazy danych i generuję klienta Prisma..." -ForegroundColor Cyan

# Najpierw uruchamiamy migrację, aby zaktualizować bazę danych
Write-Host "📦 Wykonuję migrację bazy danych..." -ForegroundColor Yellow
npx prisma migrate dev

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Błąd podczas migracji bazy danych!" -ForegroundColor Red
    exit 1
}

# Następnie generujemy zaktualizowanego klienta Prisma
Write-Host "🔄 Generuję klienta Prisma..." -ForegroundColor Yellow
npx prisma generate

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Błąd podczas generowania klienta Prisma!" -ForegroundColor Red
    exit 1
}

# Sprawdzamy połączenie z bazą danych
Write-Host "🔌 Sprawdzam połączenie z bazą danych..." -ForegroundColor Yellow
npx tsx ./prisma/check-db.ts

Write-Host "✅ Wszystkie operacje zakończone sukcesem!" -ForegroundColor Green

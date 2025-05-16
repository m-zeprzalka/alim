# Prosty skrypt do uruchomienia migracji i wygenerowania klienta Prisma

Write-Host "Uruchamiam migracje bazy danych i generuje klienta Prisma..." -ForegroundColor Cyan

# Najpierw uruchamiamy migrację, aby zaktualizować bazę danych
Write-Host "Wykonuje migracje bazy danych..." -ForegroundColor Yellow
npx prisma migrate dev

if ($LASTEXITCODE -ne 0) {
    Write-Host "Blad podczas migracji bazy danych!" -ForegroundColor Red
    exit 1
}

# Następnie generujemy zaktualizowanego klienta Prisma
Write-Host "Generuje klienta Prisma..." -ForegroundColor Yellow
npx prisma generate

if ($LASTEXITCODE -ne 0) {
    Write-Host "Blad podczas generowania klienta Prisma!" -ForegroundColor Red
    exit 1
}

# Sprawdzamy połączenie z bazą danych
Write-Host "Sprawdzam polaczenie z baza danych..." -ForegroundColor Yellow
npx tsx ./prisma/check-db.ts

Write-Host "Wszystkie operacje zakonczone sukcesem!" -ForegroundColor Green

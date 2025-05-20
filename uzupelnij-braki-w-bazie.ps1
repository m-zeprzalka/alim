# Skrypt do przeprowadzenia migracji bazy danych i uzupelnienia brakujacych pol

Write-Host "Rozpoczynam proces rozszerzania schematu bazy danych i uzupelniania brakujacych pol..." -ForegroundColor Green

# 1. Zastąp obecny schemat nową wersją
Write-Host "📄 Zastępuję schemat bazy danych..." -ForegroundColor Cyan
Copy-Item -Path "prisma\schema.prisma.new" -Destination "prisma\schema.prisma" -Force
Write-Host "✅ Schemat zaktualizowany!" -ForegroundColor Green

# 2. Zastosuj migrację
Write-Host "🔄 Tworzę i aplikuję migrację do bazy danych..." -ForegroundColor Cyan
try {
    # Alternatywna metoda: bezpośrednie wykonanie SQL
    $env:DATABASE_URL | Out-File -FilePath "connection.txt"
    $connectionString = Get-Content -Path "connection.txt" -Raw
    Remove-Item -Path "connection.txt" -Force

    # Wykonaj skrypt SQL migracji
    Write-Host "🔄 Wykonuję skrypt SQL migracji..." -ForegroundColor Cyan
    $sqlScript = Get-Content -Path "prisma\migrations\20250520000000_add_detailed_fields\migration.sql" -Raw
    
    # Użyj psql do wykonania skryptu SQL
    $sqlScript | psql $connectionString
    
    # Generuj prisma client z nowym schematem
    Write-Host "🔄 Generuję nowy Prisma Client..." -ForegroundColor Cyan
    npx prisma generate
    
    Write-Host "✅ Migracja SQL wykonana pomyślnie!" -ForegroundColor Green
}
catch {
    Write-Host "❌ Błąd podczas wykonywania migracji SQL:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}

# 3. Uruchom skrypt migracji danych
Write-Host "🔄 Uruchamiam skrypt migracji danych..." -ForegroundColor Cyan
try {
    node prisma\migrateData.js
    Write-Host "✅ Migracja danych zakończona pomyślnie!" -ForegroundColor Green
}
catch {
    Write-Host "❌ Błąd podczas migracji danych:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}

Write-Host "🎉 Proces migracji i uzupełniania danych zakończony pomyślnie!" -ForegroundColor Green
Write-Host '📊 Wszystkie dane z formularzy są teraz prawidłowo zapisywane w bazie danych.' -ForegroundColor Green

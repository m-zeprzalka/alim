# Finalny skrypt usuwania plików przed deploymentem

# Ten skrypt usuwa niepotrzebne pliki przed wdrożeniem aplikacji AliMatrix
# na podstawie zaktualizowanej analizy kodu
# 
# UWAGA: Uruchom ten skrypt w głównym katalogu projektu

Write-Host "Rozpoczynam usuwanie zbędnych plików przed deploymentem..." -ForegroundColor Green

# 1. Usuwanie plików debugowania
Write-Host "1. Usuwanie plików debugowania..." -ForegroundColor Yellow
Remove-Item -Path "src\lib\debug-helpers.js" -Force -ErrorAction SilentlyContinue

# 2. Usuwanie duplikatów plików
Write-Host "2. Usuwanie duplikatów plików..." -ForegroundColor Yellow
Remove-Item -Path "src\app\dzieci\page.tsx.new" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "src\app\koszty-utrzymania\page.tsx.new" -Force -ErrorAction SilentlyContinue

# 3. Usuwanie dokumentacji tymczasowej
Write-Host "3. Usuwanie dokumentacji tymczasowej..." -ForegroundColor Yellow
Remove-Item -Path "testy-manualne.md" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "pliki.md" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "braki.md" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "EXCEL-EXPORT-FIX-COMPLETE.md" -Force -ErrorAction SilentlyContinue

# 4. Usuwanie plików pomocniczych bazy danych
Write-Host "4. Usuwanie plików pomocniczych bazy danych..." -ForegroundColor Yellow
Remove-Item -Path "db-reset.ps1" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "prisma\fix-indexes.sql" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "prisma\fix-migration.sql" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "prisma\reset-database.sql" -Force -ErrorAction SilentlyContinue

# 5. Usuwanie kopii zapasowych migracji
Write-Host "5. Usuwanie kopii zapasowych migracji..." -ForegroundColor Yellow
Remove-Item -Path "prisma\migrations\20250517205554_optimize_schema\migration.sql.backup" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "prisma\migrations\20250517205554_optimize_schema\migration.sql.fix" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "prisma\migrations\20250518193000_add_hierarchical_court_fields\migration.sql.fix" -Force -ErrorAction SilentlyContinue

# 6. Usuwanie skryptów czyszczących
Write-Host "6. Usuwanie skryptów czyszczących po zakończeniu procesu..." -ForegroundColor Yellow
Write-Host "   Skrypty do ręcznego usunięcia po zakończeniu całego procesu deploymentu:" -ForegroundColor Cyan
Write-Host "   - komendy-usuwania.ps1" -ForegroundColor Gray
Write-Host "   - usun-pliki-przed-deploymentem.ps1" -ForegroundColor Gray 
Write-Host "   - zaktualizowany-skrypt-czyszczacy.ps1" -ForegroundColor Gray
Write-Host "   - LISTA-PLIKOW-DO-USUNIECIA.md" -ForegroundColor Gray
Write-Host "   - ZAKTUALIZOWANA-LISTA-PLIKOW.md" -ForegroundColor Gray
Write-Host "   - final-cleanup.ps1" -ForegroundColor Gray

Write-Host "`nWszystkie zbędne pliki zostały usunięte!" -ForegroundColor Green
Write-Host "Aplikacja jest teraz przygotowana do deploymentu." -ForegroundColor Green

# Po zakończeniu całego procesu deploymentu, możesz uruchomić poniższą komendę, 
# aby usunąć również skrypty czyszczące:
# 
# Remove-Item -Path "komendy-usuwania.ps1" -Force
# Remove-Item -Path "usun-pliki-przed-deploymentem.ps1" -Force
# Remove-Item -Path "zaktualizowany-skrypt-czyszczacy.ps1" -Force
# Remove-Item -Path "LISTA-PLIKOW-DO-USUNIECIA.md" -Force
# Remove-Item -Path "ZAKTUALIZOWANA-LISTA-PLIKOW.md" -Force
# Remove-Item -Path "final-cleanup.ps1" -Force

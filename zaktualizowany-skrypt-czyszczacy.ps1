# Zaktualizowany skrypt PowerShell do usunięcia plików przed deploymentem

# Ten skrypt zawiera komendy PowerShell do usunięcia plików, które należy usunąć
# przed wdrożeniem aplikacji AliMatrix - zaktualizowana wersja
# 
# WAŻNE: Przed uruchomieniem skryptu:
# 1. Zrób kopię zapasową repozytorium
# 2. Uruchom skrypt z głównego katalogu projektu
# 3. Sprawdź logi, aby upewnić się, że nie wystąpiły błędy
#
# Autor: GitHub Copilot, 20.05.2025

Write-Host "Rozpoczynam usuwanie zbędnych plików przed deploymentem..." -ForegroundColor Yellow

# Sekcja 1: Pliki .new - duplikaty kodu
Write-Host "Usuwanie duplikatów .new..." -ForegroundColor Cyan
Remove-Item -Path "src/app/dzieci/page.tsx.new" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "src/app/koszty-utrzymania/page.tsx.new" -Force -ErrorAction SilentlyContinue
Write-Host "Pliki .new zostały usunięte." -ForegroundColor Green

# Sekcja 2: Pliki pomocnicze do debugowania
Write-Host "Usuwanie plików debugowania..." -ForegroundColor Cyan
Remove-Item -Path "src/lib/debug-helpers.js" -Force -ErrorAction SilentlyContinue
Write-Host "Pliki debugowania zostały usunięte." -ForegroundColor Green

# Sekcja 3: Skrypty narzędziowe
Write-Host "Usuwanie skryptów narzędziowych..." -ForegroundColor Cyan
Remove-Item -Path "db-reset.ps1" -Force -ErrorAction SilentlyContinue
Write-Host "Skrypty narzędziowe zostały usunięte." -ForegroundColor Green

# Sekcja 4: Dokumentacja robocza
Write-Host "Usuwanie dokumentacji roboczej..." -ForegroundColor Cyan
Remove-Item -Path "testy-manualne.md" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "pliki.md" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "braki.md" -Force -ErrorAction SilentlyContinue
Write-Host "Dokumentacja robocza została usunięta." -ForegroundColor Green

# Sekcja 5: Pliki migracyjne pomocnicze
Write-Host "Usuwanie pomocniczych plików migracji..." -ForegroundColor Cyan
Remove-Item -Path "prisma/migrations/20250517205554_optimize_schema/migration.sql.backup" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "prisma/migrations/20250517205554_optimize_schema/migration.sql.fix" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "prisma/migrations/20250518193000_add_hierarchical_court_fields/migration.sql.fix" -Force -ErrorAction SilentlyContinue
Write-Host "Pomocnicze pliki migracji zostały usunięte." -ForegroundColor Green

# Sekcja 6: Pomocnicze skrypty SQL
Write-Host "Usuwanie pomocniczych plików SQL..." -ForegroundColor Cyan
Remove-Item -Path "prisma/fix-indexes.sql" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "prisma/fix-migration.sql" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "prisma/reset-database.sql" -Force -ErrorAction SilentlyContinue
Write-Host "Pomocnicze pliki SQL zostały usunięte." -ForegroundColor Green

# Sekcja 7: Pliki wygenerowane przez skrypty czyszczące
Write-Host "Usuwanie skryptów czyszczących (po zakończeniu całego procesu)..." -ForegroundColor Cyan
Write-Host "Te pliki zostaną usunięte na końcu procesu deploymentu:" -ForegroundColor Cyan
Write-Host "- komendy-usuwania.ps1" -ForegroundColor Gray
Write-Host "- usun-pliki-przed-deploymentem.ps1" -ForegroundColor Gray
Write-Host "- LISTA-PLIKOW-DO-USUNIECIA.md" -ForegroundColor Gray
Write-Host "- ZAKTUALIZOWANA-LISTA-PLIKOW.md" -ForegroundColor Gray

Write-Host "`nWszystkie zbędne pliki zostały usunięte!" -ForegroundColor Green
Write-Host "Aplikacja jest gotowa do deploymentu." -ForegroundColor Green

# -------------------------------------------------------------------------------
# Alternatywnie, możesz użyć poniższych indywidualnych komend w konsoli PowerShell:
# -------------------------------------------------------------------------------
<#
# Duplikaty .new
rm src/app/dzieci/page.tsx.new
rm src/app/koszty-utrzymania/page.tsx.new

# Pliki debugowania
rm src/lib/debug-helpers.js

# Skrypty narzędziowe
rm db-reset.ps1

# Dokumentacja robocza
rm testy-manualne.md
rm pliki.md
rm braki.md

# Pomocnicze pliki migracji
rm prisma/migrations/20250517205554_optimize_schema/migration.sql.backup
rm prisma/migrations/20250517205554_optimize_schema/migration.sql.fix
rm prisma/migrations/20250518193000_add_hierarchical_court_fields/migration.sql.fix

# Pomocnicze pliki SQL
rm prisma/fix-indexes.sql
rm prisma/fix-migration.sql
rm prisma/reset-database.sql

# Po zakończeniu procesu deploymentu:
rm komendy-usuwania.ps1
rm usun-pliki-przed-deploymentem.ps1
rm LISTA-PLIKOW-DO-USUNIECIA.md
rm ZAKTUALIZOWANA-LISTA-PLIKOW.md
#>

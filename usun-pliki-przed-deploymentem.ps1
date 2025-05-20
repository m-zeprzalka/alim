# Skrypt PowerShell do usunięcia plików przed deploymentem

# Ten skrypt zawiera komendy PowerShell do usunięcia wszystkich plików wymienionych w dokumencie 
# LISTA-PLIKOW-DO-USUNIECIA.md
# 
# WAŻNE: Przed uruchomieniem skryptu:
# 1. Zrób kopię zapasową repozytorium
# 2. Uruchom skrypt z głównego katalogu projektu
# 3. Sprawdź logi, aby upewnić się, że nie wystąpiły błędy
#
# Autor: GitHub Copilot, 20.05.2025

# Sekcja 1: Pliki testowe
Write-Host "Usuwanie plików testowych..." -ForegroundColor Yellow

Remove-Item -Path "check-database.js" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "check-database-enhanced.js" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "check-database.ts" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "check-db.js" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "check-env.js" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "check-prisma-loading.js" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "check-schema.js" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "court-data-test.js" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "court-data-test.mjs" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "db-test.js" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "env-check.js" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "test-connection.js" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "test-console.js" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "test-courts-hierarchical.mjs" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "test-db-connection.js" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "test-db-connection-enhanced.js" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "test-form-submission.js" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "test-formularze.js" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "test-prisma-connection.js" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "test-script.ps1" -Force -ErrorAction SilentlyContinue

Write-Host "Pliki testowe zostały usunięte." -ForegroundColor Green

# Sekcja 2: Skrypty narzędziowe
Write-Host "Usuwanie skryptów narzędziowych..." -ForegroundColor Yellow

Remove-Item -Path "fix-database.js" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "fix-migration.js" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "fix-migration-debug.js" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "fix-migration-status.js" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "fix-migration-status-enhanced.js" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "apply-migration.ps1" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "apply-migration.sh" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "mark-migration-applied.js" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "query-database.js" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "replace-migration-file.js" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "replace-migration-file.ps1" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "reset-database.ps1" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "reset-database.sh" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "reset-db.js" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "reset-direct.js" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "reset-prisma.ps1" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "simple-reset.ps1" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "simple-reset.sh" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "sync-form-data.js" -Force -ErrorAction SilentlyContinue

Write-Host "Skrypty narzędziowe zostały usunięte." -ForegroundColor Green

# Sekcja 3: Pliki tymczasowe i duplikaty
Write-Host "Usuwanie plików tymczasowych i duplikatów..." -ForegroundColor Yellow

Remove-Item -Path "prisma/schema.prisma.new" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "prisma/check-db.ts.new" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "prisma/run-schema-migration.ts" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "prisma/apply-migration.js" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "prisma/check-db.ts" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "prisma/check-tables.js" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "prisma/db-check.js" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "prisma/check-form-submission.sql" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "prisma/test-court-fields.ts" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "prisma/run-migration.ts" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "src/app/api/subscribe/route.ts.new" -Force -ErrorAction SilentlyContinue

# Usuwanie plików z rozszerzeniami .bak, .tmp, .old
Write-Host "Usuwanie wszystkich plików .bak, .tmp, .old..." -ForegroundColor Yellow
Get-ChildItem -Path "." -Recurse -Include "*.bak", "*.tmp", "*.old" | Remove-Item -Force

Write-Host "Pliki tymczasowe i duplikaty zostały usunięte." -ForegroundColor Green

# Sekcja 4: Dokumentacja robocza
Write-Host "Usuwanie dokumentacji roboczej..." -ForegroundColor Yellow

Remove-Item -Path "EXCEL-EXPORT-FIX.md" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "EXCEL-EXPORT-FIX-COMPLETE.md" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "testy-kontrolne-mvp.md" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "testy-manualne.md" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "pliki.md" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "braki.md" -Force -ErrorAction SilentlyContinue

Write-Host "Dokumentacja robocza została usunięta." -ForegroundColor Green

Write-Host "Wszystkie pliki zostały usunięte pomyślnie!" -ForegroundColor Green
Write-Host "UWAGA: Skrypt zachował kluczowe pliki dokumentacji: DOKUMENTACJA.md, INSTRUKCJA-WDROZENIA.md, MVP.md, SECURITY.md, STACK.md" -ForegroundColor Cyan

# -------------------------------------------------------------------------------
# Alternatywnie, możesz użyć poniższych indywidualnych komend w konsoli PowerShell:
# -------------------------------------------------------------------------------

<# 
# Pliki testowe
rm check-database.js
rm check-database-enhanced.js
rm check-database.ts
rm check-db.js
rm check-env.js
rm check-prisma-loading.js
rm check-schema.js
rm court-data-test.js
rm court-data-test.mjs
rm db-test.js
rm env-check.js
rm test-connection.js
rm test-console.js
rm test-courts-hierarchical.mjs
rm test-db-connection.js
rm test-db-connection-enhanced.js
rm test-form-submission.js
rm test-formularze.js
rm test-prisma-connection.js
rm test-script.ps1

# Skrypty narzędziowe
rm fix-database.js
rm fix-migration.js
rm fix-migration-debug.js
rm fix-migration-status.js
rm fix-migration-status-enhanced.js
rm apply-migration.ps1
rm apply-migration.sh
rm mark-migration-applied.js
rm query-database.js
rm replace-migration-file.js
rm replace-migration-file.ps1
rm reset-database.ps1
rm reset-database.sh
rm reset-db.js
rm reset-direct.js
rm reset-prisma.ps1
rm simple-reset.ps1
rm simple-reset.sh
rm sync-form-data.js

# Pliki tymczasowe i duplikaty
rm prisma/schema.prisma.new
rm prisma/check-db.ts.new
rm prisma/run-schema-migration.ts
rm prisma/apply-migration.js
rm prisma/check-db.ts
rm prisma/check-tables.js
rm prisma/db-check.js
rm prisma/check-form-submission.sql
rm prisma/test-court-fields.ts
rm prisma/run-migration.ts
rm src/app/api/subscribe/route.ts.new
Get-ChildItem -Path . -Recurse -Include *.bak, *.tmp, *.old | Remove-Item -Force

# Dokumentacja robocza
rm EXCEL-EXPORT-FIX.md
rm EXCEL-EXPORT-FIX-COMPLETE.md
rm testy-kontrolne-mvp.md
rm testy-manualne.md
rm pliki.md
rm braki.md
#>

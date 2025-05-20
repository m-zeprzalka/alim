# Komendy PowerShell do usunięcia plików przed deploymentem

# Poniższe komendy możesz wkleić bezpośrednio do konsoli PowerShell
# Wykonując je jedna po drugiej lub grupami

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

# Usuwanie wszystkich plików .bak, .tmp, .old
Get-ChildItem -Path . -Recurse -Include *.bak, *.tmp, *.old | Remove-Item -Force

# Dokumentacja robocza
rm EXCEL-EXPORT-FIX.md
rm EXCEL-EXPORT-FIX-COMPLETE.md
rm testy-kontrolne-mvp.md
rm testy-manualne.md
rm pliki.md
rm braki.md

# Aby wykonać wszystkie operacje jednym poleceniem, uruchom skrypt:
# .\usun-pliki-przed-deploymentem.ps1

# Lista plików do usunięcia przed deploymentem

Poniżej znajduje się lista plików, które należy usunąć przed wdrożeniem aplikacji AliMatrix w środowisku produkcyjnym. Usunięcie tych plików pomoże zmniejszyć rozmiar aplikacji, usunąć potencjalne zagrożenia bezpieczeństwa i uprościć strukturę projektu.

## Pliki testowe

| Plik                             | Powód usunięcia                                      |
| -------------------------------- | ---------------------------------------------------- |
| `check-database.js`              | Skrypt testowy do sprawdzania zawartości bazy danych |
| `check-database-enhanced.js`     | Rozszerzony skrypt testowy bazy danych               |
| `check-database.ts`              | Skrypt testowy w TypeScript                          |
| `check-db.js`                    | Duplikat skryptu sprawdzania bazy danych             |
| `check-env.js`                   | Skrypt testowy zmiennych środowiskowych              |
| `check-prisma-loading.js`        | Skrypt testowy ładowania Prisma                      |
| `check-schema.js`                | Skrypt testowy sprawdzania schematu                  |
| `court-data-test.js`             | Test danych sądowych                                 |
| `court-data-test.mjs`            | Test danych sądowych (wersja ESM)                    |
| `db-test.js`                     | Test bazy danych                                     |
| `env-check.js`                   | Duplikat sprawdzania zmiennych środowiskowych        |
| `test-connection.js`             | Test połączenia                                      |
| `test-console.js`                | Test logowania                                       |
| `test-courts-hierarchical.mjs`   | Test hierarchicznej struktury sądów                  |
| `test-db-connection.js`          | Test połączenia z bazą danych                        |
| `test-db-connection-enhanced.js` | Rozszerzony test połączenia z bazą                   |
| `test-form-submission.js`        | Test wysyłania formularza                            |
| `test-formularze.js`             | Test formularzy                                      |
| `test-prisma-connection.js`      | Test połączenia Prisma                               |
| `test-script.ps1`                | Skrypt testowy PowerShell                            |

## Skrypty narzędziowe (do zachowania w repozytorium, ale nie w deploymencie)

| Plik                               | Powód usunięcia                          |
| ---------------------------------- | ---------------------------------------- |
| `fix-database.js`                  | Skrypt naprawy bazy danych               |
| `fix-migration.js`                 | Skrypt naprawy migracji                  |
| `fix-migration-debug.js`           | Debugowanie migracji                     |
| `fix-migration-status.js`          | Sprawdzanie statusu migracji             |
| `fix-migration-status-enhanced.js` | Rozszerzone sprawdzanie statusu          |
| `apply-migration.ps1`              | Skrypt aplikowania migracji (PowerShell) |
| `apply-migration.sh`               | Skrypt aplikowania migracji (Bash)       |
| `mark-migration-applied.js`        | Oznaczanie migracji jako zastosowanej    |
| `query-database.js`                | Skrypt odpytywania bazy danych           |
| `replace-migration-file.js`        | Zastępowanie pliku migracji              |
| `replace-migration-file.ps1`       | Zastępowanie pliku migracji (PowerShell) |
| `reset-database.ps1`               | Reset bazy danych (PowerShell)           |
| `reset-database.sh`                | Reset bazy danych (Bash)                 |
| `reset-db.js`                      | Reset bazy danych (JavaScript)           |
| `reset-direct.js`                  | Bezpośredni reset bazy danych            |
| `reset-prisma.ps1`                 | Reset klienta Prisma                     |
| `simple-reset.ps1`                 | Prosty reset (PowerShell)                |
| `simple-reset.sh`                  | Prosty reset (Bash)                      |
| `sync-form-data.js`                | Synchronizacja danych formularza         |

## Pliki tymczasowe i duplikaty

| Plik                                   | Powód usunięcia                  |
| -------------------------------------- | -------------------------------- |
| `prisma/schema.prisma.new`             | Tymczasowy nowy schemat          |
| `prisma/check-db.ts.new`               | Duplikat skryptu                 |
| `prisma/run-schema-migration.ts`       | Tymczasowy skrypt migracji       |
| `prisma/apply-migration.js`            | Tymczasowy skrypt migracji       |
| `prisma/check-db.ts`                   | Skrypt testowy                   |
| `prisma/check-tables.js`               | Skrypt testowy sprawdzania tabel |
| `prisma/db-check.js`                   | Duplikat skryptu sprawdzania     |
| `prisma/check-form-submission.sql`     | Testowe zapytanie SQL            |
| `prisma/test-court-fields.ts`          | Test pól sądowych                |
| `prisma/run-migration.ts`              | Stary skrypt migracji            |
| `src/app/api/subscribe/route.ts.new`   | Duplikat endpointu API           |
| Wszystkie pliki `.bak`, `.tmp`, `.old` | Kopie zapasowe i tymczasowe      |

## Dokumentacja robocza (zachować główną dokumentację)

| Plik                           | Powód usunięcia                                     |
| ------------------------------ | --------------------------------------------------- |
| `EXCEL-EXPORT-FIX.md`          | Robocza dokumentacja naprawy eksportu               |
| `EXCEL-EXPORT-FIX-COMPLETE.md` | Zakończona naprawa - zbędna                         |
| `testy-kontrolne-mvp.md`       | Testy kontrolne MVP                                 |
| `testy-manualne.md`            | Testy manualne                                      |
| `pliki.md`                     | Lista plików (ta lista zastępuje ten plik)          |
| `braki.md`                     | Lista braków (zawartość ujęta w nowej dokumentacji) |

## Uwaga

Przy usuwaniu plików należy pamiętać o:

1. Zarchiwizowaniu kopii repozytorium przed usuwaniem plików
2. Zachowaniu kluczowych plików dokumentacji (`DOKUMENTACJA.md`, `INSTRUKCJA-WDROZENIA.md`, `MVP.md`, `SECURITY.md`, `STACK.md`)
3. Zachowaniu wszystkich plików konfiguracyjnych takich jak `.env.example`, `tsconfig.json`, `next.config.ts`, itp.
4. Usunięciu wszystkich danych testowych z bazy produkcyjnej

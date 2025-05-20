# Zaktualizowana lista plików do usunięcia przed deploymentem

Na podstawie aktualnego stanu projektu, poniżej znajduje się zaktualizowana lista plików, które należy usunąć przed wdrożeniem. Część z nich już została usunięta, ale warto sprawdzić pozostałe.

## Pliki .new - duplikaty kodu

```powershell
# Usunięcie duplikatów .new w /src
rm src/app/dzieci/page.tsx.new
rm src/app/koszty-utrzymania/page.tsx.new
```

## Pliki pomocnicze do debugowania

```powershell
# Usunięcie plików debugowania
rm src/lib/debug-helpers.js
```

## Skrypty narzędziowe

```powershell
# Skrypty narzędziowe
rm db-reset.ps1
```

## Dokumentacja robocza

```powershell
# Dokumentacja robocza
rm testy-manualne.md
rm pliki.md
rm braki.md
```

## Pliki migracyjne pomocnicze

```powershell
# Pomocnicze pliki migracji
rm prisma/migrations/20250517205554_optimize_schema/migration.sql.backup
rm prisma/migrations/20250517205554_optimize_schema/migration.sql.fix
rm prisma/migrations/20250518193000_add_hierarchical_court_fields/migration.sql.fix
```

## Pomocnicze skrypty SQL

```powershell
# Pomocnicze pliki SQL (zachować w repozytorium, ale nie w deploymencie)
rm prisma/fix-indexes.sql
rm prisma/fix-migration.sql
rm prisma/reset-database.sql
```

## Pliki wygenerowane przez skrypty czyszczące

```powershell
# Skrypty czyszczące
rm komendy-usuwania.ps1
rm usun-pliki-przed-deploymentem.ps1
rm LISTA-PLIKOW-DO-USUNIECIA.md
```

## Uwaga

Przy usuwaniu plików należy pamiętać o:

1. Zarchiwizowaniu kopii repozytorium przed usuwaniem plików
2. Zachowaniu kluczowych plików dokumentacji (`DOKUMENTACJA-PRZED-DEPLOYMENTEM.md`, `MVP.md`)
3. Zachowaniu wszystkich plików konfiguracyjnych takich jak `.env.example`, `tsconfig.json`, `next.config.ts`, itp.

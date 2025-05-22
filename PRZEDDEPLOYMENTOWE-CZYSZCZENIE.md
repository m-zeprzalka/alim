# Przygotowanie aplikacji AliMatrix do wdrożenia produkcyjnego

Ten dokument zawiera kompleksową analizę plików, które należy usunąć przed deploymentem produkcyjnym aplikacji AliMatrix, oraz checklistę niezbędnych działań.

## Pliki do usunięcia

Poniżej znajduje się lista plików i katalogów, które powinny zostać usunięte przed deploymentem produkcyjnym, wraz z komendami do ich usunięcia w PowerShell.

### 1. Pliki testowe i debugujące

```powershell
# Usuwanie plików testowych w głównym katalogu
Remove-Item -Path "C:\Users\micha\Desktop\AliMatrix-new\testy-manualne.md" -Force
```

### 6. Dane testowe i debugujące w kodzie

```powershell
# Uwaga: Te pliki wymagają manualnej edycji - usuń konsole.log i dane testowe
# src\app\wysylka\page.tsx - usuń console.log
# src\lib\form-handlers.ts - usuń console.log i debugowanie
# src\lib\client-security.ts - usuń console.log
```

### 7. Cache i pliki tymczasowe

```powershell

# Usuwanie plików tymczasowych
Remove-Item -Path "C:\Users\micha\Desktop\AliMatrix-new" -Include "*.tmp", "*.temp", "*.log" -Recurse -Force
```

### 8. Konfiguracje deweloperskie

```powershell
# Usuwanie plików specyficznych dla środowiska deweloperskiego
Remove-Item -Path "C:\Users\micha\Desktop\AliMatrix-new\.git" -Recurse -Force
Remove-Item -Path "C:\Users\micha\Desktop\AliMatrix-new\.vscode" -Recurse -Force -ErrorAction SilentlyContinue
```

## CHECKLISTA PRIORYTETÓW PRZED DEPLOYMENTEM

### 1. Bezpieczeństwo

- [ ] **NATYCHMIAST ZMIEŃ KLUCZ ADMIN_API_KEY** - obecny "tajny_klucz_admin_2025" jest widoczny w pliku .env i stanowi poważne zagrożenie bezpieczeństwa
- [ ] Usuń wszystkie tokeny deweloperskie z pliku .env
- [ ] Sprawdź czy aplikacja nie ma zahardkodowanych kluczy i tokenów dostępowych
- [ ] Wyłącz wszystkie console.log z kodem wrażliwym
- [ ] Upewnij się, że API jest odpowiednio zabezpieczone (sprawdź rate limiting)

### 2. Optymalizacja bazy danych

- [ ] Sprawdź czy wszystkie migracje są zakończone i działają poprawnie
- [ ] Upewnij się, że schemat bazy danych jest finalny
- [ ] Zweryfikuj indeksy w bazie danych dla optymalnej wydajności
- [ ] Sprawdź czy połączenie z bazą danych jest skonfigurowane na produkcyjne parametry

### 3. Konfiguracja środowiska

- [ ] Ustaw NODE_ENV=production
- [ ] Skonfiguruj zmienne środowiskowe dla produkcji
- [ ] Upewnij się, że aplikacja używa odpowiednich limitów zasobów
- [ ] Sprawdź konfigurację CORS dla API produkcyjnego

### 4. Optymalizacja frontendu

- [ ] Wyłącz wszystkie konsole.log i debugowanie
- [ ] Upewnij się, że bundle Next.js jest zoptymalizowany
- [ ] Sprawdź czy obrazy są zoptymalizowane
- [ ] Zweryfikuj czy wszystkie zależności są potrzebne w package.json

### 5. Testowanie finalne

- [ ] Przeprowadź testy wydajnościowe
- [ ] Przetestuj formularz wysyłki od początku do końca
- [ ] Sprawdź czy dane są prawidłowo zapisywane w bazie
- [ ] Zweryfikuj poprawność zapisywania kosztów utrzymania dzieci (po Twojej ostatniej poprawce)
- [ ] Przetestuj obsługę błędów i przypadki brzegowe

### 6. Dokumentacja

- [ ] Zachowaj tylko dokumentację niezbędną dla użytkowników końcowych
- [ ] Usuń dokumentację deweloperską i notatki robocze
- [ ] Upewnij się, że instrukcje obsługi są aktualne

### 7. Backup

- [ ] Zrób backup całego projektu przed usunięciem plików
- [ ] Zrób backup bazy danych
- [ ] Zachowaj kopię plików konfiguracyjnych

## UWAGI KOŃCOWE

1. Po usunięciu plików zalecane jest ponowne zbudowanie aplikacji i przetestowanie wszystkich funkcjonalności.
2. Pamiętaj o zmianie wrażliwych kluczy i tokenów w środowisku produkcyjnym.
3. Wykonaj deploy najpierw na środowisko stagingowe, jeśli to możliwe.
4. Monitoruj logi aplikacji po wdrożeniu w poszukiwaniu błędów.
5. Ustaw odpowiednie powiadomienia o błędach na produkcji.

## SKRYPT AUTOMATYCZNEGO CZYSZCZENIA

Poniżej znajduje się skrypt PowerShell, który automatyzuje większość operacji czyszczenia:

```powershell
# Skrypt czyszczący przed deploymentem produkcyjnym
# UWAGA: Wykonaj kopię zapasową projektu przed uruchomieniem skryptu!

$projectPath = "C:\Users\micha\Desktop\AliMatrix-new"
cd $projectPath

# Zapisz listę plików przed czyszczeniem
Get-ChildItem -Recurse | Out-File -FilePath "$projectPath\lista_plikow_przed_czyszczeniem.txt"

# 1. Usuń pliki testowe i debugujące
$testFiles = @(
    "$projectPath\test-connection.js",
    "$projectPath\test-db-connection.js",
    "$projectPath\test-nowe-pola.js",
    "$projectPath\testy-manualne.md"
)
foreach ($file in $testFiles) {
    if (Test-Path $file) {
        Remove-Item -Path $file -Force
        Write-Host "Usunięto: $file" -ForegroundColor Green
    }
}

# 2. Usuń katalogi testowe
$testDirs = @(
    "$projectPath\src\app\test",
    "$projectPath\src\app\test-courts",
    "$projectPath\src\app\test-courts-hierarchical",
    "$projectPath\src\app\new-test",
    "$projectPath\src\app\alternatywna"
)
foreach ($dir in $testDirs) {
    if (Test-Path $dir) {
        Remove-Item -Path $dir -Recurse -Force
        Write-Host "Usunięto katalog: $dir" -ForegroundColor Green
    }
}

# 3. Usuń dokumentację deweloperską
$docFiles = @(
    "$projectPath\braki.md",
    "$projectPath\DOKUMENTACJA-AKTUALIZACJI-BAZY.md",
    "$projectPath\INSTRUKCJA-IMPLEMENTACJI-KORELACJI.md",
    "$projectPath\INSTRUKCJA-KORELACJI-FRONTEND-BAZA.md",
    "$projectPath\LISTA-PLIKOW-DO-USUNIECIA.md",
    "$projectPath\MVP.md",
    "$projectPath\pliki.md",
    "$projectPath\PODSUMOWANIE-ZMIAN.md",
    "$projectPath\ZAKTUALIZOWANA-LISTA-PLIKOW.md"
)
foreach ($file in $docFiles) {
    if (Test-Path $file) {
        Remove-Item -Path $file -Force
        Write-Host "Usunięto: $file" -ForegroundColor Green
    }
}

# 4. Usuń skrypty pomocnicze
$helperScripts = @(
    "$projectPath\db-fix.js",
    "$projectPath\db-reset.ps1",
    "$projectPath\final-cleanup.ps1",
    "$projectPath\komendy-usuwania.ps1",
    "$projectPath\migracja-nowy.ps1",
    "$projectPath\sync-schema.js",
    "$projectPath\usun-pliki-przed-deploymentem.ps1",
    "$projectPath\uzupelnij-braki-w-bazie.ps1",
    "$projectPath\zaktualizowany-skrypt-czyszczacy.ps1"
)
foreach ($file in $helperScripts) {
    if (Test-Path $file) {
        Remove-Item -Path $file -Force
        Write-Host "Usunięto: $file" -ForegroundColor Green
    }
}

# 5. Usuń pliki kopii zapasowych i tymczasowe Prisma
$prismaFiles = @(
    "$projectPath\prisma\schema.prisma.bak",
    "$projectPath\prisma\schema.prisma.new",
    "$projectPath\prisma\fix-indexes.sql",
    "$projectPath\prisma\fix-migration.sql",
    "$projectPath\prisma\reset-database.sql",
    "$projectPath\prisma\migrateData.js",
    "$projectPath\prisma\migrateFormData.js"
)
foreach ($file in $prismaFiles) {
    if (Test-Path $file) {
        Remove-Item -Path $file -Force
        Write-Host "Usunięto: $file" -ForegroundColor Green
    }
}

# 6. Usuń cache Next.js
if (Test-Path "$projectPath\.next\cache") {
    Remove-Item -Path "$projectPath\.next\cache" -Recurse -Force
    Write-Host "Usunięto cache Next.js" -ForegroundColor Green
}

# 7. Usuń wszystkie pliki tymczasowe
Get-ChildItem -Path $projectPath -Include "*.tmp", "*.temp", "*.log" -Recurse | ForEach-Object {
    Remove-Item $_.FullName -Force
    Write-Host "Usunięto plik tymczasowy: $($_.FullName)" -ForegroundColor Green
}

# 8. Usunięcie katalogu git (opcjonalne)
if ((Read-Host "Czy usunąć katalog .git? (T/N)").ToUpper() -eq "T") {
    if (Test-Path "$projectPath\.git") {
        Remove-Item -Path "$projectPath\.git" -Recurse -Force
        Write-Host "Usunięto katalog .git" -ForegroundColor Green
    }
}

# Zapisz listę plików po czyszczeniu
Get-ChildItem -Recurse | Out-File -FilePath "$projectPath\lista_plikow_po_czyszczeniu.txt"

Write-Host "Czyszczenie zakończone!" -ForegroundColor Cyan
Write-Host "UWAGA: Należy jeszcze ręcznie zweryfikować i usunąć console.log oraz dane debugowania z kodu źródłowego." -ForegroundColor Yellow
Write-Host "PRIORYTET: Zmień klucz ADMIN_API_KEY w pliku .env!" -ForegroundColor Red
```

## AKTUALIZACJA ZMIENNYCH ŚRODOWISKOWYCH

Przykład bezpiecznej konfiguracji pliku .env dla produkcji:

```
# Konfiguracja produkcyjna
DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=TWÓJ_BEZPIECZNY_KLUCZ"
ADMIN_API_KEY="WYGENERUJ_SILNY_KLUCZ_MINIMUM_32_ZNAKI"
NODE_ENV="production"
```

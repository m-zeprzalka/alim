# Skrypt do wykonania migracji bazy danych i sprawdzenia połączenia
# Należy uruchomić ten skrypt z folderu głównego projektu

# Kolory dla lepszej czytelności
$Green = [ConsoleColor]::Green
$Red = [ConsoleColor]::Red
$Yellow = [ConsoleColor]::Yellow
$Cyan = [ConsoleColor]::Cyan

# Funkcja wyświetlająca nagłówki
function Write-Header {
    param ($Text)
    Write-Host ""
    Write-Host "=== $Text ===" -ForegroundColor $Cyan
    Write-Host ""
}

# Sprawdź, czy jesteśmy w odpowiednim folderze
if (-not (Test-Path "./prisma/schema.prisma")) {
    Write-Host "Błąd: Nie znaleziono pliku schema.prisma. Upewnij się, że jesteś w głównym folderze projektu." -ForegroundColor $Red
    exit 1
}

Write-Header "ALIMATRIX - AKTUALIZACJA BAZY DANYCH"
Write-Host "Ten skrypt przeprowadzi migrację bazy danych i sprawdzi połączenie." -ForegroundColor $Yellow
Write-Host "Upewnij się, że baza danych jest dostępna i zdefiniowana w .env" -ForegroundColor $Yellow
Write-Host ""

# Przenieś się do głównego folderu projektu
Set-Location .

try {
    # Krok 1: Wygeneruj migrację
    Write-Header "Krok 1: Generowanie migracji"
    Write-Host "Generowanie migracji na podstawie zmian w schema.prisma..." -ForegroundColor $Yellow
    npx prisma migrate dev --name add_court_fields
    if ($LASTEXITCODE -ne 0) { throw "Błąd podczas generowania migracji" }
    Write-Host "Migracja wygenerowana pomyślnie!" -ForegroundColor $Green
    
    # Krok 2: Aktualizacja klienta Prisma
    Write-Header "Krok 2: Aktualizacja klienta Prisma"
    Write-Host "Generowanie typów Prisma Client..." -ForegroundColor $Yellow
    npx prisma generate
    if ($LASTEXITCODE -ne 0) { throw "Błąd podczas generowania klienta Prisma" }
    Write-Host "Klient Prisma zaktualizowany pomyślnie!" -ForegroundColor $Green
    
    # Krok 3: Sprawdź połączenie z bazą danych
    Write-Header "Krok 3: Sprawdzanie połączenia z bazą danych"
    Write-Host "Sprawdzanie połączenia i struktury tabel..." -ForegroundColor $Yellow
    npx tsx ./prisma/check-db.ts
    if ($LASTEXITCODE -ne 0) { throw "Błąd podczas sprawdzania bazy danych" }
    
    # Podsumowanie
    Write-Header "SUKCES!"
    Write-Host "Wszystkie operacje wykonane pomyślnie!" -ForegroundColor $Green
    Write-Host "Możesz teraz uruchomić aplikację z zaktualizowanym schematem bazy danych." -ForegroundColor $Green
}
catch {
    Write-Header "BŁĄD"
    Write-Host $_ -ForegroundColor $Red
    exit 1
}

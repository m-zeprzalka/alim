# Dokumentacja aktualizacji bazy danych AliMatrix

Data: 20 maja 2025

## Zmiany wprowadzone w bazie danych

### 1. Nowe pola w tabeli FormSubmission:

#### Dane użytkownika:

- `adresUlica` - ulica zamieszkania
- `adresKodPocztowy` - kod pocztowy
- `adresMiasto` - miasto
- `pesel` - numer PESEL
- `telefon` - numer telefonu
- `statusZatrudnienia` - status zatrudnienia
- `dochodMiesieczny` - miesięczny dochód

#### Dane sądowe:

- `imieSedziego` - imię sędziego
- `nazwiskoSedziego` - nazwisko sędziego
- `typReprezentacji` - typ reprezentacji prawnej
- `imieReprezentanta` - imię reprezentanta
- `nazwiskoReprezentanta` - nazwisko reprezentanta
- `kosztReprezentacji` - koszt reprezentacji
- `dataRozprawy` - data rozprawy
- `dataZlozeniaPozwu` - data złożenia pozwu
- `liczbaRozpraw` - liczba rozpraw

### 2. Nowe pola w tabeli Child:

- `poziomEdukacji` - szczegółowy poziom edukacji
- `kosztySzkoly` - koszt opłat za szkołę/przedszkole
- `dodatkZajeciaCena` - koszt zajęć dodatkowych
- `rodzajZajec` - rodzaj zajęć dodatkowych
- `szczegolowyProcentCzasu` - szczegółowy podział czasu opieki (JSON)

### 3. Nowa tabela KosztyUtrzymania:

- `id` - identyfikator
- `formSubmissionId` - powiązanie z formularzem
- `kosztyUtrzymania` - łączne koszty utrzymania
- `czynsz` - czynsz lub rata kredytu
- `media` - łączne koszty mediów (agregacja)
- `energia` - koszt energii elektrycznej
- `woda` - koszt wody
- `ogrzewanie` - koszt ogrzewania
- `internet` - koszt internetu
- `telefon` - koszt telefonu
- `transport` - koszty transportu
- `zywnosc` - koszty żywności
- `lekarstwa` - koszty lekarstw
- `typZamieszkania` - typ zamieszkania (własność, wynajem, etc.)
- `czestotliwoscOplat` - częstotliwość opłat
- `powierzchniaMieszkania` - powierzchnia mieszkania w m²
- `liczbaOsob` - liczba osób w gospodarstwie domowym
- `inneKosztyMiesieczne` - inne miesięczne koszty
- `inneKosztyOpis` - opis innych kosztów

## Wykonane operacje

1. Zaktualizowano schemat bazy danych (prisma/schema.prisma)
2. Utworzono migrację SQL dodającą nowe pola (migrations/20250520000000_add_detailed_fields/migration.sql)
3. Utworzono i uruchomiono skrypt migracji danych (prisma/migrateData.js)
4. Zaktualizowano funkcję eksportu Excel (src/lib/export-excel-utils.js)

## Dalsze kroki

1. Aktualizacja komponentów frontendowych, aby wykorzystywały nowe pola
2. Testy funkcjonalności wykorzystujących nowe pola
3. Weryfikacja eksportu danych do Excel

## Przywracanie zmian

W przypadku problemów można przywrócić poprzednią wersję bazy danych z kopii zapasowej:

- Kopia bazy danych: alimatrix*backup*[TIMESTAMP].sql
- Kopia schematu: prisma/schema.prisma.bak

## Autorzy zmian

- [Twoje imię i nazwisko]

## Data wdrożenia

20 maja 2025

# Instrukcja wdrożenia backendu dla formularza

## Krok 1: Aktualizacja bazy danych

1. Otwórz terminal PowerShell w głównym folderze projektu
2. Uruchom skrypt aktualizujący bazę danych:

```powershell
.\apply-migration.ps1
```

Ten skrypt wykona następujące operacje:

- Wygeneruje migrację na podstawie zaktualizowanego schematu
- Zaktualizuje klienta Prisma
- Sprawdzi połączenie z bazą danych i strukturę tabel

## Krok 2: Testowanie połączenia z bazą danych

1. Uruchom skrypt sprawdzający połączenie z bazą danych:

```powershell
npx tsx ./prisma/check-db.ts
```

Skrypt wyświetli informacje o strukturze tabeli `FormSubmission` oraz liczbę rekordów w bazie.

## Krok 3: Uruchomienie aplikacji

1. Uruchom aplikację w trybie deweloperskim:

```powershell
npm run dev
```

2. Po uruchomieniu przejdź do przeglądarki i otwórz adres `http://localhost:3000`

## Krok 4: Sprawdzenie działania formularza

1. Wypełnij formularz krok po kroku, zwracając szczególną uwagę na sekcję sądową
2. Po wypełnieniu całego formularza, na stronie z podaniem adresu e-mail i zgód, wyślij formularz
3. Dane powinny zostać zapisane w bazie danych

## Krok 5: Weryfikacja danych w bazie

1. Po wysłaniu formularza możesz sprawdzić, czy dane zostały prawidłowo zapisane:

```powershell
npx tsx ./prisma/check-db.ts
```

2. Możesz również sprawdzić statystyki sądów w panelu administratora pod adresem:
   `http://localhost:3000/admin/court-stats`

## Struktura zapisywanych danych

Formularz zapisuje następujące dane dotyczące sądów:

- `rokDecyzjiSad` - rok wydania decyzji
- `miesiacDecyzjiSad` - miesiąc wydania decyzji
- `rodzajSaduSad` - rodzaj sądu (rejonowy, okręgowy, nie_pamietam)
- `apelacjaSad` - apelacja, do której należy sąd
- `sadOkregowyId` - identyfikator sądu okręgowego
- `sadRejonowyId` - identyfikator sądu rejonowego (jeśli dotyczy)
- `watekWiny` - informacja o wątku winy (tak-ja, tak-druga-strona, tak-oboje, nie)

Dane te są zapisywane zarówno w kolumnie JSON `formData`, jak i w dedykowanych kolumnach dla łatwiejszego filtrowania i analizy.

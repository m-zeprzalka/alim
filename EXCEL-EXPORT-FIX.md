# Naprawa i rozszerzenie eksportu Excel

## Problem

System eksportował tylko 44 rekordy z 66 dostępnych w bazie danych.

## Diagnoza

Po dokładnej analizie kodu w pliku `src/app/api/admin/export-excel-fixed/route.ts`, zidentyfikowano problem:

- W kodzie występowały dwa zapytania do bazy danych pobierające formularze:
  1. Pierwsze zapytanie pobierało pełne dane ze wszystkimi polami i relacjami (linie 51-108)
  2. Drugie zapytanie (linie 140-154) nadpisywało wcześniej pobrane dane, ale używało uproszczonego schematu z mniejszą liczbą pól

To drugie zapytanie - które miało prawdopodobnie być dodatkowym logiem diagnostycznym - przypadkowo nadpisywało wyniki pierwszego, bardziej kompleksowego zapytania, co skutkowało eksportem niepełnych danych.

## Rozwiązanie podstawowe

1. Usunięto drugie, nadmiarowe zapytanie do bazy danych, które nadpisywało pełne wyniki
2. Dodano dodatkowe informacje diagnostyczne w logach
3. Zaktualizowano interfejs użytkownika, aby wyświetlał więcej informacji o eksportowanych danych
4. Dodano informację o rozmiarze pobranego pliku Excel

## Rozszerzenia funkcjonalności eksportu

Po naprawieniu podstawowego problemu, dodano szereg rozszerzeń do funkcjonalności eksportu:

### 1. Kompletne dane z bazy

Zaktualizowano zapytanie do bazy danych, aby uwzględniało wszystkie dostępne pola:

- **Dane demograficzne**

  - Dane użytkownika (płeć, wiek, lokalizacja, stan cywilny)
  - Dane drugiego rodzica (płeć, wiek, lokalizacja)

- **Dane sądowe**

  - Pełna hierarchiczna struktura sądów (apelacyjne, okręgowe i rejonowe)
  - Szczegóły spraw sądowych (informacje o sędzim, wątki winy)

- **Dane o porozumieniach**

  - Daty porozumień, formaty
  - Klauzule waloryzacyjne
  - Ustalenia finansowania
  - Plany wystąpienia do sądu

- **Oceny adekwatności**

  - Oceny adekwatności sądu
  - Oceny adekwatności porozumienia
  - Oceny adekwatności innych ustaleń

- **Dodatkowe metadane**
  - Daty przetwarzania
  - Informacje o statusie
  - URL raportów

### 2. Ulepszona struktura arkuszy Excel

Dodano bardziej szczegółową strukturę arkuszy, aby lepiej organizować dane:

1. Arkusz podsumowania (przegląd)
2. Arkusz subskrypcji (subskrypcje e-mail)
3. Arkusz formularzy (pełne dane formularzy)
4. Arkusz danych o dzieciach (dane o dzieciach, opiece i wydatkach)
5. Arkusz dochodów (dane o dochodach i wydatkach rodziców)
6. Arkusz danych JSON (surowe dane JSON do zaawansowanej analizy)

### 3. Dodatkowe usprawnienia

- Dodano informacje o rozmiarze pliku w nagłówkach odpowiedzi i wyświetlanie w interfejsie użytkownika
- Ulepszono diagnostykę w logach
- Dodano sumowanie wydatków na dzieci

## Weryfikacja

Po zastosowaniu poprawki, eksport zawiera wszystkie 66 rekordów z bazy danych, co potwierdzone zostało poprzez:

1. Logi serwera pokazujące poprawną liczbę rekordów
2. Rozmiar eksportowanego pliku Excel
3. Dodatkowe podsumowanie w eksportowanym pliku Excel
4. Pełny zestaw danych w poszczególnych arkuszach

## Uwagi techniczne

1. W przyszłości należy unikać nadpisywania wyników zapytań do bazy danych w przypadku równoległych operacji diagnostycznych. Lepszym rozwiązaniem jest tworzenie oddzielnych zmiennych dla różnych celów.

2. Dodatkowe arkusze w pliku Excel zwiększają czytelność danych i ułatwiają analizę, ale też zwiększają rozmiar pliku. W przypadku bardzo dużej ilości danych, warto rozważyć tworzenie oddzielnych plików dla poszczególnych kategorii danych.

3. **Ważne:** Występuje rozbieżność między schematem w kodzie a rzeczywistym schematem bazy danych. Pola takie jak `apelacjaId`, `apelacjaNazwa`, `sadOkregowyNazwa` i `sadRejonowyNazwa` są zdefiniowane w pliku `schema.prisma`, ale nie zostały jeszcze utworzone w bazie danych. Przed użyciem tych pól, konieczne jest wykonanie migracji bazy danych.

4. Mechanizm eksportu można w przyszłości rozbudować o:
   - Filtrowanie danych przed eksportem
   - Personalizację arkuszy i kolumn
   - Możliwość eksportu do innych formatów (CSV, JSON)
   - Automatyczne wykrywanie dostępnych kolumn w bazie i dynamiczne dostosowanie eksportu

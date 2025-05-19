# Aktualizacja systemu zarządzania sądami

## Wprowadzone zmiany

W tej aktualizacji wprowadziliśmy hierarchiczny system sądów, który lepiej odzwierciedla strukturę sądownictwa w Polsce.
Zmiana ta pozwala na bardziej precyzyjne mapowanie i analizę danych sądowych.

### Główne zmiany

1. **Hierarchiczna struktura sądów** - struktura trzypoziomowa:

   - Apelacje
   - Sądy Okręgowe
   - Sądy Rejonowe

2. **Ulepszenia w bazie danych**:

   - Dodane nowe pola: `apelacjaId`, `apelacjaNazwa`, `sadOkregowyNazwa`, `sadRejonowyNazwa`
   - Zachowanie kompatybilności wstecznej z istniejącymi danymi
   - Indeksowanie nowych pól dla szybszego wyszukiwania

3. **Aktualizacja formularzy**:
   - Formularz "Postępowanie Sądowe" aktualizuje i przechowuje pełne dane o sądach
   - Poprawione walidacje formularzy

## Instrukcja wdrożenia

### 1. Aktualizacja schematu bazy danych

Uruchom migrację bazy danych, aby dodać nowe pola:

Na Windows (PowerShell):

```powershell
.\apply-migration.ps1
```

Na Linux/Mac:

```bash
chmod +x apply-migration.sh
./apply-migration.sh
```

**WAŻNE:** Przed uruchomieniem skryptu zaktualizuj parametr `DATABASE_URL` w pliku skryptu na właściwą wartość dla Twojego środowiska.

### 2. Aktualizacja kodu

Wszystkie niezbędne zmiany w kodzie zostały już wprowadzone w następujących plikach:

- `src/lib/court-data-hierarchical.ts` - Nowa funkcja parsująca dane hierarchiczne
- `src/app/postepowanie/sadowe/page.tsx` - Zaktualizowany formularz sądowy
- `src/app/postepowanie/sadowe/typings.ts` - Zaktualizowane typy danych
- `src/lib/schemas/postepowanie-sadowe-schema.ts` - Zaktualizowane schematy walidacji
- `src/app/api/secure-submit/route.ts` - Zaktualizowany endpoint API dla formularza

### 3. Weryfikacja zmian

Aby zweryfikować, że zmiany działają poprawnie:

1. Otwórz stronę testową: `/test-courts-hierarchical`
2. Sprawdź, czy możesz wybrać sądy w układzie hierarchicznym
3. Wypełnij formularz sądowy i sprawdź, czy dane są prawidłowo przesyłane

## Rozwiązywanie problemów

Jeśli występują problemy z migracją bazy danych:

1. Sprawdź, czy połączenie z bazą danych działa poprawnie
2. Upewnij się, że masz odpowiednie uprawnienia do modyfikacji bazy danych
3. Sprawdź logi serwera po wystąpieniu błędów

Jeśli formularz nie działa poprawnie:

1. Sprawdź, czy dane są prawidłowo przekazywane do API (sprawdź logi)
2. Weryfikuj, czy komunikacja między komponentami działa prawidłowo
3. Sprawdź, czy wszystkie zależności zostały zaktualizowane

## Dane kontaktowe

W przypadku problemów skontaktuj się z zespołem wsparcia technicznego.

# Lista kontrolna testów manualnych MVP AliMatrix

## Podsumowanie wprowadzonych poprawek

1. **Poprawione persystencja danych**:

   - Zmodyfikowano mechanizm zapisu formularza aby używać localStorage z lepszą persystencją
   - Ulepszono funkcję updateFormData dla zwiększenia niezawodności

2. **Poprawione wskaźniki czasu w `/czas-opieki`**:

   - Zmodyfikowano funkcje handleNext i handleBack aby zapisywały wszystkie trzy wartości:
     - czasOpiekiBezEdukacji (łączny czas opieki)
     - czasAktywnejOpieki (czas aktywnej opieki)
     - czasSnu (procent czasu snu)

3. **Poprawione źródła dochodów w `/koszty-utrzymania`**:

   - Zaktualizowano definicje typów o brakujące pola:
     - rentaRodzinnaKwota (kwota renty rodzinnej)
     - swiadczeniePielegnacyjneKwota (kwota świadczenia pielęgnacyjnego)
     - inneKwota (kwota innych dochodów)
   - Dodano obsługę inneZrodlaUtrzymania bezpośrednio w obiekcie dziecka

4. **Poprawione działanie przycisku wstecz**:

   - Zaktualizowano strony `/postepowanie/porozumienie` i `/postepowanie/sadowe` aby zapisywały dane przed nawigacją

5. **Dodano wyświetlanie ID zgłoszenia**:

   - Zmodyfikowano stronę wysylka aby pobierała ID zgłoszenia z odpowiedzi API
   - Zaktualizowano strony dziekujemy i alternatywna aby wyświetlały ID z funkcją kopiowania

6. **Utworzono narzędzia testowe**:
   - Utworzono stronę `/test-formularza` do testów funkcjonalności formularza
   - Utworzono stronę `/test-api` do testów API
   - Dodano test inneZrodlaUtrzymania do sprawdzenia poprawności zapisywania danych o źródłach utrzymania

## Instrukcja przeprowadzania testów

Ten dokument zawiera listę podstawowych testów manualnych do przeprowadzenia przed wdrożeniem aplikacji. Testy są podzielone na sekcje odpowiadające poszczególnym częściom formularza.

Przed rozpoczęciem:

- Uruchom aplikację lokalnie
- Otwórz narzędzia deweloperskie w przeglądarce (F12)
- Wyczyść localStorage przed każdą sesją testową (Application > Storage > Local Storage > Right click > Clear)

## 1. Testowanie strony startowej

- [ ] Strona główna ładuje się poprawnie
- [ ] Przycisk "Rozpocznij" prowadzi do strony wyboru ścieżki
- [ ] Nawigacja działa poprawnie

## 2. Testowanie ścieżki głównej (established)

### Testowanie przepływu podstawowego

- [ ] Strona /sciezka pozwala wybrać established
- [ ] Przejście do /finansowanie działa poprawnie
- [ ] Przejście przez wszystkie strony formularza w przód i wstecz działa poprawnie
- [ ] Dane są zachowywane podczas nawigacji wstecz
- [ ] Przycisk "Dalej" i "Wstecz" działa na każdej stronie

### Testowanie strony /czas-opieki

- [ ] Wprowadzone dane w tabeli czasu są zapisywane
- [ ] Wszystkie trzy wskaźniki czasu opieki są wyświetlane poprawnie:
  - [ ] Łączny czas opieki (bez placówki edukacyjnej)
  - [ ] Czas aktywnej opieki (bez placówki edukacyjnej i bez snu)
  - [ ] Czas nocnego snu pod opieką (procentowo)
- [ ] Dane są zachowywane przy cofaniu i powrocie na stronę
- [ ] Dane są zapisywane przy przejściu do następnej strony

### Testowanie strony /koszty-utrzymania

- [ ] Można wprowadzić kwotę alimentów i miesięczne wydatki
- [ ] Można zaznaczyć i wprowadzić kwotę dla renty rodzinnej
- [ ] Można zaznaczyć i wprowadzić kwotę dla świadczenia pielęgnacyjnego
- [ ] Można zaznaczyć i wprowadzić kwotę i opis dla innych źródeł utrzymania
- [ ] Dane są zachowywane przy cofaniu i powrocie na stronę
- [ ] Dane są zapisywane przy przejściu do następnej strony
- [ ] Wszystkie pola inneZrodlaUtrzymania są poprawnie zapisywane w obiekcie dziecka

### Testowanie stron /postepowanie

- [ ] Strona /postepowanie wyświetla się poprawnie
- [ ] Przejście do /postepowanie/porozumienie działa poprawnie
- [ ] Na stronie /postepowanie/porozumienie dane są zapisywane
- [ ] Przycisk "Wstecz" na /postepowanie/porozumienie działa poprawnie (zapisuje dane i wraca)
- [ ] Przejście do /postepowanie/sadowe działa poprawnie
- [ ] Na stronie /postepowanie/sadowe dane są zapisywane
- [ ] Przycisk "Wstecz" na /postepowanie/sadowe działa poprawnie (zapisuje dane i wraca)

### Testowanie strony /wysylka i /dziękujemy

- [ ] Formularz na stronie /wysylka można wypełnić poprawnie
- [ ] Po wysłaniu formularza użytkownik jest przekierowany do /dziękujemy
- [ ] Na stronie /dziękujemy wyświetlane jest ID zgłoszenia
- [ ] Przycisk "Kopiuj" kopiuje ID zgłoszenia do schowka

## 3. Testowanie ścieżki alternatywnej (not-established)

- [ ] Strona /sciezka pozwala wybrać not-established
- [ ] Przejście do /alternatywna działa poprawnie
- [ ] Można wprowadzić email i zaakceptować zgodę
- [ ] Po wysłaniu formularza wyświetlane jest potwierdzenie
- [ ] Na potwierdzeniu wyświetlane jest ID zgłoszenia
- [ ] Przycisk "Kopiuj" kopiuje ID zgłoszenia do schowka

## 4. Testowanie persystencji danych

- [ ] Odświeżenie strony w dowolnym momencie formularz zachowuje dane
- [ ] Zamknięcie przeglądarki i ponowne otwarcie zachowuje dane
- [ ] Dane są zachowywane lokalnie między sesjami
- [ ] Reset formularza po wysłaniu działa poprawnie

## 5. Testowanie responsywności

- [ ] Aplikacja wyświetla się poprawnie na urządzeniach mobilnych
- [ ] Aplikacja wyświetla się poprawnie na tabletach
- [ ] Aplikacja wyświetla się poprawnie na desktopach

## 6. Testowanie wprowadzonych poprawek (MVP)

### Testowanie persystencji danych w formularzu

- [ ] Sprawdź czy dane w formularzu są poprawnie zachowywane po odświeżeniu strony
- [ ] Sprawdź czy dane są poprawnie przywracane po zamknięciu i ponownym otwarciu przeglądarki

### Testowanie wskaźników czasu opieki w /czas-opieki

- [ ] Sprawdź czy wszystkie trzy wskaźniki są zapisywane:
  - [ ] czasOpiekiBezEdukacji (łączny czas opieki)
  - [ ] czasAktywnejOpieki (czas aktywnej opieki)
  - [ ] czasSnu (odsetek czasu snu)
- [ ] Sprawdź czy wskaźniki są poprawnie odczytywane po powrocie na stronę

### Testowanie źródeł utrzymania w /koszty-utrzymania

- [ ] Sprawdź czy wszystkie pola inneZrodlaUtrzymania są poprawnie zapisywane:
  - [ ] rentaRodzinna i rentaRodzinnaKwota
  - [ ] swiadczeniePielegnacyjne i swiadczeniePielegnacyjneKwota
  - [ ] inne, inneOpis i inneKwota
- [ ] Sprawdź czy dane są poprawnie odczytywane po powrocie na stronę
- [ ] Sprawdź czy dane są poprawnie przesyłane przy wysyłce formularza

### Testowanie przycisków wstecz w /postepowanie

- [ ] Sprawdź czy przycisk wstecz na /postepowanie/porozumienie zapisuje dane przed nawigacją
- [ ] Sprawdź czy przycisk wstecz na /postepowanie/sadowe zapisuje dane przed nawigacją

### Testowanie wyświetlania ID zgłoszenia

- [ ] Sprawdź czy ID zgłoszenia jest wyświetlane na stronie /dziękujemy
- [ ] Sprawdź czy funkcja kopiowania ID działa poprawnie
- [ ] Sprawdź czy ID zgłoszenia jest wyświetlane na stronie /alternatywna
- [ ] Sprawdź czy funkcja kopiowania ID działa poprawnie na stronie /alternatywna

## Notatki z testów

| Data testu | Tester | Status | Uwagi |
| ---------- | ------ | ------ | ----- |
|            |        |        |       |

# AliMatrix - Ostateczna Checklista Bezpieczeństwa i Wdrożenia

## 🚨 Krytyczne zagrożenia bezpieczeństwa (Priorytet P0)

- [ ] **Zmiana hardcodowanych kluczy API** - Należy natychmiast zastąpić `"tajny_klucz_admin_2025"` silnym, losowo wygenerowanym kluczem (min. 32 znaki) w:

  - `src/app/api/admin/subscriptions/route.ts`
  - `src/app/api/admin/export-excel-fixed/route.ts`
  - `src/app/api/admin/export-excel/route.ts`
  - Plik `.env` (prawdopodobnie zawiera ten sam klucz)

- [ ] **Usunięcie wrażliwych danych z logów** - Należy zweryfikować i usunąć wszystkie logi zawierające dane poufne:

  - Usunięcie logów pokazujących danych formularzy w `src/app/api/secure-submit/route.ts`:
    - Linia ~278: `console.log("Court data to be saved:", {...})`
    - Linia ~499: `console.log("Full data to be saved:", JSON.stringify(fullCreateData, null, 2))`
  - Usunięcie logów pokazujących dane konfiguracyjne:
    - Linia ~14: `console.log("Database URL (masked):", ...)`

- [ ] **Wprowadzenie proper authorization** - Panel administracyjny zabezpieczony jest tylko przez API key w nagłówku:

  - Wdrożyć prawidłowe uwierzytelnianie (np. Auth.js/NextAuth) z zabezpieczeniem wszystkich tras `/admin/*`

- [ ] **Zabezpieczenie przed wyciekiem danych offline** - Weryfikacja i zabezpieczenie funkcji offline:
  - Zweryfikować szyfrowanie danych przechowywanych w `localStorage`
  - Sprawdzić mechanizm automatycznego czyszczenia danych w `useSecureFormStore`

## 🔒 Bezpieczeństwo danych i RODO (Priorytet P1)

- [ ] **Audyt logowania i debugowania** - Usunięcie wszystkich konsoli zawierających wrażliwe dane:
  - Sprawdzić i usunąć wszystkie pozostałe `console.log/error/warn` zawierające dane osobowe
  - Zastąpić logami redukującymi ilość informacji (maskowanie danych, logowanie tylko identyfikatorów)
- [ ] **Zabezpieczenie mechanizmu CSRF** - Token CSRF jest rejestrowany ale może wymagać usprawnień:

  - Dodać weryfikację czasu (zamienić `consumeCSRFToken` na weryfikację z czasem wygaśnięcia)
  - Rozważyć implementację Double-Submit Cookie Pattern
  - Zweryfikować czy `localStorage` jest odpowiedni do przechowywania tokenów

- [ ] **Weryfikacja mechanizmu sanityzacji danych** - Audyt funkcji sanityzujących:

  - Sprawdzić funkcję `sanitizeString` w `src/lib/form-validation.ts`
  - Dodać sanityzację przy odczycie danych z bazy przed wyświetleniem użytkownikowi
  - Wprowadzić regularne wyrażenia do walidacji danych (zwłaszcza dla kodów pocztowych, telefonów)

- [ ] **Polityka Content-Security-Policy** - Rozszerzenie CSP:
  - Aktualna polityka w `next.config.ts` jest dobra, ale dodać:
    - `form-action 'self'` aby zapobiec CSRF
    - `frame-ancestors 'none'` jako dodatkowa ochrona przed clickjacking

## 🛢️ Bezpieczeństwo bazy danych (Priorytet P1)

- [ ] **Weryfikacja zapytań do bazy danych** - Audyt zapytań pod kątem podatności:

  - Zweryfikować użycie parametryzowanych zapytań w raw queries (np. w `src/app/api/subscribe/route.ts`)
  - Sprawdzić czy są używane odpowiednie indeksy w tabelach (zwłaszcza dla wyszukiwania)
  - Sprawdzić czy są zastosowane limity dla zapytań zwracających duże zbiory danych

- [ ] **Audyt migracji bazy danych** - Zweryfikować migracje Prisma:

  - Przejrzeć `prisma/migrations/20250517000000_optimize_schema` i `prisma/migrations/20250517205554_optimize_schema`
  - Zapewnić, że nie ma ryzyka utraty danych
  - Zweryfikować poprawność typów kolumn (zwłaszcza dla wrażliwych danych)

- [ ] **Obsługa trybu offline** - Zweryfikować mechanizm przechowywania i synchronizacji danych:
  - Przejrzeć implementację w `src/lib/db-connection-helper.ts`
  - Upewnić się, że dane przechowywane offline są odpowiednio zabezpieczone

## 🧪 Testy bezpieczeństwa (Priorytet P2)

- [ ] **Testy podatności XSS** - Przeprowadzić testy na wstrzykiwanie kodu:

  - Przetestować pola formularzy na podatność XSS
  - Sprawdzić czy sanityzacja chroni przed XSS w polach input i textarea
  - Zweryfikować, czy dane z bazy danych są odpowiednio encodowane przed wyświetleniem

- [ ] **Testy CSRF** - Sprawdzić ochronę przed CSRF:

  - Przetestować czy mechanizm tokenów CSRF działa prawidłowo
  - Sprawdzić czy wszystkie wrażliwe akcje są zabezpieczone tokenami CSRF
  - Zweryfikować czy tokeny są odpowiednio generowane i weryfikowane

- [ ] **Testy Rate Limiting** - Sprawdzić mechanizmy blokowania nadmiernych zapytań:
  - Przetestować funkcję `checkRateLimit` w `src/lib/form-validation.ts`
  - Sprawdzić czy limit jest wystarczająco niski, by chronić przed atakami
  - Zweryfikować czy IP jest prawidłowo interpretowane za proxy/load balancerem

## 🚀 Optymalizacja i produkcja (Priorytet P2)

- [ ] **Weryfikacja zmiennych środowiskowych** - Ustawić prawidłowe wartości produkcyjne:

  - `NODE_ENV=production`
  - `ADMIN_API_KEY=<wygenerowany silny klucz>`
  - `DATABASE_URL=<produkcyjna baza danych z odpowiednimi kredencjałami>`

- [ ] **Optymalizacja produkcyjnego buildu** - Sprawdzić optymalizacje:

  - Zweryfikować czy wszystkie fazy budowania działają poprawnie
  - Sprawdzić czy bundle size jest odpowiednio zoptymalizowany
  - Upewnić się, że kod deweloperski (np. funkcje debug) nie jest dodawany do buildu produkcyjnego

- [ ] **Konfiguracja CORS** - Zweryfikować politykę CORS dla API:

  - Sprawdzić czy nagłówki CORS są prawidłowo skonfigurowane
  - Ograniczyć dostęp do API do dozwolonych domen

- [ ] **Monitoring i logowanie błędów** - Ustawić monitoring produkcyjny:
  - Skonfigurować narzędzia do monitorowania błędów na produkcji
  - Ustawić automatyczne alerty o krytycznych błędach
  - Zdefiniować procedurę reagowania na incydenty bezpieczeństwa

## 💾 Backup i odzyskiwanie danych (Priorytet P3)

- [ ] **Backup bazy danych** - Ustawić regularne kopie:

  - Skonfigurować automatyczne kopie zapasowe bazy danych
  - Przetestować procedurę przywracania danych z kopii
  - Zdefiniować retencję kopii zapasowych zgodnie z polityką RODO

- [ ] **Backup konfiguracji** - Zabezpieczyć kopie plików konfiguracyjnych:
  - Utworzyć kopie plików `.env`, `next.config.ts` i innych krytycznych konfiguracji
  - Przechowywać kopie w bezpiecznym miejscu (np. zarządzanie sekretami)

## 📋 Procedury wdrożeniowe (Priorytet P3)

- [ ] **Plan wdrożenia** - Przygotować procedurę deployu:

  - Zdefiniować kroki wdrożenia (od środowiska stagingowego do produkcyjnego)
  - Określić osoby odpowiedzialne za poszczególne zadania
  - Stworzyć listę kontrolną do weryfikacji po wdrożeniu

- [ ] **Procedura rollback** - Przygotować procedurę wycofania zmian:
  - Zdefiniować kroki powrotu do poprzedniej wersji
  - Określić warunki, przy których należy wykonać rollback
  - Przygotować skrypty automatyzujące proces

---

## 📝 Notatki i zalecenia

1. **Priorytetyzacja zadań**:

   - P0: Wykonać natychmiast przed deploymentem
   - P1: Krytyczne dla bezpieczeństwa, wykonać przed lub zaraz po deploymencie
   - P2: Ważne, wykonać w krótkim czasie po deploymencie
   - P3: Istotne, wykonać w ramach następnych iteracji rozwoju

2. **Dokumentacja techniczna**:

   - Wszelkie zmiany w bezpieczeństwie należy dokumentować
   - Przechowywać dokumenty związane z bezpieczeństwem poza repozytorium kodu
   - Utrzymywać aktualizowaną listę użytych technologii i ich wersji

3. **Rekomendacje długoterminowe**:
   - Wdrożenie pełnego systemu uwierzytelniania (np. Auth.js)
   - Regularne przeprowadzanie audytów bezpieczeństwa
   - Szkolenia z zakresu bezpieczeństwa dla zespołu deweloperskiego

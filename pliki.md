# Analiza plików projektu AliMatrix

## Legenda oceny ważności

- **Krytyczny** - Plik niezbędny do działania aplikacji
- **Ważny** - Plik istotny dla poprawnego funkcjonowania aplikacji
- **Pomocniczy** - Plik użyteczny, ale niekrytyczny
- **Dokumentacja** - Plik dokumentacyjny, nie wpływa na działanie aplikacji
- **Testowy** - Plik używany do testów
- **Tymczasowy** - Plik tymczasowy, który może zostać usunięty
- **Duplikat** - Plik zduplikowany, można go usunąć
- **Niepotrzebny** - Plik, który nie jest używany i można go usunąć

## Pliki konfiguracyjne

| Plik                 | Rola                            | Ważność    | Można usunąć?                         |
| -------------------- | ------------------------------- | ---------- | ------------------------------------- |
| `tsconfig.json`      | Konfiguracja TypeScript         | Krytyczny  | Nie                                   |
| `next.config.ts`     | Konfiguracja Next.js            | Krytyczny  | Nie                                   |
| `package.json`       | Definicja zależności i skryptów | Krytyczny  | Nie                                   |
| `package-lock.json`  | Dokładne wersje zależności      | Ważny      | Nie                                   |
| `postcss.config.mjs` | Konfiguracja PostCSS dla stylów | Ważny      | Nie                                   |
| `eslint.config.mjs`  | Konfiguracja ESLint             | Ważny      | Nie                                   |
| `.eslintrc.json`     | Stara konfiguracja ESLint       | Duplikat   | Tak (jeśli używamy eslint.config.mjs) |
| `.eslintignore`      | Pliki ignorowane przez ESLint   | Pomocniczy | Nie                                   |
| `components.json`    | Konfiguracja UI komponentów     | Ważny      | Nie                                   |
| `.gitignore`         | Pliki ignorowane przez git      | Pomocniczy | Nie                                   |
| `init-git.ps1`       | Skrypt inicjalizacji git        | Tymczasowy | Tak                                   |

## Dokumentacja

| Plik                      | Rola                                | Ważność      | Można usunąć? |
| ------------------------- | ----------------------------------- | ------------ | ------------- |
| `DOKUMENTACJA.md`         | Ogólna dokumentacja projektu        | Dokumentacja | Nie           |
| `INSTRUKCJA-WDROZENIA.md` | Instrukcje wdrożenia                | Dokumentacja | Nie           |
| `MVP.md`                  | Specyfikacja MVP                    | Dokumentacja | Nie           |
| `SECURITY.md`             | Dokumentacja bezpieczeństwa         | Dokumentacja | Nie           |
| `STACK.md`                | Dokumentacja stosu technologicznego | Dokumentacja | Nie           |
| `braki.md`                | Analiza braków w projekcie          | Dokumentacja | Nie           |

## Prisma (baza danych)

| Plik                               | Rola                                    | Ważność    | Można usunąć?                 |
| ---------------------------------- | --------------------------------------- | ---------- | ----------------------------- |
| `prisma/schema.prisma`             | Główny schemat bazy danych              | Krytyczny  | Nie                           |
| `prisma/schema.prisma.new`         | Nowy schemat bazy danych                | Tymczasowy | Tak (po zakończeniu migracji) |
| `prisma/run-schema-migration.ts`   | Skrypt migracji schematu                | Tymczasowy | Tak (po zakończeniu migracji) |
| `prisma/apply-migration.js`        | Alternatywny skrypt migracji            | Tymczasowy | Tak (po zakończeniu migracji) |
| `prisma/migrations/*`              | Pliki migracji bazy danych              | Krytyczny  | Nie                           |
| `prisma/check-db.ts`               | Skrypt sprawdzania bazy danych          | Testowy    | Tak                           |
| `prisma/check-db.ts.new`           | Nowy skrypt sprawdzania bazy            | Duplikat   | Tak                           |
| `prisma/check-tables.js`           | Skrypt sprawdzania tabel                | Testowy    | Tak                           |
| `prisma/db-check.js`               | Skrypt weryfikacji bazy danych          | Duplikat   | Tak                           |
| `prisma/check-form-submission.sql` | Zapytanie SQL do sprawdzania formularzy | Testowy    | Tak                           |
| `prisma/test-court-fields.ts`      | Test pól sądowych                       | Testowy    | Tak                           |
| `prisma/run-migration.ts`          | Stary skrypt migracji                   | Duplikat   | Tak                           |

## Kod aplikacji

### Główne pliki

| Plik                  | Rola                        | Ważność    | Można usunąć? |
| --------------------- | --------------------------- | ---------- | ------------- |
| `src/app/layout.tsx`  | Główny layout aplikacji     | Krytyczny  | Nie           |
| `src/app/page.tsx`    | Strona główna               | Krytyczny  | Nie           |
| `src/app/globals.css` | Globalne style              | Krytyczny  | Nie           |
| `src/app/favicon.ico` | Ikona strony                | Pomocniczy | Nie           |
| `src/lib/prisma.ts`   | Konfiguracja klienta Prisma | Krytyczny  | Nie           |

### Strony aplikacji - formularze

| Plik                                         | Rola                                    | Ważność   | Można usunąć? |
| -------------------------------------------- | --------------------------------------- | --------- | ------------- |
| `src/app/sciezka/page.tsx`                   | Strona wyboru ścieżki                   | Krytyczny | Nie           |
| `src/app/alternatywna/page.tsx`              | Ścieżka dla osób bez zasad finansowania | Krytyczny | Nie           |
| `src/app/finansowanie/page.tsx`              | Strona wyboru sposobu finansowania      | Krytyczny | Nie           |
| `src/app/finansowanie/page.tsx.new`          | Nowa wersja strony finansowania         | Duplikat  | Tak           |
| `src/app/dzieci/page.tsx`                    | Strona informacji o dzieciach           | Krytyczny | Nie           |
| `src/app/dzieci/page.tsx.new`                | Nowa wersja strony o dzieciach          | Duplikat  | Tak           |
| `src/app/czas-opieki/page.tsx`               | Strona czasu opieki nad dziećmi         | Krytyczny | Nie           |
| `src/app/czas-opieki/typings.ts`             | Typy dla strony czasu opieki            | Ważny     | Nie           |
| `src/app/opieka-wakacje/page.tsx`            | Strona opieki w wakacje                 | Krytyczny | Nie           |
| `src/app/opieka-wakacje/typings.ts`          | Typy dla strony opieki w wakacje        | Ważny     | Nie           |
| `src/app/koszty-utrzymania/page.tsx`         | Strona kosztów utrzymania dziecka       | Krytyczny | Nie           |
| `src/app/koszty-utrzymania/page.tsx.new`     | Nowa wersja strony kosztów              | Duplikat  | Tak           |
| `src/app/dochody-i-koszty/page.tsx`          | Strona dochodów i kosztów rodziców      | Krytyczny | Nie           |
| `src/app/podstawa-ustalen/page.tsx`          | Strona wyboru podstawy ustaleń          | Krytyczny | Nie           |
| `src/app/postepowanie/page.tsx`              | Strona ogólna postępowania              | Krytyczny | Nie           |
| `src/app/postepowanie/sadowe/page.tsx`       | Strona postępowania sądowego            | Krytyczny | Nie           |
| `src/app/postepowanie/porozumienie/page.tsx` | Strona porozumienia                     | Krytyczny | Nie           |
| `src/app/postepowanie/inne/page.tsx`         | Strona innych postępowań                | Krytyczny | Nie           |
| `src/app/informacje-o-tobie/page.tsx`        | Strona informacji o użytkowniku         | Krytyczny | Nie           |
| `src/app/wysylka/page.tsx`                   | Strona wysyłki formularza               | Krytyczny | Nie           |
| `src/app/dziekujemy/page.tsx`                | Strona podziękowania po wysłaniu        | Krytyczny | Nie           |

### Strony administracyjne

| Plik                                       | Rola                      | Ważność    | Można usunąć? |
| ------------------------------------------ | ------------------------- | ---------- | ------------- |
| `src/app/admin/subscriptions/page.tsx`     | Panel subskrypcji         | Ważny      | Nie           |
| `src/app/admin/export-excel/page.tsx`      | Strona eksportu do Excela | Ważny      | Nie           |
| `src/app/admin/export-excel/not-found.tsx` | Strona 404 dla eksportu   | Pomocniczy | Nie           |
| `src/app/admin/stats/page.tsx`             | Strona statystyk          | Ważny      | Nie           |
| `src/app/admin/court-stats/page.tsx`       | Strona statystyk sądowych | Ważny      | Nie           |

### Endpointy API

| Plik                                          | Rola                               | Ważność   | Można usunąć? |
| --------------------------------------------- | ---------------------------------- | --------- | ------------- |
| `src/app/api/register-csrf/route.ts`          | Endpoint rejestracji tokenu CSRF   | Krytyczny | Nie           |
| `src/app/api/secure-submit/route.ts`          | Endpoint bezpiecznego wysyłania    | Krytyczny | Nie           |
| `src/app/api/submit-form/route.ts`            | Endpoint wysyłania formularza      | Krytyczny | Nie           |
| `src/app/api/subscribe/route.ts`              | Endpoint subskrypcji e-mail        | Krytyczny | Nie           |
| `src/app/api/subscribe/route.ts.new`          | Nowy endpoint subskrypcji          | Duplikat  | Tak           |
| `src/app/api/test-db/route.ts`                | Endpoint testowania DB             | Testowy   | Tak           |
| `src/app/api/admin/export-excel/route.ts`     | Endpoint eksportu do Excela        | Ważny     | Nie           |
| `src/app/api/admin/export-excel/route.ts.new` | Nowy endpoint eksportu             | Duplikat  | Tak           |
| `src/app/api/admin/court-stats/route.ts`      | Endpoint statystyk sądowych        | Ważny     | Nie           |
| `src/app/api/admin/court-stats/route.ts.new`  | Nowy endpoint statystyk            | Duplikat  | Tak           |
| `src/app/api/admin/subscriptions/route.ts`    | Endpoint zarządzania subskrypcjami | Ważny     | Nie           |

### Biblioteki i narzędzia

| Plik                             | Rola                              | Ważność   | Można usunąć? |
| -------------------------------- | --------------------------------- | --------- | ------------- |
| `src/lib/utils.ts`               | Narzędzia pomocnicze              | Ważny     | Nie           |
| `src/lib/csrf.ts`                | Obsługa tokenów CSRF              | Krytyczny | Nie           |
| `src/lib/client-security.ts`     | Bezpieczeństwo po stronie klienta | Krytyczny | Nie           |
| `src/lib/form-validation.ts`     | Walidacja formularzy              | Krytyczny | Nie           |
| `src/lib/court-data.ts`          | Dane o sądach                     | Ważny     | Nie           |
| `src/lib/cleanup.ts`             | Funkcje czyszczące dane           | Ważny     | Nie           |
| `src/lib/navigation-context.tsx` | Kontekst nawigacji                | Ważny     | Nie           |

### Magazyny stanu (stores)

| Plik                                 | Rola                            | Ważność   | Można usunąć? |
| ------------------------------------ | ------------------------------- | --------- | ------------- |
| `src/lib/store/form-store.ts`        | Główny magazyn stanu formularza | Krytyczny | Nie           |
| `src/lib/store/form-store.d.ts`      | Typy dla magazynu formularza    | Krytyczny | Nie           |
| `src/lib/store/secure-form-store.ts` | Bezpieczny magazyn stanu        | Krytyczny | Nie           |

### Komponenty UI

| Plik                                                | Rola                           | Ważność    | Można usunąć? |
| --------------------------------------------------- | ------------------------------ | ---------- | ------------- |
| `src/components/ui/button.tsx`                      | Komponent przycisku            | Ważny      | Nie           |
| `src/components/ui/card.tsx`                        | Komponent karty                | Ważny      | Nie           |
| `src/components/ui/checkbox.tsx`                    | Komponent checkboxa            | Ważny      | Nie           |
| `src/components/ui/input.tsx`                       | Komponent pola input           | Ważny      | Nie           |
| `src/components/ui/label.tsx`                       | Komponent etykiety             | Ważny      | Nie           |
| `src/components/ui/radio-group.tsx`                 | Komponent grupy radio          | Ważny      | Nie           |
| `src/components/ui/select.tsx`                      | Komponent wyboru               | Ważny      | Nie           |
| `src/components/ui/select-simple.tsx`               | Uproszczony komponent wyboru   | Ważny      | Nie           |
| `src/components/ui/tooltip.tsx`                     | Komponent podpowiedzi          | Ważny      | Nie           |
| `src/components/ui/custom/SecurityBanner.tsx`       | Banner bezpieczeństwa          | Ważny      | Nie           |
| `src/components/ui/custom/ScrollToTop.tsx`          | Przewijanie do góry            | Pomocniczy | Nie           |
| `src/components/ui/custom/Logo.tsx`                 | Komponent logo                 | Pomocniczy | Nie           |
| `src/components/ui/custom/InfoTooltip.tsx`          | Komponent tooltip informacyjny | Ważny      | Nie           |
| `src/components/ui/custom/FormProgress.tsx`         | Pasek postępu formularza       | Ważny      | Nie           |
| `src/components/ui/custom/FormErrorAlert.tsx`       | Alert błędu formularza         | Ważny      | Nie           |
| `src/components/ui/custom/ClickableRadioOption.tsx` | Interaktywna opcja radio       | Ważny      | Nie           |

### Typy

| Plik                    | Rola                         | Ważność | Można usunąć? |
| ----------------------- | ---------------------------- | ------- | ------------- |
| `src/types/select.d.ts` | Definicje typów dla selectów | Ważny   | Nie           |

### Pliki testowe

| Plik                         | Rola                | Ważność | Można usunąć? |
| ---------------------------- | ------------------- | ------- | ------------- |
| `src/app/test/page.tsx`      | Strona testowa      | Testowy | Tak           |
| `src/app/test/page.tsx.new`  | Nowa strona testowa | Testowy | Tak           |
| `src/app/test-form/page.tsx` | Formularz testowy   | Testowy | Tak           |

## Zasoby statyczne

| Plik                    | Rola                   | Ważność      | Można usunąć?       |
| ----------------------- | ---------------------- | ------------ | ------------------- |
| `public/file.svg`       | Ikona pliku            | Pomocniczy   | Nie (jeśli używany) |
| `public/globe.svg`      | Ikona globusa          | Pomocniczy   | Nie (jeśli używany) |
| `public/logo.svg`       | Logo aplikacji         | Pomocniczy   | Nie                 |
| `public/next.svg`       | Logo Next.js           | Niepotrzebny | Tak                 |
| `public/test-form.html` | Testowy formularz HTML | Testowy      | Tak                 |
| `public/vercel.svg`     | Logo Vercel            | Niepotrzebny | Tak                 |
| `public/window.svg`     | Ikona okna             | Pomocniczy   | Nie (jeśli używany) |

## Pliki skryptowe

| Plik                  | Rola                            | Ważność    | Można usunąć?     |
| --------------------- | ------------------------------- | ---------- | ----------------- |
| `update-database.ps1` | Skrypt aktualizacji bazy danych | Tymczasowy | Tak (po migracji) |
| `apply-migration.ps1` | Skrypt PowerShell do migracji   | Tymczasowy | Tak (po migracji) |

## Pliki tymczasowe i HTML

| Plik                                          | Rola                             | Ważność      | Można usunąć? |
| --------------------------------------------- | -------------------------------- | ------------ | ------------- |
| `h.html`                                      | Bliżej nieokreślony plik HTML    | Niepotrzebny | Tak           |
| `liczba-dzieci.html`                          | Statyczny HTML dla liczby dzieci | Testowy      | Tak           |
| `sposob-finansowania.html`                    | Statyczny HTML dla finansowania  | Testowy      | Tak           |
| `wysylka.html`                                | Statyczny HTML dla wysyłki       | Testowy      | Tak           |
| `WŁAŚCIWOŚĆ_SĄDÓW_POWSZECHNYCH_luty_2025.xls` | Dane o sądach                    | Pomocniczy   | Nie           |

## Podsumowanie stanu projektu

1. **Duplikaty i pliki tymczasowe**:

   - W projekcie znajduje się wiele duplikatów plików z przyrostkiem `.new`
   - Istnieją redundantne skrypty do operacji na bazie danych
   - Znajdują się tymczasowe pliki HTML, które nie są częścią właściwej aplikacji

2. **Struktura kodu**:

   - Główne komponenty aplikacji są poprawnie zorganizowane
   - Logika biznesowa jest rozproszona po różnych plikach, co utrudnia utrzymanie

3. **Pliki testowe**:
   - W projekcie znajduje się wiele plików testowych, które powinny zostać usunięte przed wdrożeniem
4. **Dokumentacja i zasoby**:
   - Projekt zawiera rozbudowaną dokumentację, którą warto zachować
   - Niektóre zasoby statyczne mogą nie być używane i można je usunąć

# CHECKLISTA PRIORYTETOWYCH ZADAŃ PRZED DEPLOYMENTEM

## ⚠️ BEZPIECZEŃSTWO - NAJWYŻSZY PRIORYTET

- [ ] **NATYCHMIAST ZMIEŃ KLUCZ ADMIN_API_KEY** - obecna wartość "tajny_klucz_admin_2025" musi zostać zastąpiona silnym, wygenerowanym kluczem
- [ ] **Zweryfikuj i usuń wrażliwe tokeny** z pliku .env
- [ ] **Usuń wszystkie console.log zawierające wrażliwe dane** - przeszukaj cały kod
- [ ] **Sprawdź zabezpieczenia API** - rate limiting, walidacja wejścia

## 🧹 CZYSZCZENIE PROJEKTU

- [ ] **Uruchom skrypt czyszczący** z pliku PRZEDDEPLOYMENTOWE-CZYSZCZENIE.md
- [ ] **Usuń nieużywane katalogi testowe**: `/test`, `/test-courts`, `/test-courts-hierarchical`, `/new-test`
- [ ] **Usuń pliki debugowania**: `debug-helpers.js`, wszystkie pliki z przedrostkiem "test-"
- [ ] **Usuń dokumentację deweloperską**: pliki .md nieistotne dla użytkownika końcowego
- [ ] **Usuń skrypty pomocnicze**: `db-fix.js`, `db-reset.ps1`, wszelkie skrypty migracyjne

## 🛢️ BAZA DANYCH

- [ ] **Zweryfikuj finalne migracje Prisma** - upewnij się, że schemat jest ostateczny
- [ ] **Wykonaj czystą migrację produkcyjną** - `npx prisma migrate deploy`
- [ ] **Sprawdź poprawność korelacji między modelem Child i formularzem** - poprawka z `wysylka/page.tsx`

## 🚀 OPTYMALIZACJA APLIKACJI

- [ ] **Ustaw NODE_ENV=production**
- [ ] **Zbuduj produkcyjną wersję aplikacji**: `npm run build`
- [ ] **Zweryfikuj zoptymalizowane bundlowanie** - sprawdź rozmiar i liczbę plików
- [ ] **Usuń wszystkie zbędne zależności** z package.json

## 🧪 TESTY FINALNE

- [ ] **Przeprowadź pełen test formularza** - od pierwszego kroku do zapisania danych
- [ ] **Zweryfikuj zapisywanie kosztów utrzymania dzieci** - czy poprawka działa
- [ ] **Przetestuj obsługę błędów** - sprawdź zachowanie przy nieprawidłowych danych
- [ ] **Sprawdź responsywność** na różnych urządzeniach

## 💾 KOPIE ZAPASOWE

- [ ] **Wykonaj pełny backup projektu przed czyszczeniem**
- [ ] **Wykonaj backup bazy danych produkcyjnej** przed migracją
- [ ] **Zachowaj kopię plików konfiguracyjnych** w bezpiecznym miejscu

## 🚦 DEPLOYMENT

- [ ] **Wdrożenie na środowisko stagingowe** (jeśli dostępne)
- [ ] **Weryfikacja na środowisku stagingowym**
- [ ] **Wdrożenie na środowisko produkcyjne**
- [ ] **Weryfikacja działania na produkcji**
- [ ] **Ustaw monitoring i powiadomienia o błędach**

---

Pamiętaj, aby przed każdym istotnym krokiem wykonywać kopię zapasową projektu. Szczególnie krytyczne jest zabezpieczenie danych przed usuwaniem plików i przed migracją bazy danych.

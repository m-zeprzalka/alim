# Dokumentacja przed deploymentem aplikacji AliMatrix

## Spis treści

1. [Technologie używane w projekcie](#technologie-używane-w-projekcie)
2. [Stan aplikacji](#stan-aplikacji)
3. [Poprawki przed deploymentem](#poprawki-przed-deploymentem)
   - [Bezpieczeństwo](#bezpieczeństwo)
   - [Optymalizacja](#optymalizacja)
   - [Konfiguracja](#konfiguracja)
4. [Checklist przed deploymentem](#checklist-przed-deploymentem)
5. [Plan wdrożenia](#plan-wdrożenia)
6. [Monitoring i utrzymanie](#monitoring-i-utrzymanie)
7. [Zgodność z RODO](#zgodność-z-rodo)

## Technologie używane w projekcie

### Frontend

- **Next.js 15** - Framework React wykorzystujący App Router
- **React 19** - Biblioteka UI
- **TypeScript** - Typowanie statyczne
- **Tailwind CSS** - Framework CSS
- **Radix UI** - Komponenty UI
- **shadcn/ui** - Biblioteka komponentów oparta na Tailwind i Radix
- **Zustand** - Zarządzanie stanem formularzy z persystencją w przeglądarce
- **React Hook Form** - Obsługa formularzy

### Backend

- **Next.js API Routes** - Endpointy API
- **Prisma ORM** - ORM dla bazy danych
- **PostgreSQL** - Relacyjna baza danych
- **ExcelJS** - Generowanie plików Excel

### Zabezpieczenia

- **API Key Authentication** - Zabezpieczenie panelu admina
- **CSRF Protection** - Ochrona przed atakami CSRF
- **Nagłówki bezpieczeństwa** - next-secure-headers
- **Walidacja danych** - zod

## Stan aplikacji

Aplikacja AliMatrix służy do wspomagania ustalania alimentów w Polsce. Główne funkcje obejmują:

1. **Formularz zbierający dane** - wieloetapowy proces zbierania danych o dzieciach, rodzicach, dochodach
2. **Algorytm obliczeniowy** - kalkulacja sugerowanej kwoty alimentów
3. **Panel administracyjny** - zarządzanie danymi formularzy
4. **Baza danych** - przechowywanie danych w modelu relacyjnym
5. **Eksport danych** - generowanie raportów

Aktualnie aplikacja jest gotowa do wstępnego wdrożenia, ale wymaga poprawek w zakresie bezpieczeństwa i optymalizacji.

## Poprawki przed deploymentem

### Bezpieczeństwo

1. **Tokeny CSRF**

   - ✅ Zaimplementowany system tokenów CSRF
   - ⚠️ **Poprawka:** Przenieść przechowywanie tokenów CSRF do bardziej trwałego magazynu (Redis lub baza danych)

2. **Walidacja danych wejściowych**

   - ✅ Wdrożona walidacja z użyciem Zod
   - ⚠️ **Poprawka:** Rozszerzyć walidację na wszystkie pola formularza, dodać walidację biznesową

3. **Ochrona przed atakami typu injection**

   - ✅ Używany Prisma ORM (ochrona przed SQL Injection)
   - ✅ Sanityzacja danych wejściowych

4. **Pseudonimizacja danych**

   - ❌ **Poprawka:** Zaimplementować tokenizację danych osobowych
   - ❌ **Poprawka:** Stosować hashe i identyfikatory zastępcze dla danych użytkowników

5. **Separacja danych wrażliwych**

   - ❌ **Poprawka:** Oddzielić dane kontaktowe (email) od analitycznych

6. **Szyfrowanie danych w bazie**

   - ❌ **Poprawka:** Zaszyfrować wrażliwe dane w bazie danych

7. **Zabezpieczenia API**

   - ❌ **Poprawka:** Wdrożyć uwierzytelnianie JWT lub OAuth dla endpointów API
   - ❌ **Poprawka:** Dodać rate limiting

8. **Nagłówki bezpieczeństwa**
   - ✅ Zaimplementowane podstawowe nagłówki
   - ⚠️ **Poprawka:** Dodać brakujące nagłówki (np. Permissions-Policy)

### Optymalizacja

1. **Optymalizacja kodu**

   - ⚠️ **Poprawka:** Usunąć nieużywane importy i kod
   - ⚠️ **Poprawka:** Zoptymalizować duże komponenty

2. **Optymalizacja obrazów**

   - ⚠️ **Poprawka:** Zoptymalizować wszystkie obrazy w folderze `/public`
   - ⚠️ **Poprawka:** Używać komponentu Next.js Image dla obrazów

3. **Optymalizacja zapytań do bazy danych**

   - ⚠️ **Poprawka:** Sprawdzić i zoptymalizować indeksy w bazie danych
   - ⚠️ **Poprawka:** Ograniczyć liczbę zapytań do bazy danych

4. **Optymalizacja formularzy**
   - ⚠️ **Poprawka:** Zaimplementować walidację w czasie rzeczywistym
   - ⚠️ **Poprawka:** Poprawić UX formularzy (komunikaty błędów, nawigacja)

### Konfiguracja

1. **Zmienne środowiskowe**

   - ⚠️ **Poprawka:** Upewnić się, że wszystkie wymagane zmienne środowiskowe są zdefiniowane
   - ⚠️ **Poprawka:** Używać różnych zmiennych dla środowisk deweloperskich i produkcyjnych

2. **Konfiguracja bazy danych**

   - ⚠️ **Poprawka:** Upewnić się, że migracje są poprawnie zaaplikowane
   - ⚠️ **Poprawka:** Utworzyć i zweryfikować indeksy w bazie danych

3. **Konfiguracja Next.js**
   - ⚠️ **Poprawka:** Zoptymalizować konfigurację Next.js dla produkcji
   - ⚠️ **Poprawka:** Skonfigurować obsługę błędów i stron 404/500

## Checklist przed deploymentem

### 1. Przygotowanie kodu

- [ ] Usunąć wszystkie pliki testowe, duplikaty i tymczasowe (zgodnie z listą w LISTA-PLIKOW-DO-USUNIECIA.md)
- [ ] Sprawdzić i poprawić błędy TypeScript i ESLint
- [ ] Przeprowadzić audyt zależności (`npm audit fix`)
- [ ] Usunąć komentarze debugowania i console.log
- [ ] Poprawić typy TypeScript, gdzie są niekompletne

### 2. Bezpieczeństwo

- [ ] Zweryfikować implementację CSRF z trwałym przechowywaniem
- [ ] Rozszerzyć walidację wszystkich formularzy
- [ ] Wdrożyć pseudonimizację danych osobowych
- [ ] Skonfigurować nagłówki bezpieczeństwa w produkcji
- [ ] Zabezpieczyć API przed nieupoważnionym dostępem
- [ ] Wdrożyć rate limiting dla wrażliwych endpointów
- [ ] Przejrzeć kod pod kątem potencjalnych podatności

### 3. Baza danych

- [ ] Wykonać czystą migrację do produkcyjnej bazy danych
- [ ] Sprawdzić i zoptymalizować indeksy
- [ ] Przygotować skrypty do regularnych backupów
- [ ] Usunąć wszystkie dane testowe
- [ ] Zweryfikować uprawnienia użytkownika bazy danych
- [ ] Zapewnić szyfrowanie danych wrażliwych

### 4. Konfiguracja środowiska

- [ ] Utworzyć `.env.production` ze wszystkimi wymaganymi zmiennymi
- [ ] Skonfigurować domenę i certyfikat SSL
- [ ] Ustawić wartości produkcyjne dla kluczy API
- [ ] Skonfigurować monitorowanie i logowanie błędów
- [ ] Włączyć kompresję zasobów statycznych

### 5. Testy przedwdrożeniowe

- [ ] Przetestować cały przepływ formularza
- [ ] Przetestować panel administracyjny
- [ ] Sprawdzić responsywność na różnych urządzeniach
- [ ] Zweryfikować dostępność (accessibility)
- [ ] Sprawdzić wydajność (Lighthouse)
- [ ] Przetestować funkcje eksportu danych

### 6. RODO

- [ ] Zweryfikować politykę prywatności
- [ ] Sprawdzić formularze zgód
- [ ] Zaimplementować mechanizm usuwania danych
- [ ] Przygotować procedury na wypadek naruszenia
- [ ] Zapewnić pseudonimizację danych osobowych

## Plan wdrożenia

### 1. Przygotowanie środowiska produkcyjnego

```bash
# Utworzenie projektu na Vercel i połączenie z repozytorium
npm install -g vercel
vercel login
vercel link

# Konfiguracja zmiennych środowiskowych
vercel env add DATABASE_URL
vercel env add ADMIN_API_KEY
vercel env add JWT_SECRET
```

### 2. Budowa i wdrożenie aplikacji

```bash
# Przygotowanie lokalnej produkcyjnej wersji
npm run build

# Wdrożenie na Vercel
vercel --prod
```

### 3. Weryfikacja wdrożenia

- Sprawdzenie działania strony głównej i wszystkich podstron
- Przeprowadzenie testów end-to-end
- Weryfikacja integracji z bazą danych
- Sprawdzenie działania panelu administracyjnego

### 4. Monitoring i utrzymanie

- Skonfigurowanie monitoringu i alertów
- Ustawienie regularnych backupów
- Przygotowanie procedur aktualizacji

## Monitoring i utrzymanie

### 1. Konfiguracja monitoringu

- Wdrożenie narzędzi monitorowania (np. Sentry)
- Konfiguracja alertów dla błędów
- Monitoring wydajności API i bazy danych

### 2. Logi i audyt

- Konfiguracja centralnego systemu logowania
- Implementacja logowania zdarzeń bezpieczeństwa
- Ustawienie retencji logów zgodnie z RODO

### 3. Procedury backup i recovery

- Automatyczne regularne backupy bazy danych
- Testowanie procedur odtwarzania z backupu
- Dokumentacja procedur disaster recovery

## Zgodność z RODO

### 1. Dokumentacja RODO

- Finalizacja Polityki Prywatności
- Przygotowanie procedury realizacji praw podmiotów danych
- Dokumentacja mechanizmów pseudonimizacji i ochrony danych

### 2. Zgody i powiadomienia

- Implementacja bannerów cookie/zgód
- Upewnienie się, że wszystkie formularze zbierają wymagane zgody
- Wdrożenie mechanizmu rejestracji i śledzenia zgód

### 3. Procedury obsługi naruszeń

- Opracowanie procedury zgłaszania naruszeń
- Przygotowanie szablonów powiadomień
- Wdrożenie mechanizmów wykrywania potencjalnych naruszeń

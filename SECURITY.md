# Zabezpieczenia formularza AliMatrix

## Wdrożone zabezpieczenia

### 1. Ochrona CSRF (Cross-Site Request Forgery)

- Generowanie unikalnych tokenów CSRF dla każdej sesji formularza
- Weryfikacja tokenów na serwerze przed przetwarzaniem danych
- Jednorazowe tokeny (consumeCSRFToken) zapobiegające wielokrotnym wysyłkom
- Dodanie nagłówków X-Requested-With dla dodatkowej weryfikacji

### 2. Walidacja i sanityzacja danych

- Kompleksowa walidacja formularzy z użyciem biblioteki Zod
- Sanityzacja wszystkich danych wejściowych (zapobieganie XSS)
- Filtrowanie niebezpiecznych atrybutów i tagów HTML
- Usuwanie potencjalnie niebezpiecznych kluczy obiektów

### 3. Ograniczanie szybkości zapytań (Rate Limiting)

- Implementacja ograniczenia liczby zapytań na adres IP
- Automatyczne czyszczenie starych danych ograniczania
- Konfigurowalny limit i okno czasowe dla zapytań

### 4. Wykrywanie botów

- Implementacja pola-pułapki (honeypot) ukrytego przed użytkownikami
- Weryfikacja czasu wypełniania formularza
- Odrzucanie podejrzanych wysyłek bez ujawniania wykrycia

### 5. Bezpieczne przechowywanie danych

- Separacja danych kontaktowych od danych analitycznych
- Szyfrzowanie danych w lokalnym magazynie (obfuscation)
- Automatyczne czyszczenie tokenów i danych tymczasowych

### 6. Nagłówki bezpieczeństwa

- Content Security Policy (CSP) dla zapobiegania atakom XSS
- X-Content-Type-Options chroniący przed MIME-sniffing
- X-Frame-Options zapobiegający clickjackingowi
- Referrer-Policy kontrolujący informacje o odniesieniach
- Permissions-Policy ograniczający dostęp do funkcji przeglądarki

## Bezpieczne API Endpoints

### /api/register-csrf

- Rejestracja tokenu CSRF na serwerze
- Walidacja poprawności tokenu
- Automatyczne czyszczenie starych tokenów

### /api/secure-submit

- Pełna walidacja i sanityzacja danych wejściowych
- Weryfikacja tokenu CSRF
- Weryfikacja zgód użytkownika
- Obsługa błędów z odpowiednimi kodami statusu
- Dodanie nagłówków bezpieczeństwa do odpowiedzi

## Obsługa błędów

- Szczegółowe komunikaty błędów dla użytkowników
- Logowanie błędów po stronie serwera
- Dedykowany komponent FormErrorAlert dla poprawy UX
- Bezpieczne przetwarzanie błędów bez ujawniania szczegółów implementacji

## Dodatkowe funkcje bezpieczeństwa

- Zabezpieczenie przed wielokrotnym kliknięciem przycisku wysyłania
- Automatyczne czyszczenie danych formularza po wysłaniu
- Obfuskacja danych przechowywanych lokalnie
- Dodatkowe odciski przeglądarki (browser fingerprinting) dla tokenów

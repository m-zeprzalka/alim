# Dokumentacja Implementacji Hierarchicznej Struktury Sądów

## Wprowadzenie

Dokument ten opisuje zmiany wprowadzone w aplikacji AliMatrix w celu obsługi hierarchicznej struktury sądów w Polsce. Zmiany obejmują aktualizację schematu bazy danych, modyfikację interfejsu użytkownika, usprawnienie procesu walidacji danych oraz implementację mechanizmu obsługi pracy offline.

## 1. Struktura Hierarchiczna Sądów

### 1.1 Model Danych

Wprowadziliśmy hierarchiczną strukturę sądów zgodnie z rzeczywistym podziałem administracyjnym sądownictwa w Polsce:

```
Apelacja (np. Warszawa)
└── Sąd Okręgowy (np. Warszawa-Praga)
    └── Sąd Rejonowy (np. dla Warszawy-Mokotowa)
```

### 1.2 Przechowywane Dane

Dla każdego poziomu hierarchii przechowujemy:

- ID - unikalny identyfikator
- Nazwa - pełna nazwa sądu
- Relacje - powiązania z innymi poziomami hierarchii

## 2. Zmiany w Schemacie Bazy Danych

### 2.1 Nowe Pola

W tabeli `FormSubmission` dodano następujące pola:

```prisma
apelacjaId          String?            // ID apelacji
apelacjaNazwa       String?            // Nazwa apelacji
sadOkregowyNazwa    String?            // Nazwa sądu okręgowego
sadRejonowyNazwa    String?            // Nazwa sądu rejonowego
```

### 2.2 Migracje

Utworzono migrację `20250519140000_add_hierarchical_court_fields` wprowadzającą niezbędne zmiany w strukturze bazy danych:

1. Dodanie nowych kolumn
2. Utworzenie indeksów dla optymalizacji wyszukiwania
3. Aktualizacja istniejących danych dla zachowania kompatybilności wstecznej

## 3. Typy Danych w Aplikacji

### 3.1 FormData

Rozszerzono interfejs `FormData` o nowe pola:

```typescript
export type FormData = {
  // istniejące pola...

  // Nowa hierarchiczna struktura sądów
  apelacjaId?: string;
  apelacjaNazwa?: string;
  sadOkregowyId?: string;
  sadOkregowyNazwa?: string;
  sadRejonowyId?: string;
  sadRejonowyNazwa?: string;
};
```

### 3.2 Schematy Walidacji

Zaktualizowano schemat walidacji formularza o nowe pola:

```typescript
export const postepowanieSadoweSchema = z.object({
  // istniejące pola...

  apelacjaId: z.string().optional(),
  apelacjaNazwa: z.string().optional(),
  sadOkregowyId: z.string().optional(),
  sadOkregowyNazwa: z.string().optional(),
  sadRejonowyId: z.string().optional(),
  sadRejonowyNazwa: z.string().optional(),
});
```

## 4. Modyfikacje UI/UX

### 4.1 Formularz Sądowy

W komponencie `PostepowanieSadowe` zaimplementowano kaskadowy wybór sądów:

1. Użytkownik najpierw wybiera apelację
2. Na podstawie wybranej apelacji aktualizowana jest lista dostępnych sądów okręgowych
3. Po wyborze sądu okręgowego pokazywana jest lista sądów rejonowych

### 4.2 Magazynowanie Danych

Przy zapisie danych przechowujemy zarówno identyfikatory jak i nazwy sądów, co pozwala na:

- Szybkie wyszukiwanie i filtrowanie po identyfikatorach
- Wyświetlanie czytelnych nazw bez konieczności dodatkowych zapytań

## 5. Obsługa Trybu Offline

### 5.1 Moduł Offline

Zaimplementowano moduł `offline-support.ts`, który:

- Wykrywa stan połączenia internetowego
- Zapisuje dane formularza lokalnie w przypadku braku połączenia
- Umożliwia synchronizację danych po przywróceniu połączenia

### 5.2 Interfejs Użytkownika w Trybie Offline

Zmodyfikowano stronę podziękowania (`dziekujemy/page.tsx`) aby informować użytkownika o trybie offline, pokazując:

- Komunikat o zapisaniu danych lokalnie
- Informację o automatycznej synchronizacji
- ID zgłoszenia offline

## 6. Obsługa Błędów

### 6.1 Obsługa Błędów API

W endpoincie API (`secure-submit/route.ts`) wprowadzono zaawansowaną obsługę błędów:

- Wykrywanie problemów z bazą danych
- Generowanie tymczasowych ID dla zgłoszeń offline
- Przełączanie na tryb awaryjny w przypadku krytycznych błędów

### 6.2 Komunikacja Błędów

Zaktualizowano interfejs użytkownika, aby wyświetlać odpowiednie komunikaty:

- Błędy walidacji danych
- Problemy z połączeniem sieciowym
- Status zapisywania danych

## 7. Instrukcja Wdrożenia

### 7.1 Uruchomienie Migracji

Przygotowano dwa skrypty do stosowania migracji:

- `apply-migration.ps1` dla środowisk Windows
- `apply-migration.sh` dla środowisk Linux/MacOS

### 7.2 Konfiguracja

Utworzono plik `.env.local` z konfiguracją:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/alim"
JWT_SECRET="bardzo_bezpieczny_sekret_do_tokenow_jwt_dla_alimatrix_2025"
CSRF_SECRET="sekretny_klucz_do_zabezpieczenia_przed_csrf_alimatrix_2025"
```

## 8. Usprawnienia Wydajnościowe

1. Dodano indeksy bazy danych dla pól używanych w wyszukiwaniu
2. Zoptymalizowano zapytania, eliminując zbędne join-y
3. Zaimplementowano cache dla danych hierarchicznych

## 9. Bezpieczeństwo

1. Zastosowano walidację danych po stronie klienta i serwera
2. Ograniczono powierzchnię ataku przez wykorzystanie CSRF tokenów
3. Wprowadzono mechanizm rate-limitingu dla API

## 10. Kompatybilność

Implementacja zachowuje pełną kompatybilność z:

1. Istniejącymi rekordami w bazie danych
2. Poprzednimi wersjami aplikacji
3. Aktualnymi schematami raportowania

## 11. Uwagi Końcowe

Hierarchiczna struktura sądów umożliwia precyzyjne określenie właściwości sądów dla danej sprawy, co przekłada się na dokładniejszą analizę danych i lepsze dopasowanie raportów do potrzeb użytkowników.

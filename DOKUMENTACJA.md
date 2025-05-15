# Dokumentacja aplikacji AliMatrix

## Spis treści

1. [Wprowadzenie](#wprowadzenie)
2. [Stan aplikacji](#stan-aplikacji)
3. [Architektura](#architektura)
4. [Struktura projektu](#struktura-projektu)
5. [Model danych](#model-danych)
6. [Przebieg ankiety](#przebieg-ankiety)
7. [Komponenty UI](#komponenty-ui)
8. [API](#api)
9. [Panel administracyjny](#panel-administracyjny)
10. [Zabezpieczenia](#zabezpieczenia)
11. [Proponowane ulepszenia](#proponowane-ulepszenia)

## Wprowadzenie

AliMatrix to aplikacja webowa, której celem jest wsparcie procesu ustalania alimentów w Polsce poprzez zbieranie i analizowanie danych dotyczących rzeczywistych przypadków ustalania sposobu finansowania potrzeb dzieci po rozstaniu rodziców. Aplikacja umożliwia użytkownikom wprowadzenie szczegółowych informacji o swojej sytuacji i w zamian oferuje spersonalizowane raporty porównawcze.

### Główne cele aplikacji:

- Zbieranie danych o rzeczywistych przypadkach ustalania alimentów w Polsce
- Tworzenie bazy wiedzy na temat praktycznych rozwiązań stosowanych w różnych sytuacjach
- Dostarczanie użytkownikom spersonalizowanych raportów porównujących ich sytuację z podobnymi przypadkami
- Zwiększenie transparentności procesu ustalania alimentów

## Stan aplikacji

Aktualnie aplikacja znajduje się w fazie demonstracyjnej i koncentruje się na zbieraniu danych. Główna funkcjonalność obejmuje:

1. Formularz wieloetapowy do zbierania danych
2. Dwie ścieżki użytkownika:
   - Dla osób z ustalonymi zasadami finansowania (pełny formularz)
   - Dla osób bez ustalonych zasad (formularz zapisu na powiadomienia)
3. Przechowywanie wprowadzonych danych w lokalnym storage przeglądarki
4. Bezpieczne przechowywanie danych w sessionStorage z podstawowym szyfrowaniem
5. Prosty panel administracyjny do przeglądania subskrypcji
6. Eksport danych do formatu Excel

Aplikacja jest zbudowana w oparciu o nowoczesny stos technologiczny, z wykorzystaniem Next.js 15, React 19, Prisma ORM i PostgreSQL.

## Architektura

AliMatrix wykorzystuje następującą architekturę:

- **Frontend**: Next.js 15 (App Router), React 19
- **Backend**: API Routes w Next.js
- **Baza danych**: PostgreSQL z Prisma ORM
- **Zarządzanie stanem**: Zustand
- **UI**: Komponenty oparte na Tailwind CSS, Radix UI
- **Uwierzytelnianie**: Prosty mechanizm autoryzacji przez klucz API dla panelu administratora

## Struktura projektu

Projekt ma standardową strukturę aplikacji Next.js z App Routerem:

- **`/src/app`** - Główne komponenty stron aplikacji
- **`/src/app/api`** - Endpointy API
- **`/src/components`** - Komponenty UI
- **`/src/lib`** - Biblioteki i narzędzia pomocnicze
- **`/prisma`** - Schemat bazy danych i migracje
- **`/public`** - Statyczne zasoby

Kluczowe foldery:

- **`/src/app/[nazwa-kroku]`** - Strony odpowiadające poszczególnym krokom formularza
- **`/src/app/admin`** - Panel administracyjny
- **`/src/lib/store`** - Zarządzanie stanem formularza

## Model danych

### Aktualny schemat bazy danych:

```prisma
model EmailSubscription {
  id                String    @id @default(cuid())
  email             String    @unique
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  acceptedTerms     Boolean   @default(false)
  status            String    @default("pending")
  verificationToken String?
  verifiedAt        DateTime?

  @@index([status])
}
```

### Model danych formularza:

Dane formularza są przechowywane lokalnie przy pomocy Zustand i obejmują:

1. **Wybór ścieżki**: established/not-established
2. **Podstawa ustaleń**: wybór sposobu ustalenia alimentów
3. **Dane dzieci**: wiek, płeć, specjalne potrzeby, model opieki
4. **Czas opieki**: szczegółowe informacje o podziale czasu opieki
5. **Koszty utrzymania**: informacje o wydatkach na dzieci i kwotach alimentów
6. **Dochody rodziców**: informacje o dochodach i kosztach utrzymania
7. **Ocena adekwatności**: subiektywna ocena adekwatności ustalonych zasad

## Przebieg ankiety

Aplikacja przeprowadza użytkownika przez wieloetapowy proces zbierania danych:

1. **Strona główna**: Informacje o projekcie i jego celach
2. **Wybór ścieżki**: Określenie czy użytkownik ma już ustalone zasady finansowania
3. **Dla osób bez ustalonych zasad**:

   - Formularz zapisu na powiadomienia
   - Możliwość wsparcia projektu

4. **Dla osób z ustalonymi zasadami (pełny formularz)**:
   - **Finansowanie**: Informacje o sposobie finansowania potrzeb dziecka
   - **Podstawa ustaleń**: Informacje o formie ustalenia alimentów
   - **Dzieci**: Dane o dzieciach, ich wieku, płci i specjalnych potrzebach
   - **Czas opieki**: Szczegółowy podział czasu opieki (opcjonalnie)
   - **Koszty utrzymania**: Wydatki na dzieci i kwoty alimentów
   - **Dochody rodziców**: Informacje o dochodach i kosztach utrzymania
   - **Ocena adekwatności**: Subiektywna ocena adekwatności rozwiązań

## Komponenty UI

Aplikacja wykorzystuje zestaw spójnych komponentów UI, w tym:

- **Logo**: Komponent wyświetlający logo aplikacji
- **FormProgress**: Pasek postępu formularza
- **InfoTooltip**: Podpowiedzi i wyjaśnienia dla użytkowników
- **ClickableRadioOption**: Ulepszone komponenty radio button
- **SecurityBanner**: Informacje o bezpieczeństwie danych

## API

Aplikacja udostępnia następujące endpointy API:

- **`/api/subscribe`**: Zapisanie użytkownika na powiadomienia
- **`/api/admin/subscriptions`**: Pobieranie listy subskrypcji (wymaga klucza API)
- **`/api/admin/export-excel`**: Eksport subskrypcji do Excela (wymaga klucza API)

## Panel administracyjny

Panel administracyjny umożliwia:

1. **Przeglądanie subskrypcji**: Lista osób zapisanych na powiadomienia
2. **Statystyki**: Liczba wszystkich, oczekujących i zweryfikowanych subskrypcji
3. **Eksport danych**: Możliwość pobrania danych w formacie Excel

Dostęp do panelu jest chroniony prostym mechanizmem autoryzacji przez klucz API.

## Zabezpieczenia

Aplikacja wykorzystuje kilka mechanizmów bezpieczeństwa:

1. **Szyfrowanie danych w sessionStorage**: Podstawowe szyfrowanie dla danych przechowywanych lokalnie
2. **Automatyczne czyszczenie danych**: Usuwanie wrażliwych danych po czasie bezczynności
3. **Autoryzacja przez klucz API**: Ochrona dostępu do panelu administracyjnego
4. **Pseudonimizacja danych**: Oddzielne przechowywanie adresów email od pozostałych danych

## Proponowane ulepszenia

Na podstawie analizy aktualnego stanu aplikacji, proponuję następujące ulepszenia:

### 1. Rozbudowa modelu danych

- Implementacja pełnego modelu danych w bazie PostgreSQL
- Dodanie tabel dla wszystkich danych zbieranych w formularzu
- Utworzenie relacji między danymi

### 2. Uwierzytelnianie i bezpieczeństwo

- Wdrożenie pełnego systemu uwierzytelniania (np. NextAuth.js)
- Dodanie różnych poziomów uprawnień dla administratorów
- Wzmocnienie szyfrowania danych

### 3. Funkcjonalność raportów

- Implementacja generowania raportów na podstawie zebranych danych
- Stworzenie algorytmów porównawczych
- Dodanie wizualizacji danych (wykresy, porównania)

### 4. Rozbudowa panelu administracyjnego

- Dodanie możliwości zarządzania danymi formularzy
- Implementacja analizy i statystyk zebranych danych
- Dodanie zaawansowanego filtrowania i wyszukiwania

### 5. UX/UI

- Optymalizacja interfejsu mobilnego
- Dodanie możliwości przerwania i kontynuowania wypełniania formularza
- Implementacja walidacji danych w czasie rzeczywistym

### 6. Infrastruktura

- Dodanie testów automatycznych
- Konfiguracja CI/CD
- Monitoring i analityka błędów

### 7. Funkcje dodatkowe

- Implementacja wersji drukowanej raportów
- System powiadomień email
- Możliwość edycji wprowadzonych danych
- Integracja z zewnętrznymi źródłami danych

### Priorytetowe zadania do realizacji:

1. Implementacja pełnego modelu danych w bazie PostgreSQL
2. Wdrożenie systemu uwierzytelniania
3. Stworzenie mechanizmu generowania raportów
4. Rozbudowa panelu administracyjnego
5. Optymalizacja UX formularza

## Podsumowanie

Aplikacja AliMatrix jest dobrze zaprojektowanym narzędziem do zbierania danych o alimentach w Polsce. Aktualna wersja koncentruje się na gromadzeniu danych, a kolejnym krokiem powinno być wdrożenie funkcji generowania raportów i analiz.

Projekt ma duży potencjał, aby stać się wartościowym narzędziem zarówno dla rodziców ustalających zasady finansowania potrzeb dzieci, jak i dla osób profesjonalnie zajmujących się tą tematyką (prawnicy, mediatorzy).

Proponowane ulepszenia pozwolą przekształcić obecną wersję demonstracyjną w pełnowartościowe narzędzie analityczne, które może realnie wpłynąć na praktykę ustalania alimentów w Polsce.

# Instrukcja wdrożenia AliMatrix na Vercel

## Przygotowanie

Przed wdrożeniem upewnij się, że:

1. Masz konto na [Vercel](https://vercel.com)
2. Masz konto na [GitHub](https://github.com)
3. Kod aplikacji jest wypchany do repozytorium GitHub
4. Masz zainstalowany Vercel CLI (opcjonalnie)

## Wdrożenie przez panel Vercel

1. Zaloguj się do [Vercel Dashboard](https://vercel.com/dashboard)
2. Kliknij "Add New..." następnie "Project"
3. Wybierz swoje repozytorium GitHub z AliMatrix
4. Skonfiguruj projekt:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: pozostaw domyślną
   - Output Directory: pozostaw domyślną
5. Rozwiń sekcję "Environment Variables" i dodaj zmienne z pliku `.env`:
   - `DATABASE_URL` - URL do bazy danych PostgreSQL
   - `ADMIN_API_KEY` - bezpieczny klucz API dla panelu administracyjnego
6. Kliknij "Deploy"

## Wdrożenie przez Vercel CLI

1. Zainstaluj Vercel CLI:

```bash
npm install -g vercel
```

2. Zaloguj się do Vercel:

```bash
vercel login
```

3. Wdróż aplikację (w folderze projektu):

```bash
vercel
```

4. Postępuj zgodnie z instrukcjami w terminalu, aby skonfigurować projekt.

## Po wdrożeniu

1. Sprawdź, czy aplikacja działa poprawnie pod przydzielonym adresem URL
2. Przetestuj formularz subskrypcji
3. Sprawdź, czy panel administracyjny działa poprawnie

## Konfiguracja domeny (opcjonalnie)

1. W panelu projektu na Vercel przejdź do zakładki "Domains"
2. Dodaj swoją domenę zgodnie z instrukcjami
3. Skonfiguruj rekordy DNS zgodnie z zaleceniami Vercel

## Uwagi

- Pamiętaj, że ta wersja jest demonstracyjna i działa na fikcyjnych danych
- Zabezpiecz lepiej panel administracyjny przed wdrożeniem produkcyjnym
- Rozważ dodanie systemu uwierzytelniania dla administratorów

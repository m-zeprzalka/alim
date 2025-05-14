# AliMatrix

AliMatrix to aplikacja wspomagająca ustalanie alimentów w Polsce. Narzędzie pomaga w analizie sytuacji finansowej i określeniu odpowiednich kwot alimentów.

## Wersja Demo

Aktualna wersja jest demonstracyjna i działa na fikcyjnych danych. Służy do prezentacji koncepcji i zbierania zainteresowanych osób.

## Funkcje

- Analiza sytuacji finansowej
- Zbieranie subskrypcji email od zainteresowanych
- Panel administracyjny do zarządzania danymi
- Eksport danych do plików Excel

## Rozpoczęcie pracy

### Wymagania

- Node.js w wersji 18.0 lub nowszej
- Konto w serwisie Vercel (do bazy danych i deploymentu)

### Instalacja i uruchomienie

1. Sklonuj repozytorium:

```bash
git clone https://github.com/your-username/alimatrix.git
cd alimatrix
```

2. Zainstaluj zależności:

```bash
npm install
```

3. Skopiuj plik `.env.example` do `.env` i uzupełnij wymagane zmienne środowiskowe:

```bash
cp .env.example .env
```

4. Wykonaj migracje bazy danych (jeśli jeszcze nie zostały wykonane):

```bash
npx prisma migrate deploy
```

5. Uruchom serwer deweloperski:

```bash
npm run dev
```

6. Otwórz [http://localhost:3000](http://localhost:3000) w przeglądarce.

## Deployment na Vercel

Aplikacja jest przygotowana do wdrożenia na platformie Vercel:

1. Wypchij kod do repozytorium GitHub
2. Połącz projekt z Vercel
3. Ustaw wymagane zmienne środowiskowe w panelu projektu Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

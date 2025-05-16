# Stos technologiczny aplikacji AliMatrix

## Frontend

- **Next.js 15** - Framework React z funkcją App Router
- **React 19** - Biblioteka UI
- **TypeScript** - Typowanie statyczne dla JavaScript
- **Tailwind CSS** - Framework CSS dla stylowania
- **Radix UI** - Dostępne, nieostylowane komponenty UI
- **Zustand** - Zarządzanie stanem formularzy i aplikacji
- **ExcelJS** - Generowanie plików Excel po stronie serwera
- **shadcn/ui** - Biblioteka komponentów UI oparta na Tailwind i Radix

## Backend

- **Next.js API Routes** - Endpointy API wbudowane w Next.js
- **Prisma ORM** - Typowany ORM dla bazy danych PostgreSQL
- **PostgreSQL** - Relacyjna baza danych

## DevOps & Narzędzia

- **ESLint** - Linter kodu JavaScript/TypeScript
- **Prettier** - Formatowanie kodu
- **TypeScript** - Statyczne typowanie

## Zabezpieczenia

- **API Key Authentication** - Zabezpieczenie panelu admina
- **CSRF Protection** - Ochrona przed Cross-Site Request Forgery
- **Szyfrowanie danych lokalnych** - Zabezpieczenie danych w sessionStorage

## Funkcje kluczowe

- **Zustand** - Zarządzanie stanem formularzy z persystencją w przeglądarce
- **Prisma** - Mapowanie obiektowo-relacyjne z typami TypeScript
- **ExcelJS** - Zaawansowane generowanie plików Excel z wielu arkuszy
- **API Routes** - Implementacja API RESTful w Next.js

## Uwagi dotyczące wdrożenia

- Aplikacja wymaga Node.js w wersji 18+ oraz PostgreSQL 14+
- Zalecane wdrożenie na Vercel lub innej platformie obsługującej Next.js
- Wymagane zmienne środowiskowe:
  - `DATABASE_URL` - URL połączenia do bazy PostgreSQL
  - `ADMIN_API_KEY` - Klucz API do panelu administracyjnego
  - `NEXTAUTH_SECRET` (opcjonalnie) - Secret dla uwierzytelniania

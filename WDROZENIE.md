# Instrukcja wdrożenia aplikacji AliMatrix

## 1. Przygotowanie projektu przed wdrożeniem

### 1.1. Porządkowanie projektu 🧹

```bash

# 2. Usuń pliki testowe
rm c:/ALIMATRIX/alimatrix/src/app/test-form/page.tsx
rm c:/ALIMATRIX/alimatrix/src/app/test/page.tsx



# 4. Usuń tymczasowe pliki i skrypty migracji (po zakończeniu migracji)
rm c:/ALIMATRIX/alimatrix/prisma/apply-migration.js
rm c:/ALIMATRIX/alimatrix/prisma/run-schema-migration.ts
rm c:/ALIMATRIX/alimatrix/prisma/run-migration.ts
rm c:/ALIMATRIX/alimatrix/prisma/db-check.js
rm c:/ALIMATRIX/alimatrix/prisma/check-tables.js
rm c:/ALIMATRIX/alimatrix/prisma/check-db.ts
rm c:/ALIMATRIX/alimatrix/prisma/check-form-submission.sql
rm c:/ALIMATRIX/alimatrix/prisma/test-court-fields.ts
rm c:/ALIMATRIX/alimatrix/prisma/schema.prisma.new
rm c:/ALIMATRIX/alimatrix/apply-migration.ps1
rm c:/ALIMATRIX/alimatrix/update-database.ps1
rm c:/ALIMATRIX/alimatrix/init-git.ps1

# 5. Usuń niepotrzebne pliki i loga
rm c:/ALIMATRIX/alimatrix/public/next.svg
rm c:/ALIMATRIX/alimatrix/public/vercel.svg
```

### 1.2. Sprawdzenie i testowanie aplikacji 🧪

```bash
# 1. Sprawdź błędy TypeScript
cd c:/ALIMATRIX/alimatrix
npx tsc --noEmit

# 2. Sprawdź problemy z linterem
npm run lint

# 3. Sprawdź problemy z zależnościami
npm audit
npm audit fix  # Jeśli znaleziono problemy

# 4. Uruchom aplikację lokalnie w trybie produkcyjnym
npm run build
npm run start

# 5. Sprawdź wycieki danych
npx next-secure-headers
```

## 2. Konfiguracja środowiska produkcyjnego

### 2.1. Konfiguracja konta Vercel 🚀

1. Załóż konto na [Vercel](https://vercel.com/) lub zaloguj się na istniejące.
2. Połącz konto Vercel z repozytorium GitHub projektu.

### 2.2. Konfiguracja domeny 🌐

1. Zakup domeny dla projektu (np. alimatrix.pl).
2. W panelu Vercel przejdź do sekcji "Domains".
3. Dodaj zakupioną domenę i skonfiguruj DNS zgodnie z instrukcjami.

### 2.3. Konfiguracja bazy danych 💾

```bash
# 1. Utwórz produkcyjną bazę danych PostgreSQL
# Możesz użyć Vercel Postgres, Supabase, Railway lub innego dostawcy

# 2. Skopiuj schemat bazy danych do środowiska produkcyjnego
npx dotenv -e .env.production -- npx prisma migrate deploy

# 3. Generuj klienta Prisma dla produkcji (z opcją --no-engine dla mniejszego rozmiaru wdrożenia)
npx dotenv -e .env.production -- npx prisma generate --no-engine
```

### 2.4. Konfiguracja zmiennych środowiskowych 🔐

W panelu Vercel przejdź do ustawień projektu i dodaj następujące zmienne środowiskowe:

```
# Połączenie z bazą danych
DATABASE_URL=postgresql://username:password@host:port/database

# Bezpieczeństwo API
ADMIN_API_KEY=długi_losowy_ciąg_znaków_dla_zabezpieczenia_API_administracyjnego
CSRF_SECRET=inny_długi_losowy_ciąg_znaków_dla_tokenów_CSRF

# Konfiguracja emaili (jeśli używasz)
EMAIL_SERVER=smtp://username:password@smtp.example.com:587
EMAIL_FROM=noreply@alimatrix.pl

# Inne ustawienia
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://alimatrix.pl
```

### 2.5. Konfiguracja SSL 🔒

SSL zostanie skonfigurowany automatycznie przez Vercel dla Twojej domeny.

## 3. Wdrażanie aplikacji

### 3.1. Wdrożenie pierwszej wersji 🚢

```bash
# 1. Zaloguj się do Vercel z CLI
npm install -g vercel
vercel login

# 2. Wdróż aplikację
vercel --prod
```

Alternatywnie, skonfiguruj automatyczne wdrożenia z GitHub, gdzie każdy push do głównej gałęzi będzie automatycznie wdrażany.

### 3.2. Konfiguracja CI/CD 🔄

1. Utwórz plik `.github/workflows/ci.yml` z konfiguracją GitHub Actions:

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Use Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"
      - name: Install dependencies
        run: npm ci
      - name: Type check
        run: npx tsc --noEmit
      - name: Lint
        run: npm run lint
      - name: Security audit
        run: npm audit --audit-level=high

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: "--prod"
```

2. Dodaj sekrety do repozytorium GitHub:
   - `VERCEL_TOKEN`: Token API Vercel
   - `VERCEL_ORG_ID`: ID organizacji Vercel
   - `VERCEL_PROJECT_ID`: ID projektu Vercel

## 4. Monitoring i utrzymanie

### 4.1. Konfiguracja monitoringu 📊

#### Sentry

1. Zarejestruj konto na [Sentry](https://sentry.io/).
2. Utwórz nowy projekt dla aplikacji Next.js.
3. Zainstaluj Sentry w projekcie:

```bash
npm install @sentry/nextjs
```

4. Skonfiguruj Sentry zgodnie z instrukcjami w dokumentacji.

#### Google Analytics

1. Utwórz konto Google Analytics.
2. Dodaj kod śledzenia do aplikacji.

### 4.2. Backupy bazy danych 💾

Skonfiguruj regularne backupy bazy danych:

```bash
# Utwórz skrypt backupu (backup.sh)
#!/bin/bash
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
PGPASSWORD=twoje_haslo pg_dump -h host -U username -d database -F c -b -v -f "backup_$TIMESTAMP.backup"
```

Skonfiguruj cron do uruchamiania backupów co 24 godziny:

```
0 2 * * * /ścieżka/do/backup.sh
```

### 4.3. Aktualizacje i zarządzanie 🔄

1. Regularnie aktualizuj zależności:

```bash
npm update
npm audit fix
```

2. Monitoruj logi aplikacji:

   - Skonfiguruj Vercel Logs
   - Zintegruj z zewnętrznym systemem logowania (np. Logtail, Papertrail)

3. Ustaw alerty na ważne metryki:
   - Błędy 5xx
   - Długi czas odpowiedzi API
   - Nieudane próby logowania do panelu administratora

## 5. Zgodność z RODO i bezpieczeństwo

### 5.1. Ostateczna weryfikacja RODO ✅

1. Upewnij się, że Polityka Prywatności jest dostępna w aplikacji.
2. Sprawdź, czy wszystkie formularze zbierają wymagane zgody.
3. Zweryfikuj mechanizm pseudonimizacji danych.
4. Przygotuj procedurę obsługi wniosków o dostęp/usunięcie danych.

### 5.2. Bezpieczeństwo aplikacji 🛡️

1. Skonfiguruj nagłówki bezpieczeństwa HTTP:

```javascript
// next.config.js
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' *.googletagmanager.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob: *.googletagmanager.com;
  font-src 'self';
  connect-src 'self' *.vercel-analytics.com sentry.io;
  frame-src 'self';
`;

module.exports = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: ContentSecurityPolicy.replace(/\s{2,}/g, " ").trim(),
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};
```

2. Włącz rate limiting dla punktów końcowych API:

```javascript
// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getIpAddress } from './lib/utils'

// Prosta implementacja rate limitingu
const REQUESTS_PER_MINUTE = 60
const ipRequests = new Map<string, { count: number; timestamp: number }>()

export function middleware(request: NextRequest) {
  const ip = getIpAddress(request)

  // Sprawdź limit dla IP
  const now = Date.now()
  const ipData = ipRequests.get(ip) || { count: 0, timestamp: now }

  // Reset licznika po minucie
  if (now - ipData.timestamp > 60000) {
    ipData.count = 0
    ipData.timestamp = now
  }

  // Zwiększ licznik i sprawdź limit
  ipData.count++
  ipRequests.set(ip, ipData)

  if (ipData.count > REQUESTS_PER_MINUTE) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/api/:path*',
}
```

3. Dodatkowe zabezpieczenia:
   - Włącz 2FA dla wszystkich kont deweloperskich/administracyjnych
   - Regularnie rotuj hasła i klucze API
   - Przeprowadź regularny audyt bezpieczeństwa

## 6. Ostateczne kroki wdrożenia

### 6.1. Sprawdzenie przed wdrożeniem ✅

Przed ostatecznym wdrożeniem produkcyjnym:

1. Przeprowadź testy end-to-end na środowisku staging.
2. Sprawdź wydajność aplikacji narzędziem Lighthouse.
3. Przeprowadź ostatni audyt kodu i bezpieczeństwa.
4. Upewnij się, że wszystkie zmienne środowiskowe są poprawnie ustawione.

### 6.2. Wdrożenie produkcyjne 🚀

```bash
# Wdrożenie produkcyjne
vercel --prod

# Weryfikacja wdrożenia
curl -I https://alimatrix.pl # Sprawdź kody odpowiedzi HTTP i nagłówki
```

### 6.3. Po wdrożeniu 🏁

1. Monitoruj logowania błędów w pierwszych godzinach/dniach.
2. Konfiguruj alerty, aby być na bieżąco informowanym o problemach.
3. Przetestuj aplikację na różnych urządzeniach i przeglądarkach.
4. Zbierz pierwsze opinie użytkowników i rozważ wprowadzenie ulepszeń.

## 7. Przydatne linki i zasoby 📚

- [Dokumentacja Next.js](https://nextjs.org/docs)
- [Dokumentacja Vercel](https://vercel.com/docs)
- [Dokumentacja Prisma](https://www.prisma.io/docs)
- [Najlepsze praktyki bezpieczeństwa web](https://cheatsheetseries.owasp.org/)
- [Przewodnik RODO](https://gdpr.eu/checklist/)

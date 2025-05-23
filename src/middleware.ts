import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Ta funkcja może być oznaczona jako `async` jeśli używasz `await` wewnątrz
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Sprawdź czy ścieżka zaczyna się od /admin ale nie jest stroną logowania
  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginPage = pathname === "/admin/login";

  // Sprawdź czy użytkownik jest zalogowany (istnieje token w ciasteczkach)
  const isAuthenticated = request.cookies.has("admin_auth_token");

  // Jeśli to ścieżka administracyjna (ale nie strona logowania) i użytkownik nie jest zalogowany,
  // przekieruj do strony logowania
  if (isAdminRoute && !isLoginPage && !isAuthenticated) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  // Jeśli użytkownik jest już zalogowany i próbuje wejść na stronę logowania,
  // przekieruj go do panelu administracyjnego
  if (isLoginPage && isAuthenticated) {
    return NextResponse.redirect(new URL("/admin/subscriptions", request.url));
  }

  // Kontynuuj normalne przetwarzanie
  return NextResponse.next();
}

// Konfiguracja określa, dla których ścieżek middleware będzie uruchamiane
export const config = {
  // Uruchom middleware tylko dla ścieżek /admin
  matcher: "/admin/:path*",
};

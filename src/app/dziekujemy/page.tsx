"use client";

import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/custom/Logo";
import { SecurityBanner } from "@/components/ui/custom/SecurityBanner";
import Link from "next/link";
import { useFormStore } from "@/lib/store/form-store";

export default function ThankYouPage() {
  const { resetForm } = useFormStore();

  // Resetuj formularz przy wejściu na stronę podziękowania
  // Zapobiega to ponownemu wysłaniu formularza przez refreshowanie strony
  useEffect(() => {
    // Opóźniamy resetowanie formularza, aby dać czas na synchronizację z bazą danych
    const timeoutId = setTimeout(() => {
      resetForm();
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [resetForm]);

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
      <Card className="w-full max-w-lg shadow-lg">
        <CardContent className="pt-6">
          <div className="flex justify-center mb-6">
            <Logo size="medium" />
          </div>

          <div className="text-center space-y-6 py-8">
            <div className="inline-flex justify-center items-center w-16 h-16 bg-green-100 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold">
              Dziękujemy za wypełnienie formularza!
            </h1>{" "}
            <div className="space-y-4">
              <p className="text-gray-700">
                Twój raport jest teraz przygotowywany. Wyślemy go na podany
                adres e-mail w ciągu najbliższych 24 godzin.
              </p>

              <p className="text-gray-700">
                Jeśli masz jakiekolwiek pytania lub nie otrzymasz raportu,
                skontaktuj się z nami pod adresem{" "}
                <a
                  href="mailto:kontakt@alimatrix.pl"
                  className="text-blue-600 hover:underline"
                >
                  kontakt@alimatrix.pl
                </a>
                .
              </p>
            </div>
            <SecurityBanner className="mt-6" />
            <div className="pt-6">
              <Link href="/">
                <Button className="w-full">Powrót do strony głównej</Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

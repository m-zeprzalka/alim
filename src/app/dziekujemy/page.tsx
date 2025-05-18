"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/custom/Logo";
import { SecurityBanner } from "@/components/ui/custom/SecurityBanner";
import Link from "next/link";
import { useFormStore } from "@/lib/store/form-store";

export default function ThankYouPage() {
  const { formData, resetForm } = useFormStore();
  const [submissionId, setSubmissionId] = useState<string>("");
  const [copySuccess, setCopySuccess] = useState<boolean>(false);

  // Pobierz ID zgłoszenia z URL lub z formData
  useEffect(() => {
    let id = "";

    // Sprawdź URL
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      id = urlParams.get("id") || "";
    }

    // Jeśli nie ma w URL, sprawdź formData
    if (!id && formData.submissionId) {
      id = formData.submissionId;
    }

    setSubmissionId(id);

    // Resetuj formularz przy wejściu na stronę podziękowania z opóźnieniem
    const timeoutId = setTimeout(() => {
      resetForm();
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [formData, resetForm]);

  // Funkcja do kopiowania ID do schowka
  const copyToClipboard = () => {
    if (submissionId) {
      navigator.clipboard
        .writeText(submissionId)
        .then(() => {
          setCopySuccess(true);
          setTimeout(() => setCopySuccess(false), 2000);
        })
        .catch((err) => {
          console.error("Błąd podczas kopiowania do schowka:", err);
        });
    }
  };

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
              Dziękujemy za wypełnienie formularza!{" "}
            </h1>{" "}
            {submissionId && (
              <div className="bg-blue-50 p-4 rounded-lg my-4">
                <p className="text-sm text-gray-700 font-medium mb-1">
                  ID Twojego zgłoszenia:
                </p>
                <div className="flex items-center gap-2 bg-white p-3 rounded border border-gray-200">
                  <span className="font-mono text-md flex-1">
                    {submissionId}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyToClipboard}
                    className={
                      copySuccess
                        ? "text-green-600 border-green-600"
                        : "text-blue-600"
                    }
                  >
                    {copySuccess ? "Skopiowano!" : "Kopiuj"}
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Zachowaj to ID - może być potrzebne w przypadku kontaktu z
                  nami.
                </p>
              </div>
            )}
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

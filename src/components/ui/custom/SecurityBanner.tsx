"use client";

import { Shield } from "lucide-react";
import Link from "next/link";

type SecurityBannerProps = {
  className?: string;
};

export function SecurityBanner({ className = "" }: SecurityBannerProps) {
  return (
    <div
      className={`bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-800 ${className}`}
    >
      <div className="flex items-center justify-center gap-2 mb-2">
        <Shield className="h-5 w-5 text-blue-500" />
        <p className="font-semibold">Bezpieczeństwo danych</p>
      </div>
      <p className="mb-2">
        Twoje dane są bezpieczne i będą wykorzystane wyłącznie do przygotowania
        raportu. Dane kontaktowe (adres email) i analityczne są przechowywane
        oddzielnie.
      </p>
      <p>
        W każdej chwili możesz zażądać dostępu do swoich danych, ich
        sprostowania lub usunięcia, pisząc na adres{" "}
        <Link
          href="mailto:kontakt@alimatrix.pl"
          className="text-blue-600 hover:underline"
        >
          kontakt@alimatrix.pl
        </Link>
        .
      </p>
    </div>
  );
}

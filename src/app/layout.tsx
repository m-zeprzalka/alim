import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// URL bazowy dla wszystkich względnych linków w metadanych
const baseUrl = "https://alimatrix.pl";

const inter = Inter({
  subsets: ["latin", "latin-ext"], // dodaj latin-ext dla polskich znaków
  weight: ["400", "500", "600", "700"], // dostępne grubości fontu
  display: "swap",
});

export const metadata: Metadata = {
  title: "AliMatrix - Demo",
  description:
    "Aplikacja wspomagająca ustalanie alimentów w Polsce - Wersja Demo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body className={`${inter.className} antialiased bg-sky-50`}>
        <div className="bg-sky-950 text-white py-2 text-center text-sm font-medium">
          ⚠️ Wersja demonstracyjna - AliMatrix ⚠️
        </div>
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-sky-50`}
      >
        <div className="bg-sky-950 text-white py-2 text-center text-sm font-medium">
          ⚠️ Wersja demonstracyjna - AliMatrix ⚠️
        </div>
        {children}
      </body>
    </html>
  );
}

"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, BarChart3, Users, Database } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Panel Administracyjny</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Eksport Excel - Naprawiona wersja */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="bg-green-50">
            <div className="flex items-center justify-between">
              <CardTitle>Eksport Excel (Naprawiona wersja)</CardTitle>
              <FileSpreadsheet className="text-green-600" />
            </div>
            <CardDescription>
              Bezpieczny eksport danych z bazy danych do pliku Excel,
              kompatybilny z aktualną strukturą bazy.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Link href="/admin/export-excel-fixed" passHref>
              <Button className="w-full bg-green-600 hover:bg-green-700">
                Przejdź do eksportu (naprawiony)
              </Button>
            </Link>
          </CardContent>
        </Card>{" "}
        {/* Oryginalny Eksport Excel */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="bg-amber-50">
            <div className="flex items-center justify-between">
              <CardTitle>Eksport Excel (Oryginalna wersja)</CardTitle>
              <FileSpreadsheet className="text-amber-600" />
            </div>
            <CardDescription>
              Oryginalny eksport danych z bazy danych do pliku Excel. Teraz
              naprawiony i kompatybilny z aktualną strukturą bazy.
            </CardDescription>
          </CardHeader>{" "}
          <CardContent className="pt-6 space-y-2">
            <Link href="/api/admin/export-excel" passHref>
              <Button
                variant="outline"
                className="w-full border-amber-600 text-amber-600"
              >
                Pobierz plik Excel (bezpośrednio)
              </Button>
            </Link>
            <Link href="/admin/export-excel-test" passHref>
              <Button className="w-full bg-amber-600 hover:bg-amber-700 mt-2">
                Przejdź do strony testowej eksportu
              </Button>
            </Link>
          </CardContent>
        </Card>
        {/* Statystyki */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="bg-blue-50">
            <div className="flex items-center justify-between">
              <CardTitle>Statystyki</CardTitle>
              <BarChart3 className="text-blue-600" />
            </div>
            <CardDescription>Panel statystyk systemu.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Link href="/admin/stats" passHref>
              <Button
                variant="outline"
                className="w-full border-blue-600 text-blue-600"
              >
                Przejdź do statystyk
              </Button>
            </Link>
          </CardContent>
        </Card>
        {/* Statystyki sądów */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="bg-indigo-50">
            <div className="flex items-center justify-between">
              <CardTitle>Statystyki sądów</CardTitle>
              <Database className="text-indigo-600" />
            </div>
            <CardDescription>
              Statystyki dotyczące danych sądowych.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Link href="/admin/court-stats" passHref>
              <Button
                variant="outline"
                className="w-full border-indigo-600 text-indigo-600"
              >
                Przejdź do statystyk sądów
              </Button>
            </Link>
          </CardContent>
        </Card>
        {/* Subskrypcje */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="bg-purple-50">
            <div className="flex items-center justify-between">
              <CardTitle>Subskrypcje</CardTitle>
              <Users className="text-purple-600" />
            </div>
            <CardDescription>
              Zarządzanie subskrypcjami użytkowników.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Link href="/admin/subscriptions" passHref>
              <Button
                variant="outline"
                className="w-full border-purple-600 text-purple-600"
              >
                Przejdź do subskrypcji
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="mt-10 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h2 className="text-lg font-medium mb-2">O panelu administracyjnym</h2>
        <p className="text-gray-700">
          Ten panel administracyjny służy do zarządzania aplikacją AliMatrix.
          Dostępne są funkcje eksportu danych, przeglądania statystyk oraz
          zarządzania użytkownikami.
        </p>
        <p className="text-gray-700 mt-2">
          <strong>Uwaga:</strong> Dostęp do tych funkcji wymaga uprawnień
          administratora i poprawnego klucza API.
        </p>
      </div>
    </div>
  );
}

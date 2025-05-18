"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type FormSubmissionDetail = {
  id: string;
  rodzajSadu: string;
  apelacja: string;
  sadOkregowy: string;
  rokDecyzji: string;
  watekWiny: string;
  formData: Record<string, unknown>;
};

type CourtStats = {
  total: number;
  bySadType: Record<string, number>;
  byApelacja: Record<string, number>;
  byYear: Record<string, number>;
  byWatek: Record<string, number>;
  detailedData: FormSubmissionDetail[];
};

export default function CourtStatsPage() {
  const [stats, setStats] = useState<CourtStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchStats = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/court-stats", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Błąd pobierania statystyk");
      }

      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError("Wystąpił błąd podczas pobierania statystyk");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Statystyki sądów</h1>
      <div className="mb-4 flex justify-between items-center">
        <p className="text-gray-600">
          Przegląd statystyk dotyczących postępowań sądowych zgłoszonych w
          systemie
        </p>

        <Button onClick={fetchStats} disabled={isLoading}>
          {isLoading ? "Ładowanie..." : "Odśwież dane"}
        </Button>
      </div>
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}{" "}
      {stats && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Podsumowanie</h2>
                <p className="text-4xl font-bold text-blue-600">
                  {stats.total}
                </p>
                <p className="text-gray-500">Łączna liczba zgłoszeń sądowych</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Rodzaje sądów</h2>
                <ul className="space-y-2">
                  {Object.entries(stats.bySadType).map(([type, count]) => (
                    <li key={type} className="flex justify-between">
                      <span>{type || "Nieokreślony"}</span>
                      <span className="font-semibold">{count}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Apelacje</h2>
                <ul className="space-y-2 max-h-48 overflow-y-auto">
                  {Object.entries(stats.byApelacja)
                    .sort((a, b) => b[1] - a[1])
                    .map(([apelacja, count]) => (
                      <li key={apelacja} className="flex justify-between">
                        <span>{apelacja || "Nieokreślona"}</span>
                        <span className="font-semibold">{count}</span>
                      </li>
                    ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Lata decyzji</h2>
                <ul className="space-y-2">
                  {Object.entries(stats.byYear)
                    .sort((a, b) => b[0].localeCompare(a[0]))
                    .map(([year, count]) => (
                      <li key={year} className="flex justify-between">
                        <span>{year || "Nieokreślony"}</span>
                        <span className="font-semibold">{count}</span>
                      </li>
                    ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Wątki winy</h2>
                <ul className="space-y-2">
                  {Object.entries(stats.byWatek)
                    .sort((a, b) => b[1] - a[1])
                    .map(([watek, count]) => (
                      <li key={watek} className="flex justify-between">
                        <span>{watek || "Nieokreślony"}</span>
                        <span className="font-semibold">{count}</span>
                      </li>
                    ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <h2 className="text-2xl font-bold mb-4">Szczegółowe dane zgłoszeń</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-left">ID</th>
                  <th className="border p-2 text-left">Rodzaj sądu</th>
                  <th className="border p-2 text-left">Apelacja</th>
                  <th className="border p-2 text-left">Sąd okręgowy</th>
                  <th className="border p-2 text-left">Rok decyzji</th>
                  <th className="border p-2 text-left">Wątek winy</th>
                </tr>
              </thead>
              <tbody>
                {stats.detailedData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="border p-2">{item.id}</td>
                    <td className="border p-2">{item.rodzajSadu || "-"}</td>
                    <td className="border p-2">{item.apelacja || "-"}</td>
                    <td className="border p-2">{item.sadOkregowy || "-"}</td>
                    <td className="border p-2">{item.rokDecyzji || "-"}</td>
                    <td className="border p-2">{item.watekWiny || "-"}</td>
                  </tr>
                ))}
                {stats.detailedData.length === 0 && (
                  <tr>
                    <td colSpan={6} className="border p-2 text-center">
                      Brak danych
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">
              Pełne dane formularza (pierwsze 3 rekordy)
            </h2>
            {stats.detailedData.slice(0, 3).map((item) => (
              <Card key={item.id} className="mb-4">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-2">ID: {item.id}</h3>
                  <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-xs">
                    {JSON.stringify(item.formData, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

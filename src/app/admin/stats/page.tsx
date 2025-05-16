"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type FormSubmissionDetail = {
  id: string;
  email?: string;
  submittedAt?: string;
  processedAt?: string;
  status?: string;
  reportUrl?: string;
  rodzajSadu?: string;
  apelacja?: string;
  sadOkregowy?: string;
  rokDecyzji?: string;
  watekWiny?: string;
  emailStatus?: string;
  acceptedTerms?: boolean;
  acceptedContact?: boolean;
  formData: Record<string, any>;
};

type CourtStats = {
  total: number;
  bySadType: Record<string, number>;
  byApelacja: Record<string, number>;
  byYear: Record<string, number>;
  byWatek: Record<string, number>;
  byStatus: Record<string, number>;
  byEmailStatus: Record<string, number>;
  byMonth: Record<string, number>;
  detailedData: FormSubmissionDetail[];
};

export default function CourtStatsPage() {
  const [stats, setStats] = useState<CourtStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState("");
  const [apiKey, setApiKey] = useState("");

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
  const exportToExcel = async () => {
    if (!apiKey) {
      setError("Klucz API jest wymagany do eksportu");
      return;
    }

    setIsExporting(true);
    setError("");

    try {
      const response = await fetch("/api/admin/export-excel", {
        headers: {
          "x-api-key": apiKey,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Błąd podczas eksportu");
      }

      // Pobieranie pliku Excel
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "alimatrix-pelne-dane.xlsx";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: any) {
      setError(err.message || "Wystąpił błąd podczas eksportu do Excela");
    } finally {
      setIsExporting(false);
    }
  };
  // Pobranie klucza API z localStorage (tylko po stronie przeglądarki)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedApiKey = localStorage.getItem("alimatrix_admin_api_key") || "";
      setApiKey(savedApiKey);
    }
  }, []);

  // Zapisanie klucza API w localStorage po jego zmianie
  useEffect(() => {
    if (typeof window !== "undefined" && apiKey) {
      localStorage.setItem("alimatrix_admin_api_key", apiKey);
    }
  }, [apiKey]);

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

        <div className="flex gap-2">
          <Button onClick={fetchStats} disabled={isLoading} variant="outline">
            {isLoading ? "Ładowanie..." : "Odśwież dane"}
          </Button>
          <Button
            onClick={exportToExcel}
            disabled={isExporting}
            variant="default"
          >
            {isExporting ? "Eksportowanie..." : "Eksportuj do Excel"}
          </Button>
        </div>
      </div>
      {/* Pole do wprowadzenia klucza API */}
      <div className="mb-4">
        <div className="flex gap-2 items-center">
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Wprowadź klucz API"
            className="border p-2 rounded w-full max-w-md"
          />
          <span className="text-sm text-gray-500">
            Klucz API wymagany do eksportu danych
          </span>
        </div>
      </div>
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}{" "}
      {stats && (
        <>
          {" "}
          {/* Sekcja podsumowania */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Podsumowanie danych</h2>
            <Card>
              <CardContent className="pt-6">
                <p className="text-4xl font-bold text-blue-600">
                  {stats.total}
                </p>
                <p className="text-gray-500">
                  Łączna liczba zgłoszeń w systemie
                </p>
              </CardContent>
            </Card>
          </div>
          {/* Sekcja statystyk sądowych */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Statystyki sądowe</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          </div>
          {/* Sekcja statystyk winy i zgłoszeń */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">
              Statystyki winy i zgłoszeń
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-xl font-semibold mb-4">
                    Status zgłoszeń
                  </h2>
                  <ul className="space-y-2">
                    {Object.entries(stats.byStatus)
                      .sort((a, b) => b[1] - a[1])
                      .map(([status, count]) => (
                        <li key={status} className="flex justify-between">
                          <span>{status || "Nieokreślony"}</span>
                          <span className="font-semibold">{count}</span>
                        </li>
                      ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-xl font-semibold mb-4">
                    Status subskrypcji
                  </h2>
                  <ul className="space-y-2">
                    {Object.entries(stats.byEmailStatus)
                      .sort((a, b) => b[1] - a[1])
                      .map(([status, count]) => (
                        <li key={status} className="flex justify-between">
                          <span>{status || "Nieokreślony"}</span>
                          <span className="font-semibold">{count}</span>
                        </li>
                      ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
          {/* Statystyki czasowe */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Statystyki czasowe</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-xl font-semibold mb-4">
                    Zgłoszenia miesięcznie
                  </h2>
                  <ul className="space-y-2">
                    {Object.entries(stats.byMonth)
                      .sort((a, b) => b[0].localeCompare(a[0]))
                      .map(([month, count]) => (
                        <li key={month} className="flex justify-between">
                          <span>{month}</span>
                          <span className="font-semibold">{count}</span>
                        </li>
                      ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>{" "}
          <h2 className="text-2xl font-bold mb-4">Szczegółowe dane zgłoszeń</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-left">ID</th>
                  <th className="border p-2 text-left">Email</th>
                  <th className="border p-2 text-left">Data złożenia</th>
                  <th className="border p-2 text-left">Status</th>
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
                    <td className="border p-1">{item.id}</td>
                    <td className="border p-1">{item.email || "-"}</td>
                    <td className="border p-1">{item.submittedAt || "-"}</td>
                    <td className="border p-1">
                      <span
                        className={`inline-block px-2 py-1 rounded-full ${
                          item.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : item.status === "processed"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {item.status || "-"}
                      </span>
                    </td>
                    <td className="border p-1">{item.rodzajSadu || "-"}</td>
                    <td className="border p-1">{item.apelacja || "-"}</td>
                    <td className="border p-1">{item.sadOkregowy || "-"}</td>
                    <td className="border p-1">{item.rokDecyzji || "-"}</td>
                    <td className="border p-1">{item.watekWiny || "-"}</td>
                  </tr>
                ))}
                {stats.detailedData.length === 0 && (
                  <tr>
                    <td colSpan={9} className="border p-2 text-center">
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

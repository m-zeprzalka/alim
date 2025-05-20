"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Typy danych
interface Subscription {
  id: string;
  email: string;
  status: string;
  createdAt: string;
  verifiedAt: string | null;
  acceptedTerms: boolean;
}

interface SubscriptionStats {
  totalSubscriptions: number;
  pendingSubscriptions: number;
  verifiedSubscriptions: number;
  subscriptions: Subscription[];
}

export default function AdminSubscriptions() {
  const [apiKey, setApiKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<SubscriptionStats | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const fetchSubscriptions = async () => {
    if (!apiKey) {
      setError("Klucz API jest wymagany");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/subscriptions", {
        headers: {
          "x-api-key": apiKey,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Brak dostępu lub błąd serwera");
      }

      const subscriptionsData = await response.json();
      setData(subscriptionsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Wystąpił nieznany błąd");
    } finally {
      setIsLoading(false);
    }
  };

  const exportToExcel = async () => {
    if (!apiKey) {
      setError("Klucz API jest wymagany");
      return;
    }

    setIsExporting(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/export-excel-fixed", {
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
      a.download = "subskrypcje.xlsx";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Wystąpił nieznany błąd");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <main className="min-h-screen p-6 bg-slate-50">
      <Card className="max-w-6xl mx-auto shadow-lg">
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold mb-6">
            Panel Administracyjny - Subskrypcje
          </h1>

          <div className="flex gap-4 mb-8">
            <Input
              type="password"
              placeholder="Wpisz klucz API"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="max-w-md"
            />
            <Button onClick={fetchSubscriptions} disabled={isLoading}>
              {isLoading ? "Ładowanie..." : "Pobierz dane"}
            </Button>
            <Button
              onClick={exportToExcel}
              disabled={isExporting || isLoading}
              variant="outline"
            >
              {isExporting ? "Eksportowanie..." : "Eksportuj do Excela"}
            </Button>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {data && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <h3 className="text-lg font-medium">Wszystkie</h3>
                    <p className="text-3xl font-bold text-blue-600">
                      {data.totalSubscriptions}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <h3 className="text-lg font-medium">Oczekujące</h3>
                    <p className="text-3xl font-bold text-amber-600">
                      {data.pendingSubscriptions}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <h3 className="text-lg font-medium">Zweryfikowane</h3>
                    <p className="text-3xl font-bold text-green-600">
                      {data.verifiedSubscriptions}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border">
                  <thead className="bg-gray-100">
                    {" "}
                    <tr>
                      <th className="py-2 px-4 border-b text-left">ID</th>
                      <th className="py-2 px-4 border-b text-left">Email</th>
                      <th className="py-2 px-4 border-b text-left">Status</th>
                      <th className="py-2 px-4 border-b text-left">
                        Data utworzenia
                      </th>
                      <th className="py-2 px-4 border-b text-left">
                        Data weryfikacji
                      </th>
                      <th className="py-2 px-4 border-b text-left">Zgoda</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.subscriptions.map((sub) => (
                      <tr key={sub.id}>
                        <td className="py-2 px-4 border-b text-sm">{sub.id}</td>
                        <td className="py-2 px-4 border-b">{sub.email}</td>
                        <td className="py-2 px-4 border-b">
                          <span
                            className={`px-2 py-1 rounded text-sm ${
                              sub.status === "verified"
                                ? "bg-green-100 text-green-800"
                                : sub.status === "pending"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-gray-100"
                            }`}
                          >
                            {sub.status}
                          </span>{" "}
                        </td>
                        <td className="py-2 px-4 border-b text-sm">
                          {new Date(sub.createdAt).toLocaleString()}
                        </td>
                        <td className="py-2 px-4 border-b text-sm">
                          {sub.verifiedAt
                            ? new Date(sub.verifiedAt).toLocaleString()
                            : "-"}
                        </td>
                        <td className="py-2 px-4 border-b text-sm">
                          <span
                            className={`px-2 py-1 rounded text-sm ${
                              sub.acceptedTerms
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {sub.acceptedTerms ? "Tak" : "Nie"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}

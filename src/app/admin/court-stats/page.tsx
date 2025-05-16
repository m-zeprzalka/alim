"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type CourtStats = {
  total: number;
  bySadType: Record<string, number>;
  byApelacja: Record<string, number>;
  byYear: Record<string, number>;
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
      )}

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Podsumowanie</h2>
              <p className="text-4xl font-bold text-blue-600">{stats.total}</p>
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
              <ul className="space-y-2">
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
      )}
    </div>
  );
}

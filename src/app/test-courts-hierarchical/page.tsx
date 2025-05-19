"use client";

import { useState, useEffect } from "react";
import {
  APPELATIONS,
  getRegionalCourts,
  getDistrictCourt,
} from "@/lib/court-data-hierarchical";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function TestCourtsPage() {
  const [apelacjaSad, setApelacjaSad] = useState<string>("");
  const [sadOkregowyId, setSadOkregowyId] = useState<string>("");
  const [sadRejonowyId, setSadRejonowyId] = useState<string>("");
  const [dostepneSadyRejonowe, setDostepneSadyRejonowe] = useState<any[]>([]);

  // Aktualizacja dostępnych sądów rejonowych przy zmianie sądu okręgowego
  useEffect(() => {
    if (sadOkregowyId) {
      const rejonowe = getRegionalCourts(sadOkregowyId);
      setDostepneSadyRejonowe(rejonowe);

      // Resetuj wybór sądu rejonowego, jeśli wybrany wcześniej sąd nie jest dostępny
      if (sadRejonowyId) {
        const istnieje = rejonowe.some((sad) => sad.id === sadRejonowyId);
        if (!istnieje) {
          setSadRejonowyId("");
        }
      }
    } else {
      setDostepneSadyRejonowe([]);
      setSadRejonowyId("");
    }
  }, [sadOkregowyId, sadRejonowyId]);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Test sądów hierarchicznych</h1>

      <div className="space-y-6 w-full max-w-md">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Wybierz apelację
          </label>
          <Select
            value={apelacjaSad}
            onValueChange={(value) => {
              setApelacjaSad(value);
              setSadOkregowyId("");
              setSadRejonowyId("");
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Wybierz apelację" />
            </SelectTrigger>
            <SelectContent>
              {APPELATIONS.map((apelacja) => (
                <SelectItem key={apelacja.id} value={apelacja.id}>
                  {apelacja.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {apelacjaSad && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Wybierz sąd okręgowy
            </label>
            <Select
              value={sadOkregowyId}
              onValueChange={(value) => {
                setSadOkregowyId(value);
                setSadRejonowyId("");
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Wybierz sąd okręgowy" />
              </SelectTrigger>
              <SelectContent>
                {APPELATIONS.find(
                  (a) => a.id === apelacjaSad
                )?.districtCourts.map((sad) => (
                  <SelectItem key={sad.id} value={sad.id}>
                    {sad.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {sadOkregowyId && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Wybierz sąd rejonowy
            </label>
            <Select
              value={sadRejonowyId}
              onValueChange={(value) => {
                setSadRejonowyId(value);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Wybierz sąd rejonowy" />
              </SelectTrigger>
              <SelectContent>
                {dostepneSadyRejonowe.map((sad) => (
                  <SelectItem key={sad.id} value={sad.id}>
                    {sad.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="mt-8 p-4 border rounded bg-gray-50">
          <h2 className="font-semibold mb-2">Wybrane sądy:</h2>
          <p>
            <strong>Apelacja:</strong>{" "}
            {APPELATIONS.find((a) => a.id === apelacjaSad)?.name || "-"}
          </p>
          <p>
            <strong>Sąd Okręgowy:</strong>{" "}
            {getDistrictCourt(apelacjaSad, sadOkregowyId)?.name || "-"}
          </p>
          <p>
            <strong>Sąd Rejonowy:</strong>{" "}
            {dostepneSadyRejonowe.find((s) => s.id === sadRejonowyId)?.name ||
              "-"}
          </p>
        </div>
      </div>
    </div>
  );
}

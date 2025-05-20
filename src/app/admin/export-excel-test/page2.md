"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function TestExportPage() {
  const [apiKey, setApiKey] = useState("tajny_klucz_admin_2025");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleExport = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess(false);

      console.log("Sending request to original export-excel endpoint");

      // Call the original export-excel endpoint with API key
      const response = await fetch("/api/admin/export-excel", {
        method: "GET",
        headers: {
          "x-api-key": apiKey,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Wystąpił błąd podczas eksportu danych"
        );
      }

      // Create blob from response
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);

      // Create link and trigger download
      const a = document.createElement("a");

      // Get filename from Content-Disposition header or use default
      const contentDisposition = response.headers.get("Content-Disposition");
      const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
      const matches = filenameRegex.exec(contentDisposition || "");
      let filename = "alimatrix-export.xlsx";
      if (matches && matches[1]) {
        filename = matches[1].replace(/['"]/g, "");
      } else {
        filename = `alimatrix-export-${new Date()
          .toISOString()
          .slice(0, 10)}.xlsx`;
      }

      a.href = downloadUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(a);

      setSuccess(true);
    } catch (err) {
      console.error("Błąd podczas eksportowania danych:", err);
      setError(err instanceof Error ? err.message : "Wystąpił nieznany błąd");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-10">
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <CardTitle>
            Test eksportu Excel (oryginalna wersja po poprawkach)
          </CardTitle>
          <CardDescription>
            Test poprawionej oryginalnej wersji eksportu danych z bazy danych do
            pliku Excel.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="api-key">Klucz API</Label>
            <Input
              id="api-key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Wprowadź klucz API"
              className="max-w-md"
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="bg-green-50 text-green-800 border-green-200">
              <AlertDescription>
                Plik Excel został wygenerowany i pobrany pomyślnie.
              </AlertDescription>
            </Alert>
          )}

          <Button onClick={handleExport} disabled={loading} className="w-full">
            {loading
              ? "Generowanie pliku..."
              : "Testuj oryginalny eksport Excel"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

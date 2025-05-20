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

export default function ExportExcelFixed() {
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [fileSize, setFileSize] = useState<string | null>(null);

  const handleExport = async () => {
    if (!apiKey) {
      setError("Wprowadź klucz API");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess(false);

      // Zamień na fetch aby pobrać plik
      const response = await fetch("/api/admin/export-excel-fixed", {
        headers: {
          "x-api-key": apiKey,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Wystąpił błąd podczas eksportowania danych"
        );
      } // Pobierz blob i utwórz URL do pobrania
      const blob = await response.blob();
      const blobSizeMB = (blob.size / (1024 * 1024)).toFixed(2); // Convert to MB
      setFileSize(blobSizeMB);
      console.log(`Pobrano plik Excel o rozmiarze ${blobSizeMB} MB`);

      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");

      // Pobierz nazwę pliku z nagłówków odpowiedzi
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
      document.body.removeChild(a); // Add success information with file size
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
          <CardTitle>Eksport danych do Excel (naprawiona wersja)</CardTitle>
          <CardDescription>
            Bezpieczny eksport danych z bazy danych do pliku Excel, z obsługą
            aktualnego schematu bazy danych.
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
          )}{" "}
          {success && (
            <Alert className="bg-green-50 text-green-800 border-green-200">
              <AlertDescription>
                Plik Excel został wygenerowany i pobrany pomyślnie.
                {fileSize && (
                  <div className="mt-2">
                    <strong>Rozmiar pliku:</strong> {fileSize} MB
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}
          <Button onClick={handleExport} disabled={loading} className="w-full">
            {loading ? "Generowanie pliku..." : "Eksportuj dane do Excel"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

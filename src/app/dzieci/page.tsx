"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/ui/custom/Logo";
import { FormProgress } from "@/components/ui/custom/FormProgress";
import { InfoTooltip } from "@/components/ui/custom/InfoTooltip";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useFormStore } from "@/lib/store/form-store";
import { Checkbox } from "@/components/ui/checkbox";
import { PlusCircle, MinusCircle } from "lucide-react";

export default function Dzieci() {
  const router = useRouter();
  const { formData, updateFormData } = useFormStore();

  // Inicjalizacja stanu dla liczby dzieci i ich danych z formStore
  const [liczbaDzieci, setLiczbaDzieci] = useState<number>(
    formData.liczbaDzieci || 1
  );

  const [dzieci, setDzieci] = useState<
    Array<{
      id: number;
      wiek: number | "";
      plec: "K" | "M" | "";
      specjalnePotrzeby: boolean;
      opisSpecjalnychPotrzeb: string;
    }>
  >(
    formData.dzieci?.map((d: any) => ({
      id: d.id,
      wiek: d.wiek,
      plec: d.plec,
      specjalnePotrzeby: d.specjalnePotrzeby,
      opisSpecjalnychPotrzeb: d.opisSpecjalnychPotrzeb || "",
    })) || [
      {
        id: 1,
        wiek: "",
        plec: "",
        specjalnePotrzeby: false,
        opisSpecjalnychPotrzeb: "",
      },
    ]
  );

  const [error, setError] = useState<string | null>(null);

  // Aktualizacja dzieci, gdy zmieni się liczba dzieci
  useEffect(() => {
    // Jeśli brakuje dzieci, dodajemy nowe
    if (dzieci.length < liczbaDzieci) {
      const noweDzieci = [...dzieci];
      for (let i = dzieci.length + 1; i <= liczbaDzieci; i++) {
        noweDzieci.push({
          id: i,
          wiek: "",
          plec: "",
          specjalnePotrzeby: false,
          opisSpecjalnychPotrzeb: "",
        });
      }
      setDzieci(noweDzieci);
    }
    // Jeśli jest za dużo dzieci, usuwamy nadmiarowe
    else if (dzieci.length > liczbaDzieci) {
      setDzieci(dzieci.slice(0, liczbaDzieci));
    }
  }, [liczbaDzieci]);

  // Funkcja do aktualizacji danych dziecka
  const updateDziecko = (index: number, data: Partial<(typeof dzieci)[0]>) => {
    const noweDzieci = [...dzieci];
    noweDzieci[index] = { ...noweDzieci[index], ...data };
    setDzieci(noweDzieci);
  };

  // Funkcja do obsługi przejścia do następnego kroku
  const handleNext = () => {
    // Walidacja danych
    let hasError = false;
    let errorMessage = "";

    dzieci.forEach((dziecko, index) => {
      if (dziecko.wiek === "") {
        hasError = true;
        errorMessage = `Proszę podać wiek dziecka ${index + 1}`;
      }
      if (dziecko.plec === "") {
        hasError = true;
        errorMessage = `Proszę wybrać płeć dziecka ${index + 1}`;
      }
      if (dziecko.specjalnePotrzeby && !dziecko.opisSpecjalnychPotrzeb.trim()) {
        hasError = true;
        errorMessage = `Proszę opisać specjalne potrzeby dziecka ${index + 1}`;
      }
    });

    if (hasError) {
      setError(errorMessage);
      return;
    }

    // Zapisujemy dane do store'a
    const dzieciDoZapisu = dzieci.map((d) => ({
      id: d.id,
      wiek: typeof d.wiek === "number" ? d.wiek : 0,
      plec: d.plec as "K" | "M",
      specjalnePotrzeby: d.specjalnePotrzeby,
      opisSpecjalnychPotrzeb: d.specjalnePotrzeby
        ? d.opisSpecjalnychPotrzeb
        : undefined,
    }));

    updateFormData({
      liczbaDzieci,
      dzieci: dzieciDoZapisu,
    });

    // Przekierowanie do następnego kroku
    router.push("/dochody"); // Zakładam, że następny krok to dochody
  };

  // Funkcja do obsługi powrotu do poprzedniego kroku
  const handleBack = () => {
    router.push("/podstawa-ustalen");
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
      <Card className="w-full max-w-lg shadow-lg">
        <CardContent className="pt-6">
          <div className="flex justify-center mb-6">
            <Logo size="medium" />
          </div>
          <FormProgress currentStep={4} totalSteps={12} />

          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">Dzieci</h1>
              <InfoTooltip
                content={
                  <div className="space-y-2 text-sm">
                    <p>
                      Informacje o dzieciach są kluczowe do ustalenia
                      odpowiedniej wysokości alimentów.
                    </p>
                    <p>
                      Wiek dzieci wpływa na ich potrzeby, a specjalne
                      okoliczności mogą znacząco zwiększyć koszty utrzymania.
                    </p>
                  </div>
                }
              />
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="liczbaDzieci">Liczba dzieci</Label>
                <div className="flex items-center mt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      setLiczbaDzieci(Math.max(1, liczbaDzieci - 1))
                    }
                    className="h-10 w-10"
                  >
                    <MinusCircle className="h-4 w-4" />
                  </Button>
                  <div className="w-12 text-center font-medium">
                    {liczbaDzieci}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      setLiczbaDzieci(Math.min(10, liczbaDzieci + 1))
                    }
                    className="h-10 w-10"
                  >
                    <PlusCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {dzieci.map((dziecko, index) => (
                <div
                  key={dziecko.id}
                  className="p-4 border-2 border-gray-200 rounded-lg"
                >
                  <h3 className="font-medium mb-3">Dziecko {index + 1}</h3>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label htmlFor={`wiek-${dziecko.id}`}>Wiek</Label>
                      <Input
                        id={`wiek-${dziecko.id}`}
                        type="number"
                        min="0"
                        max="26"
                        value={dziecko.wiek}
                        onChange={(e) =>
                          updateDziecko(index, {
                            wiek: e.target.value
                              ? parseInt(e.target.value)
                              : "",
                          })
                        }
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor={`plec-${dziecko.id}`}>Płeć</Label>
                      <select
                        id={`plec-${dziecko.id}`}
                        value={dziecko.plec}
                        onChange={(e) =>
                          updateDziecko(index, {
                            plec: e.target.value as "K" | "M",
                          })
                        }
                        className="flex h-10 w-full mt-1 items-center rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      >
                        <option value="" disabled>
                          Wybierz płeć
                        </option>
                        <option value="K">Dziewczynka</option>
                        <option value="M">Chłopiec</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`specjalne-${dziecko.id}`}
                        checked={dziecko.specjalnePotrzeby}
                        onCheckedChange={(checked) =>
                          updateDziecko(index, {
                            specjalnePotrzeby: !!checked,
                          })
                        }
                      />
                      <Label
                        htmlFor={`specjalne-${dziecko.id}`}
                        className="font-normal cursor-pointer"
                      >
                        Dziecko ma specjalne potrzeby zdrowotne lub edukacyjne
                      </Label>
                    </div>

                    {dziecko.specjalnePotrzeby && (
                      <div>
                        <Label htmlFor={`opis-${dziecko.id}`}>
                          Opisz krótko specjalne potrzeby
                        </Label>
                        <Input
                          id={`opis-${dziecko.id}`}
                          value={dziecko.opisSpecjalnychPotrzeb}
                          onChange={(e) =>
                            updateDziecko(index, {
                              opisSpecjalnychPotrzeb: e.target.value,
                            })
                          }
                          placeholder="np. alergia, niepełnosprawność, zajęcia dodatkowe"
                          className="mt-1"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Wyświetlanie błędu walidacji */}
            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex gap-3 pt-4">
              <Button variant="outline" className="flex-1" onClick={handleBack}>
                Wstecz
              </Button>
              <Button className="flex-1" onClick={handleNext}>
                Dalej
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

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
  
  // Funkcja scrollToTop zaimplementowana bezpośrednio w komponencie
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
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
      modelOpieki: "50/50" | "inny" | "";
    }>
  >(
    formData.dzieci?.map(
      (d: {
        id: number;
        wiek: number;
        plec: "K" | "M";
        specjalnePotrzeby: boolean;
        opisSpecjalnychPotrzeb?: string;
        modelOpieki?: "50/50" | "inny";
      }) => ({
        id: d.id,
        wiek: typeof d.wiek === "number" ? d.wiek : "",
        plec: d.plec,
        specjalnePotrzeby: d.specjalnePotrzeby,
        opisSpecjalnychPotrzeb: d.opisSpecjalnychPotrzeb || "",
        modelOpieki: d.modelOpieki || "",
      })
    ) || [
      {
        id: 1,
        wiek: "",
        plec: "",
        specjalnePotrzeby: false,
        opisSpecjalnychPotrzeb: "",
        modelOpieki: "",
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
          modelOpieki: "",
        });
      }
      setDzieci(noweDzieci);
    }
    // Jeśli jest za dużo dzieci, usuwamy nadmiarowe
    else if (dzieci.length > liczbaDzieci) {
      setDzieci(dzieci.slice(0, liczbaDzieci));
    }
  }, [liczbaDzieci, dzieci]);

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
      if (dziecko.modelOpieki === "") {
        hasError = true;
        errorMessage = `Proszę wybrać model opieki dla dziecka ${index + 1}`;
      }
    });

    if (hasError) {
      setError(errorMessage);
      return;
    } // Zapisujemy dane do store'a
    const dzieciDoZapisu = dzieci.map((d) => ({
      id: d.id,
      wiek: typeof d.wiek === "number" ? d.wiek : 0,
      plec: d.plec as "K" | "M",
      specjalnePotrzeby: d.specjalnePotrzeby,
      opisSpecjalnychPotrzeb: d.specjalnePotrzeby
        ? d.opisSpecjalnychPotrzeb
        : undefined,
      modelOpieki: d.modelOpieki as "50/50" | "inny",
    }));
    updateFormData({ liczbaDzieci, dzieci: dzieciDoZapisu }); // Zawsze zaczynamy od pierwszego dziecka
    const pierwsze_dziecko = dzieciDoZapisu[0];

    // Zapisujemy informację o aktualnie przetwarzanym dziecku
    updateFormData({
      aktualneDzieckoWTabeliCzasu: pierwsze_dziecko.id,
    });

    // Przewijamy stronę do góry przed przejściem do następnej strony
    scrollToTop();

    // Przewijamy stronę do góry przed przejściem do następnej strony
    scrollToTop();

    if (pierwsze_dziecko.modelOpieki === "inny") {
      // Jeśli pierwsze dziecko ma model opieki "inny", przechodzimy do wypełniania tabeli czasu
      router.push("/czas-opieki");
    } else {
      // Jeśli nie ma modelu "inny", przechodzimy od razu do kosztów utrzymania dla pierwszego dziecka
      router.push("/koszty-utrzymania");
    }
  };
  // Funkcja do obsługi powrotu do poprzedniego kroku
  const handleBack = () => {
    // Przewijamy stronę do góry przed przejściem do poprzedniej strony
    scrollToTop();
    router.push("/podstawa-ustalen");
  };

  return (
    <main className="flex justify-center p-3">
      <Card className="w-full max-w-lg shadow-lg border-sky-100">
        <CardContent className="pt-2">
          <Logo size="large" />
          <FormProgress currentStep={5} totalSteps={12} />
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
                  </div>{" "}
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

                    <div className="mt-4">
                      <Label htmlFor={`model-opieki-${dziecko.id}`}>
                        Model opieki nad dzieckiem
                      </Label>
                      <div className="mt-2">
                        <div className="flex flex-col space-y-2">
                          <label className="flex items-center space-x-2 p-3 border rounded-md cursor-pointer hover:bg-slate-50">
                            <input
                              type="radio"
                              name={`model-opieki-${dziecko.id}`}
                              value="50/50"
                              checked={dziecko.modelOpieki === "50/50"}
                              onChange={() =>
                                updateDziecko(index, {
                                  modelOpieki: "50/50",
                                })
                              }
                              className="h-4 w-4 text-blue-600"
                            />
                            <div>
                              <span className="font-medium">Model 50/50</span>
                              <p className="text-sm text-gray-500">
                                Dziecko spędza równy czas pod opieką każdego z
                                rodziców
                              </p>
                            </div>
                          </label>

                          <label className="flex items-center space-x-2 p-3 border rounded-md cursor-pointer hover:bg-slate-50">
                            <input
                              type="radio"
                              name={`model-opieki-${dziecko.id}`}
                              value="inny"
                              checked={dziecko.modelOpieki === "inny"}
                              onChange={() =>
                                updateDziecko(index, {
                                  modelOpieki: "inny",
                                })
                              }
                              className="h-4 w-4 text-blue-600"
                            />
                            <div>
                              <span className="font-medium">Inny model</span>
                              <p className="text-sm text-gray-500">
                                Dziecko spędza różną ilość czasu pod opieką
                                każdego rodzica - wymagane wypełnienie tabeli
                                czasu
                              </p>
                            </div>
                          </label>
                        </div>
                      </div>
                    </div>
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

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

type KosztyDziecka = {
  id: number;
  kwotaAlimentow: number | "";
  twojeMiesieczneWydatki: number | "";
  wydatkiDrugiegoRodzica: number | "";
  kosztyUznanePrzezSad: number | "";
  inneZrodlaUtrzymania: {
    rentaRodzinna: boolean;
    swiadczeniePielegnacyjne: boolean;
    inne: boolean;
    inneOpis: string;
    brakDodatkowychZrodel: boolean;
  };
};

export default function KosztyUtrzymania() {
  const router = useRouter();
  const { formData, updateFormData } = useFormStore();

  // Stan dla aktualnego dziecka i danych kosztów
  const [aktualneDzieckoIndex, setAktualneDzieckoIndex] = useState<number>(0);
  const [kosztyDzieci, setKosztyDzieci] = useState<KosztyDziecka[]>([]);
  const [error, setError] = useState<string | null>(null);
  // Inicjalizacja danych kosztów na podstawie dzieci z formData
  useEffect(() => {
    if (
      formData.dzieci &&
      formData.dzieci.length > 0 &&
      kosztyDzieci.length === 0
    ) {
      const noweKoszty: KosztyDziecka[] = formData.dzieci.map((dziecko) => ({
        id: dziecko.id,
        kwotaAlimentow: "",
        twojeMiesieczneWydatki: "",
        wydatkiDrugiegoRodzica: "",
        kosztyUznanePrzezSad: "",
        inneZrodlaUtrzymania: {
          rentaRodzinna: false,
          swiadczeniePielegnacyjne: false,
          inne: false,
          inneOpis: "",
          brakDodatkowychZrodel: true,
        },
      }));
      setKosztyDzieci(noweKoszty);
    }
  }, [formData.dzieci, kosztyDzieci.length]);

  // Znajdź aktualne dziecko na podstawie ID ustawionego dla tabeli czasu
  useEffect(() => {
    if (
      formData.aktualneDzieckoWTabeliCzasu &&
      formData.dzieci &&
      kosztyDzieci.length > 0
    ) {
      // Znajdź indeks dziecka o danym ID w tablicy dzieci
      const index = formData.dzieci.findIndex(
        (d) => d.id === formData.aktualneDzieckoWTabeliCzasu
      );
      if (index !== -1) {
        setAktualneDzieckoIndex(index);
      }
    }
  }, [
    formData.aktualneDzieckoWTabeliCzasu,
    formData.dzieci,
    kosztyDzieci.length,
  ]);

  // Funkcja do aktualizacji kosztów dla aktualnego dziecka
  const updateKosztyDziecka = (data: Partial<KosztyDziecka>) => {
    setKosztyDzieci((prev) => {
      const updated = [...prev];
      updated[aktualneDzieckoIndex] = {
        ...updated[aktualneDzieckoIndex],
        ...data,
      };
      return updated;
    });
  };

  // Funkcja do aktualizacji innych źródeł utrzymania
  const updateInneZrodla = (
    data: Partial<KosztyDziecka["inneZrodlaUtrzymania"]>
  ) => {
    setKosztyDzieci((prev) => {
      const updated = [...prev];
      updated[aktualneDzieckoIndex] = {
        ...updated[aktualneDzieckoIndex],
        inneZrodlaUtrzymania: {
          ...updated[aktualneDzieckoIndex].inneZrodlaUtrzymania,
          ...data,
        },
      };
      return updated;
    });
  };

  // Obsługa przejścia do następnego dziecka lub kroku
  const handleNext = () => {
    // Walidacja danych
    const aktualneDziecko = kosztyDzieci[aktualneDzieckoIndex];

    // Sprawdzamy, czy kwota alimentów jest podana
    if (aktualneDziecko.kwotaAlimentow === "") {
      setError("Proszę podać kwotę alimentów.");
      return;
    }

    // Sprawdzamy, czy miesięczne wydatki są podane
    if (aktualneDziecko.twojeMiesieczneWydatki === "") {
      setError("Proszę podać swoje miesięczne wydatki na dziecko.");
      return;
    }

    // Sprawdzamy, czy zaznaczono przynajmniej jedno źródło utrzymania
    const inneZrodla = aktualneDziecko.inneZrodlaUtrzymania;
    if (
      !inneZrodla.rentaRodzinna &&
      !inneZrodla.swiadczeniePielegnacyjne &&
      !inneZrodla.inne &&
      !inneZrodla.brakDodatkowychZrodel
    ) {
      setError(
        "Proszę zaznaczyć przynajmniej jedno źródło utrzymania dziecka lub brak dodatkowych źródeł."
      );
      return;
    }

    // Jeśli zaznaczono "inne", sprawdzamy czy podano opis
    if (inneZrodla.inne && !inneZrodla.inneOpis.trim()) {
      setError("Proszę podać jakie inne źródło utrzymania dziecka występuje.");
      return;
    }

    // Resetujemy error
    setError(null);

    // Przygotowujemy dane kosztów do zapisania w store
    // Konwertujemy typ KosztyDziecka[] na format wymagany przez formStore
    const kosztyDoZapisu = kosztyDzieci.map((k) => ({
      id: k.id,
      kwotaAlimentow:
        typeof k.kwotaAlimentow === "number" ? k.kwotaAlimentow : 0,
      twojeMiesieczneWydatki:
        typeof k.twojeMiesieczneWydatki === "number"
          ? k.twojeMiesieczneWydatki
          : 0,
      wydatkiDrugiegoRodzica:
        typeof k.wydatkiDrugiegoRodzica === "number"
          ? k.wydatkiDrugiegoRodzica
          : undefined,
      kosztyUznanePrzezSad:
        typeof k.kosztyUznanePrzezSad === "number"
          ? k.kosztyUznanePrzezSad
          : undefined,
      inneZrodlaUtrzymania: {
        rentaRodzinna: k.inneZrodlaUtrzymania.rentaRodzinna,
        swiadczeniePielegnacyjne:
          k.inneZrodlaUtrzymania.swiadczeniePielegnacyjne,
        inne: k.inneZrodlaUtrzymania.inne,
        inneOpis: k.inneZrodlaUtrzymania.inne
          ? k.inneZrodlaUtrzymania.inneOpis
          : undefined,
        brakDodatkowychZrodel: k.inneZrodlaUtrzymania.brakDodatkowychZrodel,
      },
    })); // Sprawdzamy, czy to ostatnie dziecko
    if (aktualneDzieckoIndex < kosztyDzieci.length - 1) {
      // Zapisujemy wszystkie dane kosztów do store'a
      updateFormData({
        kosztyDzieci: kosztyDoZapisu,
      });

      // Ustawiamy następne dziecko jako aktualne
      const nastepneDziecko = formData.dzieci?.[aktualneDzieckoIndex + 1];
      if (nastepneDziecko) {
        updateFormData({
          aktualneDzieckoWTabeliCzasu: nastepneDziecko.id,
        });

        // Sprawdzamy, czy następne dziecko ma model opieki "inny"
        if (nastepneDziecko.modelOpieki === "inny") {
          // Jeśli tak, przechodzimy do strony czasu opieki dla następnego dziecka
          router.push("/czas-opieki");
        } else {
          // Jeśli nie, zostajemy na tej samej stronie, ale zmieniamy indeks na następne dziecko
          setAktualneDzieckoIndex(aktualneDzieckoIndex + 1);
        }
      }
    } else {
      // To ostatnie dziecko, zapisujemy wszystkie dane kosztów do store'a
      updateFormData({
        kosztyDzieci: kosztyDoZapisu,
      });

      // Przechodzimy do następnego kroku
      router.push("/dochody-i-koszty");
    }
  }; // Obsługa powrotu do poprzedniego dziecka lub kroku
  const handleBack = () => {
    // Zapisz bieżące dane przed cofnięciem
    const kosztyDoZapisu = kosztyDzieci.map((k) => ({
      id: k.id,
      kwotaAlimentow:
        typeof k.kwotaAlimentow === "number" ? k.kwotaAlimentow : 0,
      twojeMiesieczneWydatki:
        typeof k.twojeMiesieczneWydatki === "number"
          ? k.twojeMiesieczneWydatki
          : 0,
      wydatkiDrugiegoRodzica:
        typeof k.wydatkiDrugiegoRodzica === "number"
          ? k.wydatkiDrugiegoRodzica
          : undefined,
      kosztyUznanePrzezSad:
        typeof k.kosztyUznanePrzezSad === "number"
          ? k.kosztyUznanePrzezSad
          : undefined,
      inneZrodlaUtrzymania: {
        rentaRodzinna: k.inneZrodlaUtrzymania.rentaRodzinna,
        swiadczeniePielegnacyjne:
          k.inneZrodlaUtrzymania.swiadczeniePielegnacyjne,
        inne: k.inneZrodlaUtrzymania.inne,
        inneOpis: k.inneZrodlaUtrzymania.inne
          ? k.inneZrodlaUtrzymania.inneOpis
          : undefined,
        brakDodatkowychZrodel: k.inneZrodlaUtrzymania.brakDodatkowychZrodel,
      },
    }));
    updateFormData({
      kosztyDzieci: kosztyDoZapisu,
    });

    // Aktualnie przetwarzane dziecko
    const aktualneDziecko = formData.dzieci?.[aktualneDzieckoIndex];

    // Sprawdzamy czy aktualne dziecko ma model opieki "inny"
    if (aktualneDziecko?.modelOpieki === "inny") {
      // Jeśli tak, wracamy do strony czasu opieki dla tego dziecka
      router.push("/czas-opieki");
    } else if (aktualneDzieckoIndex > 0) {
      // Jeśli nie, a istnieje poprzednie dziecko, cofamy się do niego
      const poprzednieDziecko = formData.dzieci?.[aktualneDzieckoIndex - 1];
      if (poprzednieDziecko) {
        // Ustawiamy poprzednie dziecko jako aktualne
        updateFormData({
          aktualneDzieckoWTabeliCzasu: poprzednieDziecko.id,
        });

        // Sprawdzamy model opieki poprzedniego dziecka
        if (poprzednieDziecko.modelOpieki === "inny") {
          // Jeśli poprzednie dziecko ma model "inny", wracamy do czasu opieki
          router.push("/czas-opieki");
        } else {
          // W przeciwnym razie zostajemy na stronie kosztów, ale zmieniamy indeks
          setAktualneDzieckoIndex(aktualneDzieckoIndex - 1);
        }
      }
    } else {
      // Jeśli to pierwsze dziecko i nie ma modelu "inny", wracamy do strony dzieci
      router.push("/dzieci");
    }
  };

  // Pobierz aktualne dziecko z form store
  const aktualneDziecko = formData.dzieci?.[aktualneDzieckoIndex];
  const aktualneKoszty = kosztyDzieci[aktualneDzieckoIndex];

  if (!aktualneDziecko || !aktualneKoszty) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
        <Card className="w-full max-w-lg shadow-lg">
          <CardContent className="pt-6">
            <div className="flex justify-center mb-6">
              <Logo size="medium" />
            </div>
            <FormProgress currentStep={7} totalSteps={12} />
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">
                  Koszty utrzymania dziecka
                </h1>
                <InfoTooltip
                  content={
                    <div className="space-y-2 text-sm">
                      <p>
                        Informacje o kosztach utrzymania dziecka są kluczowe do
                        ustalenia odpowiedniej wysokości alimentów.
                      </p>
                    </div>
                  }
                />
              </div>
              <p>Trwa ładowanie danych...</p>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
      <Card className="w-full max-w-lg shadow-lg">
        <CardContent className="pt-6">
          <div className="flex justify-center mb-6">
            <Logo size="medium" />
          </div>
          <FormProgress currentStep={7} totalSteps={12} />
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">Koszty utrzymania dziecka</h1>
              <InfoTooltip
                content={
                  <div className="space-y-2 text-sm">
                    <p>
                      Informacje o kosztach utrzymania dziecka są kluczowe do
                      ustalenia odpowiedniej wysokości alimentów.
                    </p>
                  </div>
                }
              />
            </div>{" "}
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="font-medium">
                Wypełniasz dane o kosztach dla Dziecka {aktualneDziecko.id} (
                {aktualneDzieckoIndex + 1}/{formData.dzieci?.length || 0}) -{" "}
                {aktualneDziecko.wiek} lat
              </p>
              <p className="text-sm mt-1">
                Podaj rzeczywiste koszty, które ponosisz na utrzymanie dziecka.
              </p>
            </div>
            <p className="text-gray-700">
              Nie po to, by je oceniać. Pytamy, by lepiej zrozumieć rzeczywiste
              potrzeby dzieci w różnych sytuacjach życiowych – i dać Ci dane,
              które możesz wykorzystać w rozmowach, negocjacjach lub przed
              sądem.
            </p>
            <p className="text-gray-700">
              📌 Jeśli masz wydatki roczne (np. wakacje, sprzęt sportowy),
              podziel je przez 12 i podaj uśrednioną miesięczną kwotę.
            </p>
            <div>
              <Label htmlFor="kwota-alimentow">Kwota alimentów</Label>
              <Input
                id="kwota-alimentow"
                type="number"
                min="0"
                step="0.01"
                value={aktualneKoszty.kwotaAlimentow}
                onChange={(e) =>
                  updateKosztyDziecka({
                    kwotaAlimentow: e.target.value
                      ? parseFloat(e.target.value)
                      : "",
                  })
                }
                className="mt-1"
                placeholder="0"
              />
              <p className="text-sm text-gray-500 mt-1">
                Jaka kwota została ustalona jako alimenty na to dziecko (przez
                sąd lub w porozumieniu)?
              </p>
            </div>
            <div>
              <Label htmlFor="twoje-wydatki">
                Twoje miesięczne wydatki na dziecko
              </Label>
              <Input
                id="twoje-wydatki"
                type="number"
                min="0"
                step="0.01"
                value={aktualneKoszty.twojeMiesieczneWydatki}
                onChange={(e) =>
                  updateKosztyDziecka({
                    twojeMiesieczneWydatki: e.target.value
                      ? parseFloat(e.target.value)
                      : "",
                  })
                }
                className="mt-1"
                placeholder="0"
              />
              <p className="text-sm text-gray-500 mt-1">
                Jaką średnią miesięczną kwotę przeznaczasz na potrzeby dziecka?
              </p>
            </div>
            <div>
              <Label htmlFor="wydatki-drugiego">
                Wydatki drugiego rodzica (jeśli znane)
              </Label>
              <Input
                id="wydatki-drugiego"
                type="number"
                min="0"
                step="0.01"
                value={aktualneKoszty.wydatkiDrugiegoRodzica}
                onChange={(e) =>
                  updateKosztyDziecka({
                    wydatkiDrugiegoRodzica: e.target.value
                      ? parseFloat(e.target.value)
                      : "",
                  })
                }
                className="mt-1"
                placeholder="0"
              />
              <p className="text-sm text-gray-500 mt-1">
                Jaką kwotę miesięcznie przeznacza na dziecko drugi rodzic?
              </p>
            </div>
            <div>
              <Label htmlFor="koszty-sad">
                Koszty uznane przez sąd (jeśli dotyczy)
              </Label>
              <Input
                id="koszty-sad"
                type="number"
                min="0"
                step="0.01"
                value={aktualneKoszty.kosztyUznanePrzezSad}
                onChange={(e) =>
                  updateKosztyDziecka({
                    kosztyUznanePrzezSad: e.target.value
                      ? parseFloat(e.target.value)
                      : "",
                  })
                }
                className="mt-1"
                placeholder="0"
              />
              <p className="text-sm text-gray-500 mt-1">
                Jaką miesięczną kwotę jako koszt utrzymania dziecka wskazał sąd
                w swoim postanowieniu?
              </p>
            </div>
            <div>
              <Label>Inne źródła utrzymania dziecka</Label>
              <div className="space-y-2 mt-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="renta-rodzinna"
                    checked={aktualneKoszty.inneZrodlaUtrzymania.rentaRodzinna}
                    onCheckedChange={(checked) => {
                      const isChecked = checked === true;
                      updateInneZrodla({
                        rentaRodzinna: isChecked,
                        brakDodatkowychZrodel: isChecked
                          ? false
                          : aktualneKoszty.inneZrodlaUtrzymania
                              .brakDodatkowychZrodel,
                      });
                    }}
                  />
                  <Label
                    htmlFor="renta-rodzinna"
                    className="font-normal cursor-pointer"
                  >
                    Renta rodzinna
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="swiadczenie-pielegnacyjne"
                    checked={
                      aktualneKoszty.inneZrodlaUtrzymania
                        .swiadczeniePielegnacyjne
                    }
                    onCheckedChange={(checked) => {
                      const isChecked = checked === true;
                      updateInneZrodla({
                        swiadczeniePielegnacyjne: isChecked,
                        brakDodatkowychZrodel: isChecked
                          ? false
                          : aktualneKoszty.inneZrodlaUtrzymania
                              .brakDodatkowychZrodel,
                      });
                    }}
                  />
                  <Label
                    htmlFor="swiadczenie-pielegnacyjne"
                    className="font-normal cursor-pointer"
                  >
                    Świadczenie pielęgnacyjne
                  </Label>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="inne-zrodla"
                      checked={aktualneKoszty.inneZrodlaUtrzymania.inne}
                      onCheckedChange={(checked) => {
                        const isChecked = checked === true;
                        updateInneZrodla({
                          inne: isChecked,
                          brakDodatkowychZrodel: isChecked
                            ? false
                            : aktualneKoszty.inneZrodlaUtrzymania
                                .brakDodatkowychZrodel,
                        });
                      }}
                    />
                    <Label
                      htmlFor="inne-zrodla"
                      className="font-normal cursor-pointer"
                    >
                      Inne
                    </Label>
                  </div>

                  {aktualneKoszty.inneZrodlaUtrzymania.inne && (
                    <Input
                      value={aktualneKoszty.inneZrodlaUtrzymania.inneOpis}
                      onChange={(e) =>
                        updateInneZrodla({ inneOpis: e.target.value })
                      }
                      placeholder="Proszę podać"
                      className="ml-6"
                    />
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="brak-zrodel"
                    checked={
                      aktualneKoszty.inneZrodlaUtrzymania.brakDodatkowychZrodel
                    }
                    onCheckedChange={(checked) => {
                      const isChecked = checked === true;
                      if (isChecked) {
                        updateInneZrodla({
                          brakDodatkowychZrodel: true,
                          rentaRodzinna: false,
                          swiadczeniePielegnacyjne: false,
                          inne: false,
                          inneOpis: "",
                        });
                      } else {
                        updateInneZrodla({ brakDodatkowychZrodel: false });
                      }
                    }}
                  />
                  <Label
                    htmlFor="brak-zrodel"
                    className="font-normal cursor-pointer"
                  >
                    Brak dodatkowych źródeł
                  </Label>
                </div>
              </div>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}{" "}
            <div className="flex gap-3 pt-4">
              <Button variant="outline" className="flex-1" onClick={handleBack}>
                Wstecz
              </Button>{" "}
              <Button className="flex-1" onClick={handleNext}>
                {aktualneDzieckoIndex < kosztyDzieci.length - 1
                  ? "Przejdź do następnego dziecka"
                  : "Dalej"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

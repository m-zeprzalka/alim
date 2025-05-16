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

export default function CzasOpieki() {
  const router = useRouter();
  const { formData, updateFormData } = useFormStore();

  // Funkcja scrollToTop zaimplementowana bezpośrednio w komponencie
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Inicjalizacja stanu dla aktualnego dziecka i danych tabeli
  // setAktualneDzieckoId będzie używane w późniejszych aktualizacjach
  const [aktualneDzieckoId] = useState<number | null>(
    formData.aktualneDzieckoWTabeliCzasu || null
  );
  const [cyklOpieki, setCyklOpieki] = useState<"1" | "2" | "4" | "custom">("1");
  const [tabelaCzasu, setTabelaCzasu] = useState<{
    [dzien: string]: {
      poranek: number;
      placowkaEdukacyjna: number;
      czasPoEdukacji: number;
      senURodzica: number;
    };
  }>({
    pn: {
      poranek: 0,
      placowkaEdukacyjna: 0,
      czasPoEdukacji: 0,
      senURodzica: 0,
    },
    wt: {
      poranek: 0,
      placowkaEdukacyjna: 0,
      czasPoEdukacji: 0,
      senURodzica: 0,
    },
    sr: {
      poranek: 0,
      placowkaEdukacyjna: 0,
      czasPoEdukacji: 0,
      senURodzica: 0,
    },
    cz: {
      poranek: 0,
      placowkaEdukacyjna: 0,
      czasPoEdukacji: 0,
      senURodzica: 0,
    },
    pt: {
      poranek: 0,
      placowkaEdukacyjna: 0,
      czasPoEdukacji: 0,
      senURodzica: 0,
    },
    sb: {
      poranek: 0,
      placowkaEdukacyjna: 0,
      czasPoEdukacji: 0,
      senURodzica: 0,
    },
    nd: {
      poranek: 0,
      placowkaEdukacyjna: 0,
      czasPoEdukacji: 0,
      senURodzica: 0,
    },
  });
  // Dodany stan dla śledzenia procentowego udziału czasu opieki - domyślnie 0% (100% dla drugiego rodzica)
  const [czasOpiekiProcentowo, setCzasOpiekiProcentowo] = useState<number>(0);

  const [error, setError] = useState<string | null>(null);

  // Funkcja do obliczania procentowego udziału czasu opieki rodzica
  const obliczProcentCzasuOpieki = (tabela: typeof tabelaCzasu) => {
    // Łączna liczba godzin w tygodniu
    const totalGodzinWTygodniu = 7 * 24; // 168 godzin

    // Suma godzin opieki rodzica wypełniającego formularz
    let sumaGodzinOpieki = 0;

    Object.values(tabela).forEach((dzien) => {
      sumaGodzinOpieki +=
        dzien.poranek +
        dzien.placowkaEdukacyjna +
        dzien.czasPoEdukacji +
        dzien.senURodzica;
    });

    // Obliczenie procentu
    const procentRodzica = Math.round(
      (sumaGodzinOpieki / totalGodzinWTygodniu) * 100
    );

    // Aktualizacja stanu
    setCzasOpiekiProcentowo(procentRodzica);
  };

  // Wczytaj dane dziecka i tabeli z store'a, jeśli istnieją
  useEffect(() => {
    if (formData.dzieci && aktualneDzieckoId) {
      const dziecko = formData.dzieci.find((d) => d.id === aktualneDzieckoId);
      if (dziecko && dziecko.cyklOpieki) {
        setCyklOpieki(dziecko.cyklOpieki);
      }
      if (dziecko && dziecko.tabelaCzasu) {
        setTabelaCzasu(dziecko.tabelaCzasu);
        // Oblicz procent czasu opieki na podstawie wczytanej tabeli
        obliczProcentCzasuOpieki(dziecko.tabelaCzasu);
      }
      // Jeśli dziecko ma już zapisany procent czasu opieki, użyj go
      if (dziecko && dziecko.procentCzasuOpieki !== undefined) {
        setCzasOpiekiProcentowo(dziecko.procentCzasuOpieki);
      }
    }
  }, [formData.dzieci, aktualneDzieckoId]);

  // Znajdź wszystkie dzieci z modelem opieki "inny"
  const dzieciZModelemInnym =
    formData.dzieci?.filter((d) => d.modelOpieki === "inny") || [];

  // Znajdź aktualne dziecko
  const aktualneDziecko = formData.dzieci?.find(
    (d) => d.id === aktualneDzieckoId
  );

  // Funkcja do aktualizacji danych w tabeli czasu
  const updateTabelaCzasu = (
    dzien: string,
    kategoria: string,
    wartosc: number
  ) => {
    setTabelaCzasu((prev) => {
      const newTabelaCzasu = {
        ...prev,
        [dzien]: {
          ...prev[dzien],
          [kategoria]: wartosc,
        },
      };

      // Po aktualizacji tabeli, oblicz procentowy udział czasu opieki
      obliczProcentCzasuOpieki(newTabelaCzasu);

      return newTabelaCzasu;
    });
  };

  // Funkcja do obsługi zmiany cyklu opieki
  const handleCyklOpiekiChange = (value: string) => {
    setCyklOpieki(value as "1" | "2" | "4" | "custom");
  };

  // Funkcja do zapisania danych i przejścia do następnego dziecka lub następnego kroku
  const handleNext = () => {
    // Walidacja danych
    let hasError = false;
    let errorMessage = "";

    // Sprawdzamy czy suma godzin w każdym dniu nie przekracza 24
    Object.entries(tabelaCzasu).forEach(([dzien, dane]) => {
      const suma =
        dane.poranek +
        dane.placowkaEdukacyjna +
        dane.czasPoEdukacji +
        dane.senURodzica;
      if (suma > 24) {
        hasError = true;
        errorMessage = `Suma godzin dla ${getDzienNazwa(
          dzien
        )} przekracza 24 godziny.`;
      }
    });

    if (hasError) {
      setError(errorMessage);
      return;
    }

    // Zapisujemy dane do store'a - teraz tylko procentowy udział czasu opieki zamiast całej tabeli
    if (aktualneDzieckoId && formData.dzieci) {
      const zaktualizowaneDzieci = formData.dzieci.map((dziecko) => {
        if (dziecko.id === aktualneDzieckoId) {
          return {
            ...dziecko,
            cyklOpieki,
            procentCzasuOpieki: czasOpiekiProcentowo, // Zapisanie tylko wartości procentowej
            tabelaCzasu, // Opcjonalnie możemy zachować tabelę dla referencji, ale w API będziemy wysyłać tylko procent
          };
        }
        return dziecko;
      });
      updateFormData({
        dzieci: zaktualizowaneDzieci,
      });

      // Przewijamy stronę do góry przed przejściem do następnej strony
      scrollToTop();

      // Nowa logika - po wypełnieniu czasu opieki, przechodzimy do kosztów utrzymania dla tego samego dziecka
      router.push("/koszty-utrzymania");
    }
  };

  // Funkcja do obsługi powrotu do poprzedniego kroku
  const handleBack = () => {
    // Zapisujemy aktualne dane dziecka
    if (aktualneDzieckoId && formData.dzieci) {
      const zaktualizowaneDzieci = formData.dzieci.map((dziecko) => {
        if (dziecko.id === aktualneDzieckoId) {
          return {
            ...dziecko,
            cyklOpieki,
            procentCzasuOpieki: czasOpiekiProcentowo,
            tabelaCzasu,
          };
        }
        return dziecko;
      });
      updateFormData({
        dzieci: zaktualizowaneDzieci,
      });
    }

    // Przewijamy stronę do góry przed przejściem do poprzedniej strony
    scrollToTop();

    // Wracamy do strony dzieci
    router.push("/dzieci");
  };

  // Pomocnicza funkcja do konwersji kodu dnia na pełną nazwę
  const getDzienNazwa = (dzien: string) => {
    const nazwy: { [key: string]: string } = {
      pn: "Poniedziałek",
      wt: "Wtorek",
      sr: "Środa",
      cz: "Czwartek",
      pt: "Piątek",
      sb: "Sobota",
      nd: "Niedziela",
    };
    return nazwy[dzien] || dzien;
  };

  // Jeśli nie ma dzieci z modelem "inny", przekieruj od razu do kosztów utrzymania
  useEffect(() => {
    if (
      dzieciZModelemInnym.length === 0 &&
      formData.dzieci &&
      formData.dzieci.length > 0
    ) {
      router.push("/koszty-utrzymania");
    }
  }, [dzieciZModelemInnym.length, formData.dzieci, router]);

  // Tabela dni tygodnia - zaczynamy od piątku zgodnie z wytycznymi klienta
  const dniTygodnia = ["pt", "sb", "nd", "pn", "wt", "sr", "cz"];
  const dniTygodniaPelne = [
    "Piątek",
    "Sobota",
    "Niedziela",
    "Poniedziałek",
    "Wtorek",
    "Środa",
    "Czwartek",
  ];

  // Kategorie czasu
  const kategorieTabeli = [
    {
      id: "poranek",
      nazwa: "Poranek",
      tooltip:
        "Godziny, w których rodzic ma opiekę nad dzieckiem rano (np. od momentu wstania do wyjścia z domu).",
    },
    {
      id: "placowkaEdukacyjna",
      nazwa: "Placówka edukacyjna",
      tooltip:
        "Czas, który dziecko spędza w placówce edukacyjnej (np. szkoła, przedszkole, żłobek).",
    },
    {
      id: "czasPoEdukacji",
      nazwa: "Czas po edukacji",
      tooltip:
        "Czas spędzany z dzieckiem po powrocie z placówki edukacyjnej (np. zabawa, zajęcia w domu).",
    },
    {
      id: "senURodzica",
      nazwa: "Sen u Ciebie",
      tooltip:
        "Czas, który dziecko spędza na spaniu, gdy jest pod Twoją opieką.",
    },
  ];

  if (!aktualneDziecko) {
    return (
      <main className="flex justify-center p-3">
        <Card className="w-full max-w-lg shadow-lg border-sky-100">
          <CardContent className="pt-2">
            <Logo size="large" />
            <FormProgress currentStep={6} totalSteps={12} />
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">Czas opieki</h1>
                <InfoTooltip
                  content={
                    <div className="space-y-2 text-sm">
                      <p>
                        Dane o czasie opieki są niezbędne do dokładnego
                        obliczenia alimentów.
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
    <main className="flex justify-center p-3">
      <Card className="w-full max-w-lg shadow-lg border-sky-100">
        <CardContent className="pt-2">
          <Logo size="large" />
          <FormProgress currentStep={6} totalSteps={12} />
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">Czas opieki</h1>
              <InfoTooltip
                content={
                  <div className="space-y-2 text-sm">
                    <p>
                      Dane o czasie opieki są niezbędne do dokładnego obliczenia
                      alimentów.
                    </p>
                  </div>
                }
              />
            </div>{" "}
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="font-medium">
                Wypełniasz tabelę czasu opieki dla Dziecka {aktualneDziecko.id}{" "}
                (
                {aktualneDzieckoId &&
                  formData.dzieci &&
                  formData.dzieci.findIndex((d) => d.id === aktualneDzieckoId) +
                    1}
                /{formData.dzieci?.length || 0}) - {aktualneDziecko.wiek} lat
              </p>
              <p className="text-sm mt-1">
                Ta część może zająć chwilę, ale jest ważna dla dokładnej analizy
                czasu spędzanego z dzieckiem.
              </p>
            </div>
            <div className="bg-amber-50 p-4 rounded-lg">
              <p className="text-sm font-semibold">📌 Uwaga techniczna:</p>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>Wypełniasz tylko czas, kiedy dziecko jest z Tobą.</li>
                <li>Sen przypisujemy do dnia, w którym dziecko zasnęło.</li>
                <li>
                  Jeśli dziecko chodzi do szkoły lub przedszkola, podaj liczbę
                  godzin w placówce.
                </li>
                <li>
                  Pozostałe godziny formularz przypisze automatycznie drugiemu
                  rodzicowi.
                </li>
              </ul>
            </div>
            <div>
              <Label htmlFor="care-cycle">Cykl opieki</Label>
              <select
                id="care-cycle"
                value={cyklOpieki}
                onChange={(e) => handleCyklOpiekiChange(e.target.value)}
                className="mt-1 w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="1">Co tydzień</option>
                <option value="2">Co 2 tygodnie</option>
                <option value="4">Co 4 tygodnie (np. układ miesięczny)</option>
                <option value="custom">
                  Brak stałego schematu – uśrednimy dane do 4-tygodniowego cyklu
                </option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Jeśli wybierzesz &quot;Brak stałego schematu&quot;, podaj dane
                dla przykładowych 4 tygodni, żeby ustandaryzować analizę.
              </p>
            </div>
            {/* Wizualizacja procentowego podziału czasu opieki */}
            <div className="mt-6 p-4 rounded-lg bg-blue-50">
              <h3 className="font-medium mb-3">Podział czasu opieki</h3>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Ty</span>
                <span className="text-sm font-medium">Drugi rodzic</span>
              </div>

              <div className="relative h-8 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-sky-600 transition-all duration-500"
                  style={{ width: `${czasOpiekiProcentowo}%` }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center text-sm font-medium">
                  {czasOpiekiProcentowo}% / {100 - czasOpiekiProcentowo}%
                </div>
              </div>

              <p className="text-xs text-gray-500 mt-2">
                Powyższe wartości pokazują procentowy podział czasu opieki
                między rodzicami na podstawie wypełnionej tabeli.
              </p>
            </div>
            {/* Jednolita responsywna tabela czasu opieki */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-2 text-left border">Czas</th>
                    {dniTygodnia.map((dzien, index) => (
                      <th key={dzien} className="p-2 text-center border">
                        <span className="hidden sm:inline">
                          {dniTygodniaPelne[index]}
                        </span>
                        <span className="sm:hidden">{dzien.toUpperCase()}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {kategorieTabeli.map((kategoria) => (
                    <tr key={kategoria.id} className="border-b">
                      <td className="p-2 border">
                        <div className="flex items-center gap-1">
                          {kategoria.nazwa}
                          <InfoTooltip content={kategoria.tooltip} />
                        </div>
                      </td>
                      {dniTygodnia.map((dzien) => (
                        <td key={dzien} className="p-2 text-center border">
                          <Input
                            type="number"
                            min="0"
                            max="24"
                            value={
                              tabelaCzasu[dzien]?.[
                                kategoria.id as keyof (typeof tabelaCzasu)[typeof dzien]
                              ] || ""
                            }
                            onChange={(e) =>
                              updateTabelaCzasu(
                                dzien,
                                kategoria.id,
                                parseInt(e.target.value) || 0
                              )
                            }
                            className="w-16 h-10 text-center mx-auto"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="flex gap-3 pt-4">
              <Button variant="outline" className="flex-1" onClick={handleBack}>
                Wstecz
              </Button>{" "}
              <Button className="flex-1" onClick={handleNext}>
                Przejdź do kosztów utrzymania
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

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
import { Dziecko, TabelaCzasu, WskaznikiCzasuOpieki } from "./typings";

export default function CzasOpieki() {
  const router = useRouter();
  const { formData, updateFormData } = useFormStore();

  // Utility function to safely get the current child index
  const getSafeChildIndex = () => {
    return typeof formData.currentChildIndex !== "undefined"
      ? formData.currentChildIndex
      : 0;
  };

  // Utility function to safely get the active child ID
  const getSafeChildId = () => {
    const childId = formData.aktualneDzieckoWTabeliCzasu;

    if (typeof childId !== "undefined") return childId;

    // Fallback - use child ID at the current index
    const currentIndex = getSafeChildIndex();
    return formData.dzieci?.[currentIndex]?.id;
  };

  // Style CSS dla ukrycia strzałek w polach numerycznych w tabeli
  const hideSpinnersStyle = `
    .czas-opieki-input::-webkit-inner-spin-button,
    .czas-opieki-input::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    .czas-opieki-input[type=number] {
      -moz-appearance: textfield;
    }
  `;

  // Funkcja scrollToTop zaimplementowana bezpośrednio w komponencie
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  // Inicjalizacja stanu dla aktualnego dziecka i danych tabeli
  // setAktualneDzieckoId będzie używane w późniejszych aktualizacjach
  const [aktualneDzieckoId] = useState<number | undefined>(getSafeChildId());
  const [cyklOpieki, setCyklOpieki] = useState<"1" | "2" | "4" | "custom">("1");
  const [tabelaCzasu, setTabelaCzasu] = useState<{
    [dzien: string]: {
      poranek: number;
      placowkaEdukacyjna: number;
      czasPoEdukacji: number;
      senURodzica: number;
      senUDrugiegoRodzica: number;
    };
  }>({
    pn: {
      poranek: 0,
      placowkaEdukacyjna: 0,
      czasPoEdukacji: 0,
      senURodzica: 0,
      senUDrugiegoRodzica: 0,
    },
    wt: {
      poranek: 0,
      placowkaEdukacyjna: 0,
      czasPoEdukacji: 0,
      senURodzica: 0,
      senUDrugiegoRodzica: 0,
    },
    sr: {
      poranek: 0,
      placowkaEdukacyjna: 0,
      czasPoEdukacji: 0,
      senURodzica: 0,
      senUDrugiegoRodzica: 0,
    },
    cz: {
      poranek: 0,
      placowkaEdukacyjna: 0,
      czasPoEdukacji: 0,
      senURodzica: 0,
      senUDrugiegoRodzica: 0,
    },
    pt: {
      poranek: 0,
      placowkaEdukacyjna: 0,
      czasPoEdukacji: 0,
      senURodzica: 0,
      senUDrugiegoRodzica: 0,
    },
    sb: {
      poranek: 0,
      placowkaEdukacyjna: 0,
      czasPoEdukacji: 0,
      senURodzica: 0,
      senUDrugiegoRodzica: 0,
    },
    nd: {
      poranek: 0,
      placowkaEdukacyjna: 0,
      czasPoEdukacji: 0,
      senURodzica: 0,
      senUDrugiegoRodzica: 0,
    },
  }); // Stany dla trzech wskaźników procentowych
  const [czasOpiekiBezEdukacji, setCzasOpiekiBezEdukacji] = useState<number>(0);
  const [czasAktywnejOpieki, setCzasAktywnejOpieki] = useState<number>(0);
  const [czasSnu, setCzasSnu] = useState<number>(0);

  const [error, setError] = useState<string | null>(null);
  // Funkcja do obliczania wskaźników procentowych podziału czasu opieki
  const obliczWskaznikiCzasuOpieki = (
    tabela: TabelaCzasu
  ): WskaznikiCzasuOpieki => {
    // Stałe - łączna liczba godzin w tygodniu
    const totalGodzinWTygodniu = 7 * 24; // 168 godzin

    // Zmienne do obliczania wskaźników
    let sumaGodzinOpieki = 0;
    let sumaGodzinPlacowki = 0;
    let sumaGodzinSnu = 0;
    let sumaGodzinSnuDrugiegoRodzica = 0;

    // Sumowanie godzin z tabeli
    Object.values(tabela).forEach((dzien) => {
      // Suma godzin opieki bez placówki
      sumaGodzinOpieki +=
        dzien.poranek + dzien.czasPoEdukacji + dzien.senURodzica;

      // Suma godzin w placówce edukacyjnej
      sumaGodzinPlacowki += dzien.placowkaEdukacyjna || 0;

      // Suma godzin snu u wypełniającego rodzica
      sumaGodzinSnu += dzien.senURodzica || 0;

      // Suma godzin snu u drugiego rodzica
      sumaGodzinSnuDrugiegoRodzica += dzien.senUDrugiegoRodzica || 0;
    });

    // 1. Łączny czas opieki (bez placówki edukacyjnej)
    const totalCzasBezPlacowki = Math.max(
      1,
      totalGodzinWTygodniu - sumaGodzinPlacowki
    );
    const wskaznikCzasuBezEdukacji = Math.round(
      (sumaGodzinOpieki / totalCzasBezPlacowki) * 100
    );

    // 2. Czas aktywnej opieki (bez placówki i bez snu)
    const totalCzasAktywny = Math.max(
      1,
      totalCzasBezPlacowki - sumaGodzinSnu - sumaGodzinSnuDrugiegoRodzica
    );
    const wskaznikAktywnejOpieki = Math.round(
      ((sumaGodzinOpieki - sumaGodzinSnu) / totalCzasAktywny) * 100
    );

    // 3. Czas nocnego snu pod opieką (procentowo)
    const totalCzasSnu = sumaGodzinSnu + sumaGodzinSnuDrugiegoRodzica;
    const wskaznikSnu =
      totalCzasSnu > 0 ? Math.round((sumaGodzinSnu / totalCzasSnu) * 100) : 0;

    // Aktualizacja stanów
    setCzasOpiekiBezEdukacji(wskaznikCzasuBezEdukacji);
    setCzasAktywnejOpieki(wskaznikAktywnejOpieki);
    setCzasSnu(wskaznikSnu);

    // Zwróć obliczone wskaźniki
    return {
      czasOpiekiBezEdukacji: wskaznikCzasuBezEdukacji,
      czasAktywnejOpieki: wskaznikAktywnejOpieki,
      czasSnu: wskaznikSnu,
    };
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
        // Oblicz wskaźniki czasu opieki na podstawie wczytanej tabeli
        obliczWskaznikiCzasuOpieki(dziecko.tabelaCzasu);
      }
      // Jeśli dziecko ma już zapisane wskaźniki czasu opieki, użyj ich      // Sprawdź czy istnieją zapisane wskaźniki czasu opieki
      if (
        dziecko &&
        "wskaznikiCzasuOpieki" in dziecko &&
        dziecko.wskaznikiCzasuOpieki
      ) {
        const wskazniki = dziecko.wskaznikiCzasuOpieki as {
          czasOpiekiBezEdukacji?: number;
          czasAktywnejOpieki?: number;
          czasSnu?: number;
        };

        if (wskazniki.czasOpiekiBezEdukacji !== undefined) {
          setCzasOpiekiBezEdukacji(wskazniki.czasOpiekiBezEdukacji);
        }
        if (wskazniki.czasAktywnejOpieki !== undefined) {
          setCzasAktywnejOpieki(wskazniki.czasAktywnejOpieki);
        }
        if (wskazniki.czasSnu !== undefined) {
          setCzasSnu(wskazniki.czasSnu);
        }
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

      // Po aktualizacji tabeli, oblicz wskaźniki czasu opieki
      const wskazniki = obliczWskaznikiCzasuOpieki(newTabelaCzasu);

      // Weryfikacja sum godzin dziennych - nie może przekraczać 24h
      const suma = Object.values(newTabelaCzasu[dzien]).reduce(
        (acc, val) => acc + (val || 0),
        0
      );

      if (suma > 24) {
        setError(
          `Suma godzin dla ${getDzienNazwa(dzien)} przekracza 24 godziny.`
        );
      } else {
        setError(null);
      }

      return newTabelaCzasu;
    });
  };

  // Funkcja do obsługi zmiany cyklu opieki
  const handleCyklOpiekiChange = (value: string) => {
    setCyklOpieki(value as "1" | "2" | "4" | "custom");
  }; // Funkcja do zapisania danych i przejścia do następnego dziecka lub następnego kroku
  const handleNext = () => {
    // Walidacja danych
    let hasError = false;
    let errorMessage = "";

    // Sprawdzamy czy suma godzin w każdym dniu nie przekracza 24
    Object.entries(tabelaCzasu).forEach(([dzien, dane]) => {
      const suma = Object.values(dane).reduce(
        (acc, val) => acc + (val || 0),
        0
      );
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

    // Obliczamy aktualne wskaźniki przed zapisaniem
    const wskaznikiDoZapisu = {
      czasOpiekiBezEdukacji: czasOpiekiBezEdukacji,
      czasAktywnejOpieki: czasAktywnejOpieki,
      czasSnu: czasSnu,
    };

    console.log("Zapisuję wskaźniki czasu opieki:", wskaznikiDoZapisu);

    // Zapisujemy dane do store'a - teraz zapisujemy trzy wskaźniki procentowe
    if (aktualneDzieckoId && formData.dzieci) {
      const zaktualizowaneDzieci = formData.dzieci.map((dziecko) => {
        if (dziecko.id === aktualneDzieckoId) {
          return {
            ...dziecko,
            cyklOpieki,
            wskaznikiCzasuOpieki: wskaznikiDoZapisu,
            tabelaCzasu, // Zachowanie tabeli dla referencji
          };
        }
        return dziecko;
      }); // Aktualizujemy dziecko i przechodzimy do następnej strony
      const currentChildIndex = getSafeChildIndex();
      updateFormData({
        dzieci: zaktualizowaneDzieci,
        // Zapisujemy aktualne dziecko w module opieki wakacje
        aktualneDzieckoWOpiece: getSafeChildId(),
        // Zachowujemy indeks aktualnego dziecka w cyklu
        currentChildIndex: currentChildIndex,
        activeChildId: getSafeChildId(),
      });

      // Przewijamy stronę do góry przed przejściem do następnej strony
      scrollToTop();

      // Jeśli model opieki to "inny", przechodzimy do strony opieki w okresach specjalnych
      router.push("/opieka-wakacje");
    }
  }; // Funkcja do obsługi powrotu do poprzedniego kroku
  const handleBack = () => {
    // Zapisujemy aktualne wskaźniki
    const wskaznikiDoZapisu = {
      czasOpiekiBezEdukacji: czasOpiekiBezEdukacji,
      czasAktywnejOpieki: czasAktywnejOpieki,
      czasSnu: czasSnu,
    }; // Zapisujemy aktualne dane dziecka
    if (aktualneDzieckoId && formData.dzieci) {
      const currentChildIndex = getSafeChildIndex();

      const zaktualizowaneDzieci = formData.dzieci.map((dziecko) => {
        if (dziecko.id === aktualneDzieckoId) {
          return {
            ...dziecko,
            cyklOpieki,
            wskaznikiCzasuOpieki: wskaznikiDoZapisu,
            tabelaCzasu,
          };
        }
        return dziecko;
      }); // Aktualizujemy dane z zachowaniem informacji o aktualnym dziecku
      updateFormData({
        dzieci: zaktualizowaneDzieci,
        currentChildIndex: currentChildIndex,
        activeChildId: getSafeChildId(),
      });
    }

    // Przewijamy stronę do góry przed przejściem do poprzedniej strony
    scrollToTop();

    // Wracamy do strony dzieci z zachowaniem aktualnego indeksu dziecka
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
  ]; // Kategorie czasu
  const kategorieTabeli = [
    {
      id: "poranek",
      nazwa: <span>Poranek</span>,
      tooltip:
        "Godziny, w których rodzic ma opiekę nad dzieckiem rano (np. od momentu wstania do wyjścia z domu).",
    },
    {
      id: "placowkaEdukacyjna",
      nazwa: (
        <span>
          Placówka
          <br />
          edukacyjna
        </span>
      ),
      tooltip:
        "Czas, który dziecko spędza w placówce edukacyjnej (np. szkoła, przedszkole, żłobek).",
    },
    {
      id: "czasPoEdukacji",
      nazwa: (
        <span>
          Czas po
          <br />
          edukacji
        </span>
      ),
      tooltip:
        "Czas spędzany z dzieckiem po powrocie z placówki edukacyjnej (np. zabawa, zajęcia w domu).",
    },
    {
      id: "senURodzica",
      nazwa: (
        <span>
          Sen u<br />
          Ciebie
        </span>
      ),
      tooltip:
        "Czas, który dziecko spędza na spaniu, gdy jest pod Twoją opieką.",
    },
    {
      id: "senUDrugiegoRodzica",
      nazwa: (
        <span>
          Sen u<br />
          drugiego
          <br />
          rodzica
        </span>
      ),
      tooltip:
        "Szacunkowe godziny, które dziecko spędza na spaniu, gdy jest pod opieką drugiego rodzica.",
    },
  ];

  if (!aktualneDziecko) {
    return (
      <main className="flex justify-center p-3">
        <Card className="w-full max-w-lg shadow-lg border-sky-100">
          <CardContent className="pt-2">
            <Logo size="large" />
            <FormProgress currentStep={5} totalSteps={12} />
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
              <h1 className="text-2xl font-bold">Tabela czasu opieki</h1>
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
                Określ dokładnie, jak wygląda rozkład czasu spędzanego z
                dzieckiem w typowym tygodniu.
              </p>
              <div className="flex items-center gap-2 mt-2">
                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                <p className="text-xs font-medium">
                  Krok 2/4: Czas opieki w tygodniu
                </p>
              </div>
            </div>
            <div>
              <p>Zanim zaczniesz: kilka słów od nas</p>
              <p>
                Ta część może zająć chwilę – ale każda minuta ma znaczenie. Nie
                tylko dostarczasz danych do raportu. Masz też okazję uważnie
                przyjrzeć się swojej codzienności – temu, ile realnie czasu
                spędzasz z dzieckiem i jak wygląda Wasz rytm tygodnia
                spostrzeżenia.
              </p>
              <p>To często moment refleksji – i bardzo często przynosi ważne</p>
              <p className="text-sm">
                Wypełnienie tabeli zajmie około 10-15 minut. Pamiętaj, że zawsze
                możesz wrócić do poprzednich sekcji i skorygować swoje
                odpowiedzi.
              </p>
            </div>
            <div className="bg-amber-50 p-4 rounded-lg">
              <p className="text-sm font-semibold">
                🧠 To może być moment refleksji – i bardzo często jest.
              </p>
              <p className="text-sm font-semibold">
                Uwaga techniczna – jak wypełniać
              </p>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>
                  Wpisujesz tylko godziny, kiedy:{" "}
                  <ol>
                    <li>dziecko jest z Tobą</li>
                    <li>przebywa w placówce edukacyjnej</li>
                    <li>śpi u Ciebie lub u drugiego rodzica</li>
                  </ol>
                </li>
                <li>
                  Cały czas snu przypisujemy do dnia, w którym dziecko zasnęło.
                </li>
                <li>
                  Jeśli dziecko uczęszcza do żłobka, przedszkola lub szkoły –
                  wpisz liczbę godzin spędzonych w placówce.
                </li>
                <li>
                  Pozostałe godziny formularz automatycznie przypisze drugiemu
                  rodzicowi – na podstawie tego, co Ty wpiszesz.
                </li>
              </ul>
            </div>
            <div>
              <Label htmlFor="care-cycle">
                🔄 Cykl opieki – jak często powtarza się Wasz układ?
              </Label>
              <p>
                Wskaż, w jakim rytmie powtarza się Wasz podział opieki nad
                dzieckiem. To ważne, by system mógł dokładnie obliczyć, jak
                wygląda proporcja czasu spędzanego z każdym z rodziców.
              </p>
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
            </div>{" "}
            {/* Jednolita responsywna tabela czasu opieki zostanie tutaj */}
            {/* Jednolita responsywna tabela czasu opieki */}{" "}
            <div className="overflow-x-auto relative">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-2 text-left border sticky left-0 z-10 bg-gray-50">
                      Czas
                    </th>
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
                      <td className="p-2 border sticky left-0 bg-white z-10">
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
                            className="w-10 h-10 text-center mx-auto czas-opieki-input min-w-[60px]"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {/* Podsumowanie podziału czasu opieki */}
            <div className="mt-8 p-4 rounded-lg bg-blue-50">
              <h3 className="text-lg font-semibold mb-3">
                📊 Podsumowanie podziału standardowego czasu opieki nad
                dzieckiem
              </h3>
              <p className="text-sm mb-4">
                Poniżej przedstawiamy, jak – na podstawie wypełnionych danych –
                kształtuje się udział Twojego czasu opiekuńczego w analizowanym
                okresie.
              </p>

              {/* Wskaźnik 1 - Łączny czas opieki */}
              <div className="mb-4">
                <h4 className="font-medium">
                  🔹 1. Łączny czas opieki (bez placówki edukacyjnej):
                </h4>
                <div className="flex items-center mt-1">
                  <div className="relative h-6 bg-gray-200 rounded-full overflow-hidden flex-1 mr-2">
                    <div
                      className="absolute top-0 left-0 h-full bg-sky-600 transition-all duration-500"
                      style={{ width: `${czasOpiekiBezEdukacji}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium w-16 text-right">
                    {czasOpiekiBezEdukacji}%
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  Tyle wynosi Twój udział w czasie, kiedy dziecko nie przebywa w
                  placówce edukacyjnej.
                  <InfoTooltip content="Obejmuje wszystkie godziny czuwania – bez względu na to, czy dziecko aktywnie korzysta z Twojej obecności (np. zabawa, opieka), czy np. ogląda bajkę obok Ciebie." />
                </p>
              </div>

              {/* Wskaźnik 2 - Aktywna opieka */}
              <div className="mb-4">
                <h4 className="font-medium">
                  🔹 2. Czas aktywnej opieki (bez placówki edukacyjnej i bez
                  snu):
                </h4>
                <div className="flex items-center mt-1">
                  <div className="relative h-6 bg-gray-200 rounded-full overflow-hidden flex-1 mr-2">
                    <div
                      className="absolute top-0 left-0 h-full bg-sky-600 transition-all duration-500"
                      style={{ width: `${czasAktywnejOpieki}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium w-16 text-right">
                    {czasAktywnejOpieki}%
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  Tyle wynosi Twój udział w czasie, kiedy dziecko nie śpi i nie
                  przebywa w placówce edukacyjnej.
                  <InfoTooltip content="To ten czas, w którym najczęściej trzeba faktycznie zaopiekować się dzieckiem – zorganizować dzień, ugotować, zawieźć, porozmawiać." />
                </p>
              </div>

              {/* Wskaźnik 3 - Sen */}
              <div>
                <h4 className="font-medium">
                  🔹 3. Czas nocnego snu pod Twoją opieką (procentowo):
                </h4>
                <div className="flex items-center mt-1">
                  <div className="relative h-6 bg-gray-200 rounded-full overflow-hidden flex-1 mr-2">
                    <div
                      className="absolute top-0 left-0 h-full bg-sky-600 transition-all duration-500"
                      style={{ width: `${czasSnu}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium w-16 text-right">
                    {czasSnu}%
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  Tyle nocy dziecko spędza z Tobą (sen przypisujemy do dnia, w
                  którym dziecko zasnęło).
                  <InfoTooltip content="To informacja o tym, gdzie dziecko faktycznie nocuje – często istotna w sprawach sądowych." />
                </p>
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <Button variant="outline" className="flex-1" onClick={handleBack}>
                Wstecz
              </Button>{" "}
              <Button className="flex-1" onClick={handleNext}>
                Dalej: Opieka w wakacje i święta
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
} from "@/components/ui/select-simple";

export default function Dzieci() {
  const router = useRouter();
  const { formData, updateFormData } = useFormStore();

  // Funkcja scrollToTop zaimplementowana bezpośrednio w komponencie
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Typ dla placówek edukacyjnych
  type PlacowkaEdukacyjna =
    | "zlobek"
    | "przedszkole"
    | "podstawowa"
    | "ponadpodstawowa"
    | "";

  // Inicjalizacja stanu dla liczby dzieci i ich danych z formStore
  const [liczbaDzieci, setLiczbaDzieci] = useState<number>(
    formData.liczbaDzieci || 1
  );
  const [dzieci, setDzieci] = useState<
    Array<{
      id: number;
      wiek: number | "";
      plec: "K" | "M" | "I" | "";
      specjalnePotrzeby: boolean;
      opisSpecjalnychPotrzeb: string;
      uczeszczeDoPlacowki: boolean;
      typPlacowki: PlacowkaEdukacyjna;
      opiekaInnejOsoby: boolean | null;
      modelOpieki: "50/50" | "inny" | "";
    }>
  >(
    formData.dzieci?.map(
      (d: {
        id: number;
        wiek: number;
        plec: "K" | "M" | "I";
        specjalnePotrzeby: boolean;
        opisSpecjalnychPotrzeb?: string;
        uczeszczeDoPlacowki?: boolean;
        typPlacowki?: PlacowkaEdukacyjna;
        opiekaInnejOsoby?: boolean | null;
        modelOpieki?: "50/50" | "inny";
      }) => ({
        id: d.id,
        wiek: typeof d.wiek === "number" ? d.wiek : "",
        plec: d.plec,
        specjalnePotrzeby: d.specjalnePotrzeby,
        opisSpecjalnychPotrzeb: d.opisSpecjalnychPotrzeb || "",
        uczeszczeDoPlacowki: d.uczeszczeDoPlacowki ?? false,
        typPlacowki: d.typPlacowki || "",
        opiekaInnejOsoby: d.opiekaInnejOsoby ?? null,
        modelOpieki: d.modelOpieki || "",
      })
    ) || [
      {
        id: 1,
        wiek: "",
        plec: "",
        specjalnePotrzeby: false,
        opisSpecjalnychPotrzeb: "",
        uczeszczeDoPlacowki: false,
        typPlacowki: "",
        opiekaInnejOsoby: null,
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
          uczeszczeDoPlacowki: false,
          typPlacowki: "",
          opiekaInnejOsoby: null,
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
      // Walidacja placówki edukacyjnej
      if (dziecko.uczeszczeDoPlacowki && !dziecko.typPlacowki) {
        hasError = true;
        errorMessage = `Proszę wybrać typ placówki edukacyjnej dla dziecka ${
          index + 1
        }`;
      }
      // Walidacja opieki innej osoby dla dzieci, które nie uczęszczają do placówki
      if (!dziecko.uczeszczeDoPlacowki && dziecko.opiekaInnejOsoby === null) {
        hasError = true;
        errorMessage = `Proszę określić, czy dziecko ${
          index + 1
        } pozostaje pod opieką innej osoby`;
      }
      if (dziecko.modelOpieki === "") {
        hasError = true;
        errorMessage = `Proszę wybrać model opieki dla dziecka ${index + 1}`;
      }
    });

    if (hasError) {
      setError(errorMessage);
      return;
    }

    // Zapisujemy dane do store"a
    const dzieciDoZapisu = dzieci.map((d) => ({
      id: d.id,
      wiek: typeof d.wiek === "number" ? d.wiek : 0,
      plec: d.plec as "K" | "M" | "I",
      specjalnePotrzeby: d.specjalnePotrzeby,
      opisSpecjalnychPotrzeb: d.specjalnePotrzeby
        ? d.opisSpecjalnychPotrzeb
        : undefined,
      uczeszczeDoPlacowki: d.uczeszczeDoPlacowki,
      typPlacowki: d.uczeszczeDoPlacowki ? d.typPlacowki : undefined,
      opiekaInnejOsoby: !d.uczeszczeDoPlacowki ? d.opiekaInnejOsoby : undefined,
      modelOpieki: d.modelOpieki as "50/50" | "inny",
    }));
    updateFormData({ liczbaDzieci, dzieci: dzieciDoZapisu });

    // Zawsze zaczynamy od pierwszego dziecka
    const pierwsze_dziecko = dzieciDoZapisu[0];

    // Zapisujemy informację o aktualnie przetwarzanym dziecku
    updateFormData({
      aktualneDzieckoWTabeliCzasu: pierwsze_dziecko.id,
    });

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
          <FormProgress currentStep={4} totalSteps={12} />
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">Informacje o dzieciach</h1>
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
              <p className="text-sky-950">
                Ta część formularza dotyczy dzieci, których sytuacja
                alimentacyjna lub sposób dzielenia się kosztami utrzymania
                została już w jakiś sposób ustalona.
              </p>
              <p className="text-sky-950">
                W AliMatrix wierzymy, że rzetelna analiza zaczyna się od
                zrozumienia konkretu – a potrzeby dziecka są jednym z jego
                najważniejszych wymiarów. W kolejnych krokach poprosimy Cię o
                informacje, które pomogą określić, jak wygląda Wasza codzienność
                – opieka, czas spędzany z dzieckiem, jego wiek, edukacja oraz
                rzeczywiste wydatki.
              </p>
              <p className="text-sky-950">
                Te dane są nie tylko potrzebne do przygotowania raportu – mogą
                pomóc również Tobie, by lepiej zobaczyć strukturę codzienności i
                odpowiedzialności. Wiele osób dopiero w trakcie tego etapu
                uświadamia sobie, jak naprawdę wygląda podział czasu i kosztów
                związanych z wychowaniem.
              </p>
              <h3>Liczba dzieci</h3>
              <p className="text-sky-950">
                Ile dzieci objętych jest ustaleniami dotyczącymi alimentów lub
                współfinansowania kosztów życia?{" "}
                <strong>
                  (Od tej liczby będzie zależeć, ile razy wyświetlimy Tobie
                  kolejne pytania – dane każdego dziecka zbieramy oddzielnie.)
                </strong>
              </p>
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

                  {/* 1. Wiek dziecka */}
                  <div className="mb-6">
                    <Label
                      htmlFor={`wiek-${dziecko.id}`}
                      className="text-lg font-medium"
                    >
                      1. Wiek dziecka
                    </Label>
                    <p className="text-sm text-gray-600 mb-2">
                      Wiek dziecka wpływa na ocenę adekwatności kosztów i
                      stopnia zaangażowania opiekuńczego. Inne potrzeby ma
                      niemowlę, inne nastolatek.
                    </p>
                    <Input
                      id={`wiek-${dziecko.id}`}
                      type="number"
                      min="0"
                      max="26"
                      value={dziecko.wiek}
                      onChange={(e) =>
                        updateDziecko(index, {
                          wiek: e.target.value ? parseInt(e.target.value) : "",
                        })
                      }
                      className="mt-1"
                    />
                  </div>

                  {/* 2. Płeć dziecka */}
                  <div className="mb-6">
                    <div className="flex items-center gap-2">
                      <Label
                        htmlFor={`plec-${dziecko.id}`}
                        className="text-lg font-medium"
                      >
                        2. Płeć dziecka
                      </Label>
                      <InfoTooltip
                        content={
                          <div className="space-y-2 text-sm">
                            <p>
                              Informacja ta może pomóc w lepszym dopasowaniu
                              raportu i analizie różnic w sytuacji dzieci
                              różnych płci. Nie zwiększa ryzyka identyfikacji
                              danych i nie jest wymagana, jeśli nie chcesz jej
                              podawać.
                            </p>
                          </div>
                        }
                      />
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Zaznacz, jakiej płci jest dziecko, którego dotyczą dane w
                      formularzu.
                    </p>
                    <p className="text-sm text-gray-600 font-medium mb-2">
                      Dlaczego pytamy?
                    </p>
                    <p className="text-sm text-gray-600 mb-2">
                      Płeć dziecka może mieć wpływ na sposób sprawowania opieki,
                      orzeczenia sądowe i wysokość alimentów – niekiedy z
                      powodów kulturowych lub praktycznych. Te dane pozwolą nam
                      lepiej zrozumieć, jak wygląda rzeczywistość rodziców w
                      różnych sytuacjach.
                    </p>

                    {/* Zastąpienie radio buttonów na Select */}
                    <Select
                      value={dziecko.plec}
                      onValueChange={(value) =>
                        updateDziecko(index, {
                          plec: value as "K" | "M" | "I",
                        })
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Wybierz płeć dziecka" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="M">Chłopiec</SelectItem>
                        <SelectItem value="K">Dziewczynka</SelectItem>
                        <SelectItem value="I">
                          Inna / wolę nie podawać
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* 3. Placówka edukacyjna */}
                  <div className="mb-6">
                    <Label
                      htmlFor={`placowka-${dziecko.id}`}
                      className="text-lg font-medium"
                    >
                      3. Czy dziecko uczęszcza do placówki edukacyjnej?
                    </Label>

                    {/* Zastąpienie radio buttonów na Select */}
                    <div className="mt-2">
                      <Select
                        value={dziecko.uczeszczeDoPlacowki ? "tak" : "nie"}
                        onValueChange={(value) => {
                          const uczeszczeDoPlacowki = value === "tak";
                          updateDziecko(index, {
                            uczeszczeDoPlacowki,
                            typPlacowki: uczeszczeDoPlacowki
                              ? dziecko.typPlacowki
                              : "",
                            opiekaInnejOsoby: !uczeszczeDoPlacowki
                              ? dziecko.opiekaInnejOsoby
                              : null,
                          });
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Wybierz odpowiedź" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tak">Tak</SelectItem>
                          <SelectItem value="nie">Nie</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Wybór typu placówki edukacyjnej */}
                    {dziecko.uczeszczeDoPlacowki && (
                      <div className="mt-3 pl-4 border-l-2 border-gray-200">
                        <p className="text-sm text-gray-600 mb-2">
                          Wybierz typ placówki:
                        </p>

                        {/* Zastąpienie radio buttonów na Select */}
                        <Select
                          value={dziecko.typPlacowki}
                          onValueChange={(value) =>
                            updateDziecko(index, {
                              typPlacowki: value as PlacowkaEdukacyjna,
                            })
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Wybierz typ placówki" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="zlobek">Żłobek</SelectItem>
                            <SelectItem value="przedszkole">
                              Przedszkole
                            </SelectItem>
                            <SelectItem value="podstawowa">
                              Szkoła podstawowa
                            </SelectItem>
                            <SelectItem value="ponadpodstawowa">
                              Szkoła ponadpodstawowa
                            </SelectItem>
                          </SelectContent>
                        </Select>

                        <div className="mt-2 p-3 bg-blue-50 rounded-md flex items-start">
                          <span className="text-blue-500 mr-2">ℹ️</span>
                          <p className="text-sm text-blue-700">
                            Pamiętaj, by uwzględnić koszty edukacji w sekcji
                            dotyczącej wydatków.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Opieka innej osoby, jeśli nie uczęszcza do placówki */}
                    {dziecko.uczeszczeDoPlacowki === false && (
                      <div className="mt-3 pl-4 border-l-2 border-gray-200">
                        <div className="flex items-center gap-2 mb-2">
                          <p className="text-sm font-medium text-gray-700">
                            Czy ktoś inny niż rodzice sprawuje nad dzieckiem
                            stałą, regularną opiekę?
                          </p>
                          <InfoTooltip
                            content={
                              <div className="space-y-2 text-sm">
                                <p>
                                  To pytanie dotyczy sytuacji, w której opieka
                                  nad dzieckiem odbywa się poza placówką
                                  edukacyjną, ale jest powierzona osobie
                                  trzeciej w sposób regularny (np. codziennie
                                  lub kilka razy w tygodniu).
                                </p>
                              </div>
                            }
                          />
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          Jeśli dziecko nie uczęszcza do żłobka, przedszkola lub
                          szkoły, wskaż, czy znajduje się pod opieką innej osoby
                          w sposób powtarzalny (np. opiekunka, dziadkowie, inny
                          członek rodziny).
                        </p>

                        {/* Zastąpienie radio buttonów na Select */}
                        <Select
                          value={
                            dziecko.opiekaInnejOsoby === null
                              ? ""
                              : dziecko.opiekaInnejOsoby
                              ? "tak"
                              : "nie"
                          }
                          onValueChange={(value) =>
                            updateDziecko(index, {
                              opiekaInnejOsoby:
                                value === "tak"
                                  ? true
                                  : value === "nie"
                                  ? false
                                  : null,
                            })
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Wybierz odpowiedź" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="tak">
                              Tak – dziecko pozostaje pod stałą opieką innej
                              osoby (np. opiekunki, dziadków)
                            </SelectItem>
                            <SelectItem value="nie">
                              Nie – dziecko przebywa wyłącznie pod opieką
                              rodziców
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>

                  {/* 4. Specjalne potrzeby */}
                  <div className="mb-6">
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
                        className="font-medium cursor-pointer"
                      >
                        4. Dziecko ma specjalne potrzeby zdrowotne lub
                        edukacyjne
                      </Label>
                    </div>

                    {dziecko.specjalnePotrzeby && (
                      <div className="mt-3 pl-8">
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

                  {/* 5. Model opieki */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2">
                      <Label
                        htmlFor={`model-opieki-${dziecko.id}`}
                        className="text-lg font-medium"
                      >
                        5. Sposób sprawowania opieki
                      </Label>
                      <InfoTooltip
                        content={
                          <div className="space-y-2 text-sm">
                            <p>
                              Jeśli wybierzesz „Inny układ", przejdziesz do
                              formularza, który pomoże określić procentowy
                              podział opieki na podstawie rzeczywistego czasu
                              spędzanego z dzieckiem.
                            </p>
                          </div>
                        }
                      />
                    </div>

                    {/* Zastąpienie radio buttonów na Select */}
                    <div className="mt-2">
                      <Select
                        value={dziecko.modelOpieki}
                        onValueChange={(value) =>
                          updateDziecko(index, {
                            modelOpieki: value as "50/50" | "inny",
                          })
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Wybierz model opieki" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="50/50">
                            Opieka naprzemienna (50/50) - Dziecko spędza równy
                            czas pod opieką każdego z rodziców
                          </SelectItem>
                          <SelectItem value="inny">
                            Inny układ - Dziecko spędza różną ilość czasu pod
                            opieką każdego rodzica (wymagane wypełnienie tabeli
                            czasu)
                          </SelectItem>
                        </SelectContent>
                      </Select>
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
      </Card>{" "}
    </main>
  );
}

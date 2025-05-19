"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/ui/custom/Logo";
import { FormProgress } from "@/components/ui/custom/FormProgress";
import { InfoTooltip } from "@/components/ui/custom/InfoTooltip";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useFormStore } from "@/lib/store/form-store";
import { useSecureFormStore } from "@/lib/store/secure-form-store";
import { Checkbox } from "@/components/ui/checkbox";
import { PlusCircle, MinusCircle, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
} from "@/components/ui/select-simple";
import { childrenFormSchema } from "@/lib/schemas/children-schema";
import {
  generateCSRFToken,
  storeCSRFToken,
  safeToSubmit,
  recordSubmission,
} from "@/lib/client-security";
import {
  safeNavigate,
  generateOperationId,
  trackedLog,
  retryOperation,
} from "@/lib/form-handlers";

export default function Dzieci() {
  const router = useRouter();
  const { formData, updateFormData } = useFormStore();
  const secureStore = useSecureFormStore();

  // CSRF token initialization
  const csrfInitialized = useRef(false);

  useEffect(() => {
    if (!csrfInitialized.current) {
      const token = generateCSRFToken();
      storeCSRFToken(token);
      secureStore.setMetaData({ csrfToken: token });
      csrfInitialized.current = true;
    }
  }, [secureStore]);

  // Zabezpieczenie - sprawdzamy czy użytkownik przeszedł przez poprzednie kroki
  useEffect(() => {
    if (!formData.podstawaUstalen) {
      router.push("/podstawa-ustalen");
      return;
    }
  }, [formData.podstawaUstalen, router]);

  // Funkcja scrollToTop dla lepszego UX przy przejściach
  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

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
  // Stan do śledzenia aktualnego dziecka w cyklicznym przepływie formularza
  const [currentChildIndex, setCurrentChildIndex] = useState<number>(
    formData.currentChildIndex !== undefined ? formData.currentChildIndex : 0
  );

  // Typ dla błędów pól formularza
  type FieldErrors = {
    [dzieckoId: number]: {
      wiek?: string;
      plec?: string;
      opisSpecjalnychPotrzeb?: string;
      typPlacowki?: string;
      opiekaInnejOsoby?: string;
      modelOpieki?: string;
    };
  };

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

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

  // Stan przycisku do zapobiegania wielokrotnym kliknięciom
  const [isSubmitting, setIsSubmitting] = useState(false); // Aktualizacja dzieci, gdy zmieni się liczba dzieci
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
      // Usuwamy również błędy dla usuniętych dzieci
      const newFieldErrors = { ...fieldErrors };
      for (let i = liczbaDzieci; i < dzieci.length; i++) {
        delete newFieldErrors[dzieci[i].id];
      }
      setFieldErrors(newFieldErrors);
    }
  }, [liczbaDzieci, dzieci, fieldErrors]);

  // Funkcja do aktualizacji danych dziecka
  const updateDziecko = (index: number, data: Partial<(typeof dzieci)[0]>) => {
    const noweDzieci = [...dzieci];
    noweDzieci[index] = { ...noweDzieci[index], ...data };
    setDzieci(noweDzieci);
  };
  // Funkcja do obsługi przejścia do następnego kroku
  const handleNext = useCallback(async () => {
    // Zapobieganie wielokrotnym kliknięciom z wizualnym feedbackiem
    if (isSubmitting || !safeToSubmit()) {
      trackedLog(
        "user-action",
        "Form submission prevented: Already submitting or too soon after last submission"
      );
      return;
    }

    // Unikalny identyfikator dla bieżącej operacji (dla debugowania)
    const operationId = generateOperationId();
    trackedLog(operationId, "Starting children form submission");

    setIsSubmitting(true);
    setError(null);
    setFieldErrors({});

    try {
      // Walidacja tylko aktualnego dziecka zamiast wszystkich dzieci
      trackedLog(operationId, "Validating form data for child", {
        childIndex: currentChildIndex,
        childId: dzieci[currentChildIndex]?.id,
      });

      // Przygotowanie danych dziecka do walidacji
      const childToValidate = {
        liczbaDzieci,
        dzieci: [dzieci[currentChildIndex]].map((d) => ({
          id: d.id,
          wiek: d.wiek,
          plec: d.plec,
          specjalnePotrzeby: d.specjalnePotrzeby,
          opisSpecjalnychPotrzeb: d.opisSpecjalnychPotrzeb,
          uczeszczeDoPlacowki: d.uczeszczeDoPlacowki,
          typPlacowki: d.typPlacowki,
          opiekaInnejOsoby: d.opiekaInnejOsoby,
          modelOpieki: d.modelOpieki,
        })),
      };

      const validationResult = childrenFormSchema.safeParse(childToValidate);

      if (!validationResult.success) {
        // Przetwarzamy błędy specyficzne dla pól formularza
        const newFieldErrors: FieldErrors = {};

        // Funkcja do oczyszczania komunikatów błędów
        const cleanErrorMessage = (msg: string, fieldName?: string): string => {
          // Usunięcie technicznych informacji o enumach
          if (msg.startsWith("Invalid enum value")) {
            if (fieldName === "plec" || msg.includes("plec"))
              return "Proszę wybrać płeć dziecka";
            if (fieldName === "typPlacowki" || msg.includes("typPlacowki"))
              return "Proszę wybrać typ placówki edukacyjnej";
            if (fieldName === "modelOpieki" || msg.includes("modelOpieki"))
              return "Proszę wybrać model opieki";
            return "Proszę wybrać poprawną opcję";
          }
          return msg;
        };

        // Mapowanie pól na bardziej przyjazne nazwy
        const fieldNameMapping: Record<string, string> = {
          wiek: "Wiek dziecka",
          plec: "Płeć dziecka",
          opisSpecjalnychPotrzeb: "Opis specjalnych potrzeb",
          uczeszczeDoPlacowki: "Uczęszczanie do placówki",
          typPlacowki: "Typ placówki edukacyjnej",
          opiekaInnejOsoby: "Opieka innej osoby",
          modelOpieki: "Model opieki",
        };

        // Analizujemy wszystkie problemy walidacji
        validationResult.error.issues.forEach((issue) => {
          // Sprawdzamy czy błąd dotyczy konkretnego dziecka i pola
          if (
            issue.path.length >= 3 &&
            issue.path[0] === "dzieci" &&
            typeof issue.path[1] === "number" &&
            typeof issue.path[2] === "string"
          ) {
            const childIndex = issue.path[1];
            const fieldName = issue.path[2];
            const dzieckoId = dzieci[currentChildIndex]?.id;

            if (dzieckoId !== undefined) {
              // Inicjalizujemy obiekt błędów dla dziecka, jeśli nie istnieje
              if (!newFieldErrors[dzieckoId]) {
                newFieldErrors[dzieckoId] = {};
              }

              // Czyścimy komunikaty błędów z informacji technicznych
              let errorMessage = issue.message;
              if (errorMessage.startsWith("Invalid enum value")) {
                if (fieldName === "plec")
                  errorMessage = "Proszę wybrać płeć dziecka";
                else if (fieldName === "typPlacowki")
                  errorMessage = "Proszę wybrać typ placówki";
                else if (fieldName === "modelOpieki")
                  errorMessage = "Proszę wybrać model opieki";
                else errorMessage = "Proszę wybrać wartość z listy";
              } else if (
                fieldName === "wiek" &&
                errorMessage.includes("Required")
              ) {
                errorMessage = "Wiek dziecka jest wymagany";
              } else if (
                fieldName === "opisSpecjalnychPotrzeb" &&
                errorMessage.includes("Required")
              ) {
                errorMessage = "Proszę opisać specjalne potrzeby dziecka";
              } else if (fieldName === "opiekaInnejOsoby") {
                errorMessage =
                  "Proszę określić, czy dziecko pozostaje pod opieką innej osoby";
              }

              // Zapisujemy błąd w odpowiednim polu
              newFieldErrors[dzieckoId][
                fieldName as keyof (typeof newFieldErrors)[number]
              ] = errorMessage;
            }
          }
        });

        // Ustawiamy błędy pól
        if (Object.keys(newFieldErrors).length > 0) {
          setFieldErrors(newFieldErrors);
        }

        // Przygotowanie komunikatu błędu
        const formattedErrors = validationResult.error.format();
        let errorMessage = "";

        // Najpierw sprawdzamy błędy na poziomie formularza
        if (formattedErrors._errors?.length) {
          errorMessage = formattedErrors._errors[0];
        }
        // Następnie błędy na poziomie dzieci
        else if (formattedErrors.dzieci?._errors?.length) {
          errorMessage = formattedErrors.dzieci._errors[0];
        }
        // Następnie błędy dla poszczególnych dzieci
        else {
          const childErrors = formattedErrors.dzieci?.[0];
          if (childErrors) {
            // Sprawdzamy wszystkie pola z mapowania
            for (const [field, displayName] of Object.entries(
              fieldNameMapping
            )) {
              const fieldErrors =
                childErrors[field as keyof typeof childErrors];
              if (
                fieldErrors &&
                "_errors" in fieldErrors &&
                fieldErrors._errors?.length
              ) {
                errorMessage = `${displayName} - ${cleanErrorMessage(
                  fieldErrors._errors[0],
                  field
                )}`;
                break;
              }
            }

            // Jeśli nadal nie mamy komunikatu, sprawdzamy ogólny błąd
            if (!errorMessage && childErrors._errors?.length) {
              errorMessage = cleanErrorMessage(childErrors._errors[0]);
            }
          }
        }

        // Jeśli nie znaleźliśmy szczegółowego błędu, sprawdzamy jeszcze raw errors
        if (!errorMessage) {
          // Przeglądamy wszystkie błędy w tablicy błędów
          const allIssues = validationResult.error.issues;
          if (allIssues.length > 0) {
            const issue = allIssues[0];
            errorMessage = cleanErrorMessage(issue.message);
          } else {
            errorMessage = "Proszę poprawić błędy w formularzu";
          }
        }

        trackedLog(operationId, "Validation failed", errorMessage, "warn");
        setError(errorMessage);
        setIsSubmitting(false);
        return;
      }

      trackedLog(operationId, "Validation successful, proceeding to save data");

      // Przygotowanie danych bieżącego dziecka do zapisu
      const aktualneDziecko = {
        id: dzieci[currentChildIndex].id,
        wiek:
          typeof dzieci[currentChildIndex].wiek === "number"
            ? dzieci[currentChildIndex].wiek
            : 0,
        plec: dzieci[currentChildIndex].plec as "K" | "M" | "I",
        specjalnePotrzeby: dzieci[currentChildIndex].specjalnePotrzeby,
        opisSpecjalnychPotrzeb: dzieci[currentChildIndex].specjalnePotrzeby
          ? dzieci[currentChildIndex].opisSpecjalnychPotrzeb
          : undefined,
        uczeszczeDoPlacowki: dzieci[currentChildIndex].uczeszczeDoPlacowki,
        typPlacowki: dzieci[currentChildIndex].uczeszczeDoPlacowki
          ? dzieci[currentChildIndex].typPlacowki
          : undefined,
        opiekaInnejOsoby: !dzieci[currentChildIndex].uczeszczeDoPlacowki
          ? dzieci[currentChildIndex].opiekaInnejOsoby
          : undefined,
        modelOpieki: dzieci[currentChildIndex].modelOpieki as "50/50" | "inny",
      };

      const zaktualizowaneDzieci = [...(formData.dzieci || [])];
      // Aktualizacja lub dodanie dziecka w tablicy
      const existingIndex = zaktualizowaneDzieci.findIndex(
        (d) => d.id === aktualneDziecko.id
      );
      if (existingIndex >= 0) {
        zaktualizowaneDzieci[existingIndex] = aktualneDziecko;
      } else {
        zaktualizowaneDzieci.push(aktualneDziecko);
      }

      // Sprawdź, czy to ostatnie dziecko czy nie
      const isLastChild = currentChildIndex === liczbaDzieci - 1;

      // Zapisujemy dane do store'a wykorzystując mechanizm ponownych prób
      try {
        await retryOperation(
          async () => {
            // Using type assertion to work around TypeScript issues
            await updateFormData({
              liczbaDzieci,
              dzieci: zaktualizowaneDzieci,
              // Zapisz informacje o aktualnym cyklu formularza              currentChildIndex,
              activeChildId: aktualneDziecko.id,
              aktualneDzieckoWTabeliCzasu: aktualneDziecko.id,
              __meta: {
                lastUpdated: Date.now(),
                formVersion: "1.1.0",
              },
            });
            return true;
          },
          {
            maxAttempts: 3,
            delayMs: 300,
            operationName: "Update form data - dzieci",
            operationId,
          }
        );

        // Zapisujemy informację o submisji formularza dla celów analizy
        recordSubmission();

        trackedLog(operationId, "Data successfully saved");

        // Przewijamy stronę do góry przed przejściem do następnej strony
        scrollToTop(); // Dodajemy małe opóźnienie dla lepszego UX
        setTimeout(() => {
          // Zawsze przechodzimy do następnej strony zgodnie z modelem opieki
          const targetPath =
            aktualneDziecko.modelOpieki === "inny"
              ? "/czas-opieki"
              : "/koszty-utrzymania";
          trackedLog(
            operationId,
            `Navigating to ${targetPath} for current child`
          );
          router.push(targetPath);

          // Zmniejszamy szansę na back button lub podwójną submisję
          setTimeout(() => {
            setIsSubmitting(false);
          }, 500);
        }, 100);
      } catch (error) {
        trackedLog(operationId, "Error saving data", error, "error");
        setIsSubmitting(false);
        setError("Wystąpił błąd podczas zapisywania danych. Spróbuj ponownie.");
      }
    } catch (error) {
      trackedLog(operationId, "Unexpected error", error, "error");
      setIsSubmitting(false);
      setError("Wystąpił nieoczekiwany błąd. Spróbuj ponownie.");
    }
  }, [
    dzieci,
    liczbaDzieci,
    router,
    scrollToTop,
    updateFormData,
    isSubmitting,
    currentChildIndex,
    formData.dzieci,
  ]);
  // Funkcja do obsługi powrotu do poprzedniego kroku
  const handleBack = useCallback(() => {
    // Zapobieganie wielokrotnym kliknięciom
    if (isSubmitting) return;

    const operationId = generateOperationId();
    trackedLog(operationId, "Navigating back to podstawa-ustalen");

    // Przewijamy stronę do góry przed przejściem do poprzedniej strony
    scrollToTop();

    // Dodajemy małe opóźnienie dla lepszego UX
    setTimeout(() => {
      router.push("/podstawa-ustalen");
    }, 100);
  }, [isSubmitting, router, scrollToTop]);

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

              {/* Display only the current child form */}
              {dzieci.length > 0 && (
                <div className="mt-6">
                  {" "}
                  <div className="bg-blue-50 p-4 rounded-lg mb-4">
                    <p className="font-medium">
                      Wypełniasz dane dla Dziecka {currentChildIndex + 1} z{" "}
                      {liczbaDzieci}
                    </p>
                    <p className="text-sm mt-1">
                      Dla każdego dziecka najpierw podaj informacje podstawowe,
                      następnie przejdź przez cały cykl formularza. Po
                      zakończeniu cyklu dla jednego dziecka, wrócisz tutaj aby
                      uzupełnić dane kolejnego.
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                      <p className="text-xs font-medium">
                        Krok 1/3: Dane podstawowe dziecka
                      </p>
                    </div>
                  </div>
                  <div className="p-4 border-2 border-gray-200 rounded-lg">
                    <h3 className="font-medium mb-3">
                      Dziecko {currentChildIndex + 1}
                    </h3>

                    {/* 1. Wiek dziecka */}
                    <div className="mb-6">
                      <Label
                        htmlFor={`wiek-${dzieci[currentChildIndex].id}`}
                        className="text-lg font-medium"
                      >
                        1. Wiek dziecka
                      </Label>
                      <p className="text-sm text-gray-600 mb-2">
                        Wiek dziecka wpływa na ocenę adekwatności kosztów i
                        stopnia zaangażowania opiekuńczego. Inne potrzeby ma
                        niemowlę, inne nastolatek.
                      </p>{" "}
                      <Input
                        id={`wiek-${dzieci[currentChildIndex].id}`}
                        type="number"
                        min="0"
                        max="26"
                        value={dzieci[currentChildIndex].wiek}
                        onChange={(e) => {
                          // Czyścimy potencjalny błąd po zmianie wartości
                          if (fieldErrors[dzieci[currentChildIndex].id]?.wiek) {
                            setFieldErrors((prev) => ({
                              ...prev,
                              [dzieci[currentChildIndex].id]: {
                                ...prev[dzieci[currentChildIndex].id],
                                wiek: undefined,
                              },
                            }));
                          }
                          updateDziecko(currentChildIndex, {
                            wiek: e.target.value
                              ? parseInt(e.target.value)
                              : "",
                          });
                        }}
                        className={`mt-1 ${
                          fieldErrors[dzieci[currentChildIndex].id]?.wiek
                            ? "border-red-500"
                            : ""
                        }`}
                      />
                      {fieldErrors[dzieci[currentChildIndex].id]?.wiek && (
                        <p className="text-red-500 text-xs mt-1">
                          {fieldErrors[dzieci[currentChildIndex].id]?.wiek}
                        </p>
                      )}
                    </div>

                    {/* 2. Płeć dziecka */}
                    <div className="mb-6">
                      <div className="flex items-center gap-2">
                        <Label
                          htmlFor={`plec-${dzieci[currentChildIndex].id}`}
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
                        Zaznacz, jakiej płci jest dziecko, którego dotyczą dane
                        w formularzu.
                      </p>
                      <p className="text-sm text-gray-600 font-medium mb-2">
                        Dlaczego pytamy?
                      </p>
                      <p className="text-sm text-gray-600 mb-2">
                        Płeć dziecka może mieć wpływ na sposób sprawowania
                        opieki, orzeczenia sądowe i wysokość alimentów –
                        niekiedy z powodów kulturowych lub praktycznych. Te dane
                        pozwolą nam lepiej zrozumieć, jak wygląda rzeczywistość
                        rodziców w różnych sytuacjach.
                      </p>
                      {/* Zastąpienie radio buttonów na Select */}{" "}
                      <Select
                        value={dzieci[currentChildIndex].plec}
                        onValueChange={(value) => {
                          // Czyścimy potencjalny błąd po zmianie wartości
                          if (fieldErrors[dzieci[currentChildIndex].id]?.plec) {
                            setFieldErrors((prev) => ({
                              ...prev,
                              [dzieci[currentChildIndex].id]: {
                                ...prev[dzieci[currentChildIndex].id],
                                plec: undefined,
                              },
                            }));
                          }
                          updateDziecko(currentChildIndex, {
                            plec: value as "K" | "M" | "I",
                          });
                        }}
                      >
                        <SelectTrigger
                          className={`w-full ${
                            fieldErrors[dzieci[currentChildIndex].id]?.plec
                              ? "border-red-500 ring-red-500"
                              : ""
                          }`}
                        >
                          <SelectValue placeholder="Wybierz płeć dziecka" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="K">Dziewczynka</SelectItem>
                          <SelectItem value="M">Chłopiec</SelectItem>
                          <SelectItem value="I">
                            Inna / wolę nie podawać
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      {fieldErrors[dzieci[currentChildIndex].id]?.plec && (
                        <p className="text-red-500 text-xs mt-1">
                          {fieldErrors[dzieci[currentChildIndex].id]?.plec}
                        </p>
                      )}
                    </div>

                    {/* 3. Uczęszczanie do placówki edukacyjnej */}
                    <div className="mb-6">
                      <Label
                        htmlFor={`placowka-${dzieci[currentChildIndex].id}`}
                        className="text-lg font-medium"
                      >
                        3. Uczęszczanie do placówki edukacyjnej
                      </Label>
                      <p className="text-sm text-gray-600 mb-2">
                        Określ, czy dziecko uczęszcza do żłobka, przedszkola lub
                        szkoły.
                      </p>{" "}
                      <Select
                        value={
                          dzieci[currentChildIndex].uczeszczeDoPlacowki
                            ? "tak"
                            : "nie"
                        }
                        onValueChange={(value) => {
                          const uczeszczeDoPlacowki = value === "tak";
                          updateDziecko(currentChildIndex, {
                            uczeszczeDoPlacowki,
                            typPlacowki: uczeszczeDoPlacowki
                              ? dzieci[currentChildIndex].typPlacowki
                              : "",
                            opiekaInnejOsoby: !uczeszczeDoPlacowki
                              ? dzieci[currentChildIndex].opiekaInnejOsoby
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
                    {dzieci[currentChildIndex].uczeszczeDoPlacowki && (
                      <div className="mb-6 ml-6">
                        <Label
                          htmlFor={`typ-placowki-${dzieci[currentChildIndex].id}`}
                          className="font-medium"
                        >
                          Typ placówki edukacyjnej
                        </Label>
                        <Select
                          value={dzieci[currentChildIndex].typPlacowki}
                          onValueChange={(value) => {
                            // Czyścimy potencjalny błąd po zmianie wartości
                            if (
                              fieldErrors[dzieci[currentChildIndex].id]
                                ?.typPlacowki
                            ) {
                              setFieldErrors((prev) => ({
                                ...prev,
                                [dzieci[currentChildIndex].id]: {
                                  ...prev[dzieci[currentChildIndex].id],
                                  typPlacowki: undefined,
                                },
                              }));
                            }
                            updateDziecko(currentChildIndex, {
                              typPlacowki: value as PlacowkaEdukacyjna,
                            });
                          }}
                        >
                          <SelectTrigger
                            className={`w-full ${
                              fieldErrors[dzieci[currentChildIndex].id]
                                ?.typPlacowki
                                ? "border-red-500 ring-red-500"
                                : ""
                            }`}
                          >
                            <SelectValue placeholder="Wybierz typ placówki" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="zlobek">
                              Żłobek/Klub malucha
                            </SelectItem>
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
                        {fieldErrors[dzieci[currentChildIndex].id]
                          ?.typPlacowki && (
                          <p className="text-red-500 text-xs mt-1">
                            {
                              fieldErrors[dzieci[currentChildIndex].id]
                                ?.typPlacowki
                            }
                          </p>
                        )}
                      </div>
                    )}

                    {/* Opieka innej osoby, jeśli nie uczęszcza do placówki */}
                    {dzieci[currentChildIndex].uczeszczeDoPlacowki ===
                      false && (
                      <div className="mb-6 ml-6">
                        <Label
                          htmlFor={`opieka-innej-${dzieci[currentChildIndex].id}`}
                          className="font-medium"
                        >
                          Czy dziecko pozostaje pod opieką innej osoby (np.
                          opiekunki, dziadków) w czasie, gdy Ty pracujesz?
                        </Label>
                        <Select
                          value={
                            dzieci[currentChildIndex].opiekaInnejOsoby === true
                              ? "tak"
                              : dzieci[currentChildIndex].opiekaInnejOsoby ===
                                false
                              ? "nie"
                              : ""
                          }
                          onValueChange={(value) => {
                            // Czyścimy potencjalny błąd po zmianie wartości
                            if (
                              fieldErrors[dzieci[currentChildIndex].id]
                                ?.opiekaInnejOsoby
                            ) {
                              setFieldErrors((prev) => ({
                                ...prev,
                                [dzieci[currentChildIndex].id]: {
                                  ...prev[dzieci[currentChildIndex].id],
                                  opiekaInnejOsoby: undefined,
                                },
                              }));
                            }
                            updateDziecko(currentChildIndex, {
                              opiekaInnejOsoby: value === "tak",
                            });
                          }}
                        >
                          <SelectTrigger
                            className={`w-full ${
                              fieldErrors[dzieci[currentChildIndex].id]
                                ?.opiekaInnejOsoby
                                ? "border-red-500 ring-red-500"
                                : ""
                            }`}
                          >
                            <SelectValue placeholder="Wybierz odpowiedź" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="tak">Tak</SelectItem>
                            <SelectItem value="nie">Nie</SelectItem>
                          </SelectContent>
                        </Select>
                        {fieldErrors[dzieci[currentChildIndex].id]
                          ?.opiekaInnejOsoby && (
                          <p className="text-red-500 text-xs mt-1">
                            {
                              fieldErrors[dzieci[currentChildIndex].id]
                                ?.opiekaInnejOsoby
                            }
                          </p>
                        )}
                      </div>
                    )}

                    {/* 4. Specjalne potrzeby */}
                    <div className="mb-6">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`specjalne-${dzieci[currentChildIndex].id}`}
                          checked={dzieci[currentChildIndex].specjalnePotrzeby}
                          onCheckedChange={(checked) =>
                            updateDziecko(currentChildIndex, {
                              specjalnePotrzeby: !!checked,
                            })
                          }
                        />
                        <Label
                          htmlFor={`specjalne-${dzieci[currentChildIndex].id}`}
                          className="text-lg font-medium cursor-pointer"
                        >
                          4. Dziecko ma specjalne potrzeby
                        </Label>
                      </div>
                      <p className="text-sm text-gray-600 mt-1 mb-2 ml-6">
                        Np. niepełnosprawność, przewlekła choroba, alergie
                        wymagające specjalnej diety, zajęcia terapeutyczne itp.
                      </p>

                      {dzieci[currentChildIndex].specjalnePotrzeby && (
                        <div className="mt-3">
                          <Label
                            htmlFor={`opis-${dzieci[currentChildIndex].id}`}
                            className="ml-6 font-medium"
                          >
                            Opisz krótko specjalne potrzeby
                          </Label>
                          <Input
                            id={`opis-${dzieci[currentChildIndex].id}`}
                            type="text"
                            value={
                              dzieci[currentChildIndex].opisSpecjalnychPotrzeb
                            }
                            onChange={(e) => {
                              // Czyścimy potencjalny błąd po zmianie wartości
                              if (
                                fieldErrors[dzieci[currentChildIndex].id]
                                  ?.opisSpecjalnychPotrzeb
                              ) {
                                setFieldErrors((prev) => ({
                                  ...prev,
                                  [dzieci[currentChildIndex].id]: {
                                    ...prev[dzieci[currentChildIndex].id],
                                    opisSpecjalnychPotrzeb: undefined,
                                  },
                                }));
                              }
                              updateDziecko(currentChildIndex, {
                                opisSpecjalnychPotrzeb: e.target.value,
                              });
                            }}
                            className={`mt-1 ${
                              fieldErrors[dzieci[currentChildIndex].id]
                                ?.opisSpecjalnychPotrzeb
                                ? "border-red-500"
                                : ""
                            }`}
                          />
                          {fieldErrors[dzieci[currentChildIndex].id]
                            ?.opisSpecjalnychPotrzeb && (
                            <p className="text-red-500 text-xs mt-1">
                              {
                                fieldErrors[dzieci[currentChildIndex].id]
                                  ?.opisSpecjalnychPotrzeb
                              }
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* 5. Model opieki */}
                    <div className="mb-6">
                      <div className="flex items-center gap-2">
                        <Label
                          htmlFor={`model-opieki-${dzieci[currentChildIndex].id}`}
                          className="text-lg font-medium"
                        >
                          5. Model opieki nad dzieckiem
                        </Label>
                        <InfoTooltip
                          content={
                            <div className="space-y-2 text-sm">
                              <p>
                                Model opieki to kluczowy element wpływający na
                                koszty utrzymania dziecka i obowiązki
                                alimentacyjne.
                              </p>
                              <p>
                                Jeśli wybierzesz „Opieka naprzemienna (50/50)",
                                przyjmujemy, że dziecko spędza praktycznie równą
                                ilość czasu z obojgiem rodziców.
                              </p>
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
                        {" "}
                        <Select
                          value={dzieci[currentChildIndex].modelOpieki}
                          onValueChange={(value) => {
                            // Czyścimy potencjalny błąd po zmianie wartości
                            if (
                              fieldErrors[dzieci[currentChildIndex].id]
                                ?.modelOpieki
                            ) {
                              setFieldErrors((prev) => ({
                                ...prev,
                                [dzieci[currentChildIndex].id]: {
                                  ...prev[dzieci[currentChildIndex].id],
                                  modelOpieki: undefined,
                                },
                              }));
                            }
                            updateDziecko(currentChildIndex, {
                              modelOpieki: value as "50/50" | "inny",
                            });
                          }}
                        >
                          <SelectTrigger
                            className={`w-full ${
                              fieldErrors[dzieci[currentChildIndex].id]
                                ?.modelOpieki
                                ? "border-red-500 ring-red-500"
                                : ""
                            }`}
                          >
                            <SelectValue placeholder="Wybierz model opieki" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="50/50">
                              Opieka naprzemienna (50/50)
                            </SelectItem>
                            <SelectItem value="inny">
                              Inny układ – np. dziecko spędza większość czasu u
                              jednego z rodziców
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        {fieldErrors[dzieci[currentChildIndex].id]
                          ?.modelOpieki && (
                          <p className="text-red-500 text-xs mt-1">
                            {
                              fieldErrors[dzieci[currentChildIndex].id]
                                ?.modelOpieki
                            }
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {/* Wyświetlanie błędu walidacji */}
            {error && <p className="text-red-500 text-sm">{error}</p>}{" "}
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleBack}
                disabled={isSubmitting}
              >
                Wstecz
              </Button>
              <Button
                className="flex-1"
                onClick={handleNext}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Zapisuję...
                  </>
                ) : (
                  "Dalej"
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>{" "}
    </main>
  );
}

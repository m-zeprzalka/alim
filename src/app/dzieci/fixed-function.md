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
// Walidacja danych przy użyciu schematu Zod
trackedLog(operationId, "Validating form data", {
liczbaDzieci,
dzieciCount: dzieci.length,
});

    const validationResult = childrenFormSchema.safeParse({
      liczbaDzieci,
      dzieci: dzieci.map((d) => ({
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
    });

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
          const dzieckoId = dzieci[childIndex]?.id;

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
        for (let i = 0; i < dzieci.length; i++) {
          const childErrors = formattedErrors.dzieci?.[i];
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
                errorMessage = `Dziecko ${
                  i + 1
                }: ${displayName} - ${cleanErrorMessage(
                  fieldErrors._errors[0],
                  field
                )}`;
                break;
              }
            }

            // Jeśli nadal nie mamy komunikatu, sprawdzamy ogólny błąd
            if (!errorMessage && childErrors._errors?.length) {
              errorMessage = `Dziecko ${i + 1}: ${cleanErrorMessage(
                childErrors._errors[0]
              )}`;
              break;
            }
          }
        }
      }

      // Jeśli nie znaleźliśmy szczegółowego błędu, sprawdzamy jeszcze raw errors
      if (!errorMessage) {
        // Przeglądamy wszystkie błędy w tablicy błędów
        const allIssues = validationResult.error.issues;
        if (allIssues.length > 0) {
          const issue = allIssues[0];

          // Jeśli mamy ścieżkę do pola, próbujemy dodać numer dziecka
          if (
            issue.path.length >= 2 &&
            issue.path[0] === "dzieci" &&
            typeof issue.path[1] === "number"
          ) {
            const childIndex = issue.path[1];
            const fieldName =
              issue.path.length >= 3 ? (issue.path[2] as string) : "";
            const displayName = fieldName
              ? fieldNameMapping[fieldName] || fieldName
              : "";

            errorMessage = `Dziecko ${childIndex + 1}${
              displayName ? ": " + displayName : ""
            } - ${cleanErrorMessage(issue.message, fieldName)}`;
          } else {
            errorMessage = cleanErrorMessage(issue.message);
          }
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

    // Przygotowanie danych do zapisu - z odpowiednią strukturą i warunkami
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

    // Zapisujemy dane do store'a wykorzystując mechanizm ponownych prób
    try {
      await retryOperation(
        async () => {
          await updateFormData({
            liczbaDzieci,
            dzieci: dzieciDoZapisu,
            // Zawsze zaczynamy od pierwszego dziecka
            aktualneDzieckoWTabeliCzasu: dzieciDoZapisu[0].id,
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
      scrollToTop();

      // Określenie następnego kroku na podstawie modelu opieki pierwszego dziecka
      const pierwsze_dziecko = dzieciDoZapisu[0];

      trackedLog(
        operationId,
        `Determining next page based on model opieki: ${pierwsze_dziecko.modelOpieki}`
      );

      // Bezpieczna nawigacja z opóźnieniem dla lepszego UX
      setTimeout(() => {
        const targetPath =
          pierwsze_dziecko.modelOpieki === "inny"
            ? "/czas-opieki"
            : "/koszty-utrzymania";
        trackedLog(operationId, `Navigating to ${targetPath}`);
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
}, [dzieci, liczbaDzieci, router, scrollToTop, updateFormData, isSubmitting]);

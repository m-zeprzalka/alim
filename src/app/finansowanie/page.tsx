"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/ui/custom/Logo";
import { FormProgress } from "@/components/ui/custom/FormProgress";
import { InfoTooltip } from "@/components/ui/custom/InfoTooltip";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup } from "@/components/ui/radio-group";
import { ClickableRadioOption } from "@/components/ui/custom/ClickableRadioOption";
import { useFormStore } from "@/lib/store/form-store";

export default function Finansowanie() {
  const router = useRouter();
  const { formData, updateFormData } = useFormStore();

  // Funkcja scrollToTop zaimplementowana bezpośrednio w komponencie
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Inicjalizacja stanu wybranej opcji z danych formularza (jeśli istnieją)
  const [selectedOption, setSelectedOption] = useState<string>(
    formData.sposobFinansowania || ""
  );

  // Stan błędu do walidacji
  const [error, setError] = useState<string | null>(null);

  // Efekt do sprawdzania zależności
  useEffect(() => {
    if (selectedOption) {
      setError(null);
    }
  }, [selectedOption]);

  // Zabezpieczenie - sprawdzamy czy użytkownik przeszedł przez wybór ścieżki
  useEffect(() => {
    if (!formData.sciezkaWybor) {
      router.push("/sciezka");
    }
  }, [formData.sciezkaWybor, router]);
  // Funkcja do obsługi przejścia do następnego kroku
  const handleNext = () => {
    if (!selectedOption) {
      setError("Proszę wybrać jedną z opcji");
      return;
    }

    // Zapisujemy wybrane dane do store'a
    updateFormData({
      sposobFinansowania: selectedOption as "i-pay" | "i-receive" | "shared",
    });

    // Przewijamy stronę do góry przed przejściem do następnej strony
    scrollToTop();

    // Przekierowanie do następnego kroku
    router.push("/podstawa-ustalen");
  };

  // Funkcja do obsługi powrotu do poprzedniego kroku
  const handleBack = () => {
    // Przewijamy stronę do góry przed przejściem do poprzedniej strony
    scrollToTop();
    router.push("/sciezka");
  };

  return (
    <main className="flex justify-center p-3">
      <Card className="w-full max-w-lg shadow-lg border-sky-100">
        <CardContent className="pt-2">
          <Logo size="medium" />
          <FormProgress currentStep={4} totalSteps={12} />

          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">
                Sposób finansowania potrzeb dziecka
              </h1>
              <InfoTooltip
                content={
                  <div className="space-y-2 text-sm">
                    <p>
                      Pytamy o główne zasady finansowania potrzeb dziecka lub
                      dzieci. Wiemy, że w praktyce sytuacje bywają różne – ale
                      ważne, żeby istniał ustalony sposób dzielenia się
                      kosztami, nawet nieformalny.
                    </p>
                    <p>
                      Twoja odpowiedź pomoże dostosować dalsze pytania w
                      formularzu do Twojej sytuacji. Dzięki temu raport, który
                      otrzymasz, będzie lepiej odzwierciedlał Twoją
                      rzeczywistość.
                    </p>
                  </div>
                }
              />
            </div>
            <p className="text-gray-700">
              Jak w Twojej sytuacji wygląda obecnie główne ustalenie dotyczące
              finansowania potrzeb dziecka lub dzieci? (jeśli masz więcej niż
              jedno dziecko, odpowiedz ogólnie – w kolejnych pytaniach będzie
              miejsce na szczegóły)
            </p>

            <p className="font-semibold text-gray-700 mb-2">
              Wybierz opcję, która najlepiej oddaje Twoją sytuację:
            </p>

            <RadioGroup
              value={selectedOption}
              onValueChange={(value) => {
                setSelectedOption(value);
              }}
              className="space-y-3"
            >
              <ClickableRadioOption
                value="i-pay"
                id="i-pay"
                label="Ja regularnie przekazuję środki na utrzymanie dziecka/dzieci drugiemu rodzicowi"
                description="(np. alimenty lub inne uzgodnienia – niezależnie od tego, czy ponoszę jeszcze inne koszty podczas opieki.)"
                selected={selectedOption === "i-pay"}
              />
              <ClickableRadioOption
                value="i-receive"
                id="i-receive"
                label="Drugi rodzic regularnie przekazuje środki na utrzymanie dziecka/dzieci mnie"
                description="(nawet jeśli także sam pokrywa niektóre koszty podczas swojej opieki.)"
                selected={selectedOption === "i-receive"}
              />
              <ClickableRadioOption
                value="shared"
                id="shared"
                label="Koszty utrzymania dzieci dzielimy w miarę proporcjonalnie, bez formalnego przekazywania pieniędzy między sobą"
                description="(Każdy rodzic pokrywa swoje wydatki bezpośrednio lub finansujemy wspólnie w określony sposób.)"
                selected={selectedOption === "shared"}
              />
            </RadioGroup>

            {/* Wyświetlanie błędu walidacji */}
            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex gap-3 pt-4">
              <Button variant="outline" className="flex-1" onClick={handleBack}>
                Wstecz
              </Button>
              <Button
                variant="alimatrix"
                className="flex-1"
                onClick={handleNext}
              >
                Dalej
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

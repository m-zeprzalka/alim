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

export default function PodstawaUstalen() {
  const router = useRouter();
  const { formData, updateFormData } = useFormStore();

  // Inicjalizacja stanu wybranej opcji z danych formularza (jeśli istnieją)
  const [selectedOption, setSelectedOption] = useState<string>(
    formData.podstawaUstalen || ""
  );

  // Stan dla pola "inne" szczegóły
  const [inneDetails, setInneDetails] = useState<string>(
    formData.podstawaUstalenInne || ""
  );

  // Stan błędu do walidacji
  const [error, setError] = useState<string | null>(null);

  // Efekt do sprawdzania zależności
  useEffect(() => {
    if (selectedOption) {
      setError(null);
    }
  }, [selectedOption]);
  // Funkcja do obsługi przejścia do następnego kroku
  const handleNext = () => {
    if (!selectedOption) {
      setError("Proszę wybrać jedną z opcji");
      return;
    }

    // Jeśli wybrano "inne" a pole szczegółów jest puste
    if (selectedOption === "inne" && !inneDetails.trim()) {
      setError("Proszę podać szczegóły dla wybranej opcji 'Inne'");
      return;
    }

    // Określamy kategorię podstawy ustaleń do użycia w kroku 9
    let wariantPostepu: "court" | "agreement" | "other" = "other"; // Domyślnie "inne"

    if (["zabezpieczenie", "wyrok", "ugoda-sad"].includes(selectedOption)) {
      wariantPostepu = "court"; // Wariant dla postępowania sądowego
    } else if (["mediacja", "prywatne"].includes(selectedOption)) {
      wariantPostepu = "agreement"; // Wariant dla porozumienia
    }

    // Zapisujemy wybrane dane do store'a
    updateFormData({
      podstawaUstalen: selectedOption,
      podstawaUstalenInne: selectedOption === "inne" ? inneDetails : "",
      wariantPostepu: wariantPostepu, // Zapisujemy kategorię do późniejszego użycia
    });

    // Przekierowanie do następnego kroku - zakładam, że będzie to strona z kolejnymi danymi
    router.push("/dzieci");
  };

  // Funkcja do obsługi powrotu do poprzedniego kroku
  const handleBack = () => {
    router.push("/finansowanie");
  };

  return (
    <main className="flex justify-center p-3">
      <Card className="w-full max-w-lg shadow-lg border-sky-100">
        <CardContent className="pt-2">
          <Logo size="large" />
          <FormProgress currentStep={3} totalSteps={12} />

          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">Podstawa ustaleń</h1>
              <InfoTooltip
                content={
                  <div className="space-y-2 text-sm">
                    <p>
                      Dlaczego o to pytamy? Typ ustaleń wpływa na trwałość i
                      pewność sytuacji prawnej.
                    </p>
                    <p>
                      Twoja odpowiedź pozwoli dopasować dalsze pytania do Twojej
                      sytuacji oraz zwiększyć precyzję Twojego raportu.
                    </p>
                  </div>
                }
              />
            </div>
            <p className="text-gray-700">
              Na jakiej podstawie zostały ustalone zasady finansowania potrzeb
              dziecka lub dzieci? (Wybierz opcję, która najlepiej oddaje Twoją
              sytuację.)
            </p>{" "}
            <RadioGroup
              value={selectedOption}
              onValueChange={(value) => {
                setSelectedOption(value);
                if (value !== "inne") {
                  setInneDetails("");
                }
              }}
              className="space-y-3"
            >
              <ClickableRadioOption
                value="zabezpieczenie"
                id="zabezpieczenie"
                label="Postanowienie zabezpieczające"
                description="(tymczasowe ustalenie przez sąd – np. na czas trwania sprawy rozwodowej lub rodzinnej)"
                selected={selectedOption === "zabezpieczenie"}
              />
              <ClickableRadioOption
                value="wyrok"
                id="wyrok"
                label="Wyrok rozwodowy lub wyrok w innej sprawie rodzinnej"
                description="(ostateczne rozstrzygnięcie sądu o alimentach)"
                selected={selectedOption === "wyrok"}
              />
              <ClickableRadioOption
                value="ugoda-sad"
                id="ugoda-sad"
                label="Porozumienie rodzicielskie zatwierdzone przez sąd"
                description="(rodzice sami ustalili zasady, a sąd je zatwierdził i nadał im moc prawną)"
                selected={selectedOption === "ugoda-sad"}
              />
              <ClickableRadioOption
                value="mediacja"
                id="mediacja"
                label="Porozumienie mediacyjne"
                description="(ustalenia zawarte podczas mediacji – z lub bez późniejszego zatwierdzenia przez sąd)"
                selected={selectedOption === "mediacja"}
              />
              <ClickableRadioOption
                value="prywatne"
                id="prywatne"
                label="Prywatne porozumienie bez zatwierdzenia przez sąd"
                description="(uzgodnienia między rodzicami, bez formalnej akceptacji sądowej)"
                selected={selectedOption === "prywatne"}
              />
              <ClickableRadioOption
                value="inne"
                id="inne"
                label="Inne"
                hasInput={selectedOption === "inne"}
                inputValue={inneDetails}
                onInputChange={setInneDetails}
                inputPlaceholder="Prosimy o krótki opis"
                selected={selectedOption === "inne"}
              />{" "}
            </RadioGroup>
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

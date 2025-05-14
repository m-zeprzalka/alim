"use client";

import { Logo } from "@/components/ui/custom/Logo";
import { FormProgress } from "@/components/ui/custom/FormProgress";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { InfoTooltip } from "@/components/ui/custom/InfoTooltip";
import { useFormStore } from "@/lib/store/form-store";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function WyborSciezki() {
  const router = useRouter();
  const { formData, updateFormData } = useFormStore();

  // Inicjalizacja stanu wybranej opcji z danych formularza (jeśli istnieją)
  const [selectedOption, setSelectedOption] = useState<string | null>(
    (formData.sciezkaWybor as string) || null
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

    // Zapisujemy wybraną ścieżkę do store'a
    updateFormData({
      sciezkaWybor: selectedOption as "established" | "not-established",
    });

    // Przekierowanie w zależności od wybranej ścieżki
    if (selectedOption === "established") {
      router.push("/podstawa-ustalen");
    } else {
      router.push("/alternatywna");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
      <Card className="w-full max-w-lg shadow-lg">
        <CardContent>
          <Logo size="medium" />
          <FormProgress currentStep={1} totalSteps={12} />
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-left text-sky-950">
                🔍 Na jakim etapie ustaleń dotyczących finansowania potrzeb
                dziecka jesteś?
              </h1>
              <p className="text-gray-600">
                Zanim przejdziesz dalej, odpowiedz proszę na jedno pytanie:
              </p>
              <p className="text-gray-600">
                Czy w Twojej sytuacji zostało już ustalone, w jaki sposób
                dzielicie się z drugim rodzicem kosztami wychowania dziecka lub
                dzieci?
              </p>

              <div className="mt-2 text-sm text-gray-500 bg-gray-50 p-3 rounded-md">
                <p>Takie ustalenia mogą przyjmować różne formy:</p>
                <ul className="list-disc list-inside mt-1">
                  <li>
                    orzeczenie sądu (np. postanowienie zabezpieczające, wyrok
                    rozwodowy),
                  </li>
                  <li>ugoda zawarta przed sądem lub mediatorem,</li>
                  <li>prywatne porozumienie między rodzicami,</li>
                  <li>
                    współmierne dzielenie się kosztami, bez formalnych
                    przelewów.
                  </li>
                </ul>
                <p className="mt-1">
                  W formularzu będziemy używać słowa &quot;alimenty&quot;,
                  ponieważ takie określenie stosuje prawo i praktyka sądowa –
                  nawet jeśli sposób finansowania potrzeb dziecka został
                  ustalony inaczej.
                </p>
              </div>
            </div>

            <div>
              <p className="font-semibold text-gray-700 mb-4">
                📌 Wybierz ścieżkę, która najlepiej opisuje Twoją sytuację:
              </p>

              <div className="space-y-4">
                {/* Opcja 1 */}
                <div
                  className={`flex items-start space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    selectedOption === "established"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                  onClick={() => setSelectedOption("established")}
                >
                  <Checkbox
                    id="established"
                    checked={selectedOption === "established"}
                    onCheckedChange={() => setSelectedOption("established")}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center">
                      <label
                        htmlFor="established"
                        className="font-medium cursor-pointer"
                      >
                        Zasady finansowania potrzeb dziecka są już ustalone
                      </label>
                      <InfoTooltip
                        content={
                          <div className="space-y-2 text-sm">
                            <p>
                              Twoje odpowiedzi – pseudonimizowane i przetwarzane
                              zgodnie z RODO – pomogą lepiej zrozumieć, jak w
                              praktyce wygląda finansowe wspieranie dzieci po
                              rozstaniu rodziców.
                            </p>
                            <p>
                              Jeśli znajdziesz się wśród pierwszych 1000 osób,
                              które wypełnią formularz, otrzymasz bezpłatnie
                              spersonalizowany raport.
                            </p>
                            <p>
                              Pokaże on, jak Twoja sytuacja wygląda na tle
                              innych przypadków – co może być pomocne, jeśli
                              zastanawiasz się, czy sposób finansowania potrzeb
                              dziecka jest adekwatny.
                            </p>
                          </div>
                        }
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Chcę wypełnić formularz i podzielić się informacjami o
                      swojej sytuacji.
                      <span className="block mt-1 text-blue-600 font-medium">
                        ➡️ Jeśli wybierzesz tę opcję, przejdziesz do pełnego
                        formularza AliMatrix.
                      </span>
                    </p>
                  </div>
                </div>

                {/* Opcja 2 */}
                <div
                  className={`flex items-start space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    selectedOption === "not-established"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                  onClick={() => setSelectedOption("not-established")}
                >
                  <Checkbox
                    id="not-established"
                    checked={selectedOption === "not-established"}
                    onCheckedChange={() => setSelectedOption("not-established")}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center">
                      <label
                        htmlFor="not-established"
                        className="font-medium cursor-pointer"
                      >
                        Zasady finansowania potrzeb dziecka nie zostały jeszcze
                        ustalone
                      </label>
                      <InfoTooltip
                        content={
                          <div className="space-y-2 text-sm">
                            <p>
                              Obecnie koncentrujemy się na zebraniu informacji
                              od osób, które już mają ustalone zasady
                              finansowego wsparcia dzieci.
                            </p>
                            <p>
                              Na tej podstawie powstaną pierwsze raporty, które
                              udostępnimy także osobom w Twojej sytuacji.
                            </p>
                            <p>
                              Jeśli chcesz otrzymać powiadomienie, gdy raporty
                              będą gotowe – możesz zostawić swój adres e-mail.
                              Dzięki temu jako pierwszy(a) dowiesz się o
                              możliwości skorzystania z wyników analizy.
                            </p>
                          </div>
                        }
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Chciał(a)bym dowiedzieć się, jak to może wyglądać.
                      <span className="block mt-1 text-blue-600 font-medium">
                        ➡️ Jeśli wybierzesz tę opcję, przekierujemy Cię do
                        krótszego formularza zapisu na powiadomienie.
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Wyświetlanie błędu walidacji */}
              {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
            </div>

            <div className="flex space-x-3 pt-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => router.push("/")}
              >
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

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
import { Checkbox } from "@/components/ui/checkbox";
import { useFormStore } from "@/lib/store/form-store";

export default function OpiekaWakacje() {
  const router = useRouter();
  const { formData, updateFormData } = useFormStore();

  // Funkcja scrollToTop zaimplementowana bezpośrednio w komponencie
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Inicjalizacja stanu dla aktualnego dziecka
  const [aktualneDzieckoId] = useState<number | null>(
    formData.aktualneDzieckoWTabeliCzasu || null
  );

  // Stan dla danych o opiece w okresach specjalnych (wakacje, święta, itp.)
  const [procentCzasu, setProcentCzasu] = useState<number>(50); // Domyślnie 50%
  const [szczegolowyPlan, setSzczegolowyPlan] = useState<boolean>(false);
  const [opisPlanu, setOpisPlanu] = useState<string>("");

  // Znajdź aktualne dziecko
  const aktualneDziecko = formData.dzieci?.find(
    (d) => d.id === aktualneDzieckoId
  );
  // Ładowanie zapisanych wcześniej danych dla aktualnego dziecka
  useEffect(() => {
    if (formData.dzieci && aktualneDzieckoId) {
      const dziecko = formData.dzieci.find((d) => d.id === aktualneDzieckoId);
      if (dziecko) {
        // Używamy type assertion do dostępu do właściwości
        const typedDziecko = dziecko as any;

        // Sprawdź, czy istnieją zapisane dane dla wakacjeProcentCzasu
        if (typedDziecko.wakacjeProcentCzasu !== undefined) {
          setProcentCzasu(typedDziecko.wakacjeProcentCzasu);
        }

        // Sprawdź, czy istnieją dane dla wakacjeSzczegolowyPlan
        if (typedDziecko.wakacjeSzczegolowyPlan !== undefined) {
          setSzczegolowyPlan(typedDziecko.wakacjeSzczegolowyPlan);
        }

        // Sprawdź, czy istnieją dane dla wakacjeOpisPlan
        if (typedDziecko.wakacjeOpisPlan) {
          setOpisPlanu(typedDziecko.wakacjeOpisPlan);
        }
      }
    }
  }, [formData.dzieci, aktualneDzieckoId]);
  // Funkcja do zapisywania danych i przechodzenia do następnego kroku
  const handleNext = () => {
    if (aktualneDzieckoId && formData.dzieci) {
      const zaktualizowaneDzieci = formData.dzieci.map((dziecko) => {
        if (dziecko.id === aktualneDzieckoId) {
          return {
            ...dziecko,
            // Używamy rozszerzonego typu przy zapisie
            ...({
              wakacjeProcentCzasu: procentCzasu,
              wakacjeSzczegolowyPlan: szczegolowyPlan,
              wakacjeOpisPlan: szczegolowyPlan ? opisPlanu : undefined,
            } as any),
          };
        }
        return dziecko;
      });

      updateFormData({
        dzieci: zaktualizowaneDzieci,
      });
    }

    // Przewiń stronę do góry
    scrollToTop(); // Przejdź do następnego kroku
    router.push("/koszty-utrzymania");
  }; // Funkcja do powrotu do poprzedniego kroku
  const handleBack = () => {
    if (aktualneDzieckoId && formData.dzieci) {
      const zaktualizowaneDzieci = formData.dzieci.map((dziecko) => {
        if (dziecko.id === aktualneDzieckoId) {
          return {
            ...dziecko,
            // Używamy rozszerzonego typu przy zapisie
            ...({
              wakacjeProcentCzasu: procentCzasu,
              wakacjeSzczegolowyPlan: szczegolowyPlan,
              wakacjeOpisPlan: szczegolowyPlan ? opisPlanu : undefined,
            } as any),
          };
        }
        return dziecko;
      });

      updateFormData({
        dzieci: zaktualizowaneDzieci,
      });
    }

    // Przewiń stronę do góry
    scrollToTop();

    // Wróć do strony czasu opieki
    router.push("/czas-opieki");
  };

  // Jeśli nie ma aktualnego dziecka, pokaż komunikat ładowania
  if (!aktualneDziecko) {
    return (
      <main className="flex justify-center p-3">
        <Card className="w-full max-w-lg shadow-lg border-sky-100">
          <CardContent className="pt-2">
            <Logo size="large" />
            <FormProgress currentStep={7} totalSteps={12} />
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">
                  Opieka w okresach specjalnych
                </h1>
                <InfoTooltip
                  content={
                    <div className="space-y-2 text-sm">
                      <p>
                        Dane o opiece w okresach takich jak wakacje i święta są
                        ważne dla właściwego określenia zakresu opieki i potrzeb
                        dziecka.
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
          <FormProgress currentStep={7} totalSteps={12} />
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">
                Opieka w okresach specjalnych
              </h1>
              <InfoTooltip
                content={
                  <div className="space-y-2 text-sm">
                    <p>
                      Dane o opiece w okresach takich jak wakacje i święta
                      pomagają dokładniej określić zakres Twojej opieki nad
                      dzieckiem.
                    </p>
                  </div>
                }
              />
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="font-medium">
                Wypełniasz dane dla Dziecka {aktualneDziecko.id} (
                {aktualneDzieckoId &&
                  formData.dzieci &&
                  formData.dzieci.findIndex((d) => d.id === aktualneDzieckoId) +
                    1}
                /{formData.dzieci?.length || 0}) - {aktualneDziecko.wiek} lat
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="font-medium text-lg">
                Jak wygląda opieka nad dzieckiem w okresach takich jak wakacje,
                ferie, święta i długie weekendy?
              </h2>
              <p className="text-sm text-gray-600">
                Podaj szacunkowo, jaki procent tego czasu dziecko spędza z Tobą.
                Uwzględnij typowe zasady lub praktykę – nie musisz być
                precyzyjny. Jeśli podział jest nieregularny, wskaż średni
                udział. Jeśli masz sztywne ustalenia i chcesz je wpisać –
                zaznacz opcję poniżej.
              </p>

              <div className="py-4">
                <div className="mb-2 text-center font-medium">
                  Twoja ocena: {procentCzasu}%
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm">0%</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={procentCzasu}
                    onChange={(e) => setProcentCzasu(parseInt(e.target.value))}
                    className="flex-grow h-2 rounded-lg appearance-none cursor-pointer bg-gray-200"
                  />
                  <span className="text-sm">100%</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>dziecko zawsze z drugim rodzicem</span>
                  <span>mniej więcej po równo</span>
                  <span>dziecko zawsze z Tobą</span>
                </div>
              </div>

              <div className="mt-6 flex items-start space-x-2">
                <Checkbox
                  id="szczegolowy-plan"
                  checked={szczegolowyPlan}
                  onCheckedChange={(checked) =>
                    setSzczegolowyPlan(checked as boolean)
                  }
                />
                <div className="grid gap-1.5 leading-none">
                  <Label
                    htmlFor="szczegolowy-plan"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Mam szczegółowe ustalenia – chcę wpisać je ręcznie
                  </Label>
                </div>
              </div>

              {szczegolowyPlan && (
                <div className="mt-4">
                  <Label htmlFor="opis-planu" className="text-sm">
                    Opisz szczegółowe ustalenia
                  </Label>
                  <textarea
                    id="opis-planu"
                    value={opisPlanu}
                    onChange={(e) => setOpisPlanu(e.target.value)}
                    placeholder='Np. "W wakacje 2 tygodnie ze mną, 4 z drugim rodzicem. Święta naprzemiennie - Wigilia u mnie, pierwszy dzień u drugiego rodzica."'
                    className="mt-1 w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]"
                  />
                </div>
              )}
            </div>

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

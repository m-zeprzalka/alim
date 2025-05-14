"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/ui/custom/Logo";
import { FormProgress } from "@/components/ui/custom/FormProgress";
import { InfoTooltip } from "@/components/ui/custom/InfoTooltip";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useFormStore } from "@/lib/store/form-store";

export default function PostepowanieInne() {
  const router = useRouter();
  const { formData, updateFormData } = useFormStore();

  // Stan oceny adekwatności ustaleń
  const [ocenaAdekwatnosci, setOcenaAdekwatnosci] = useState<number>(
    formData.ocenaAdekwatnosciInne || 3
  );

  // Funkcja obsługująca przejście do następnego kroku
  const handleNext = () => {
    // Zapisujemy dane do store'a
    updateFormData({
      ocenaAdekwatnosciInne: ocenaAdekwatnosci,
    });

    // Przekierowanie do następnego kroku
    router.push("/dochody");
  };

  // Funkcja obsługująca powrót do poprzedniego kroku
  const handleBack = () => {
    router.push("/dzieci");
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
      <Card className="w-full max-w-lg shadow-lg">
        <CardContent className="pt-6">
          <div className="flex justify-center mb-6">
            <Logo size="medium" />
          </div>
          <FormProgress currentStep={9} totalSteps={12} />

          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">
                Ustalenia tymczasowe, ustne lub jednostronne
              </h1>
              <InfoTooltip
                content={
                  <div className="space-y-2 text-sm">
                    <p>
                      Twoja ocena pomoże zrozumieć, jak nieformalne lub
                      jednostronne ustalenia wpływają na finansowanie potrzeb
                      dzieci.
                    </p>
                  </div>
                }
              />
            </div>

            <div className="space-y-4">
              <label className="block">
                <span className="block mb-2">
                  Jak oceniasz adekwatność obecnego sposobu finansowania potrzeb
                  dziecka?
                </span>
                <div className="text-sm text-gray-600 mb-2">
                  Oceń w skali 1–5, gdzie 1 oznacza „zupełnie nieadekwatny", a 5
                  „w pełni adekwatny"
                </div>

                <div className="relative py-5">
                  <div className="flex justify-between mb-1">
                    <span>1</span>
                    <span>2</span>
                    <span>3</span>
                    <span>4</span>
                    <span>5</span>
                  </div>

                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="1"
                    value={ocenaAdekwatnosci}
                    onChange={(e) =>
                      setOcenaAdekwatnosci(parseInt(e.target.value))
                    }
                    className="w-full"
                  />

                  <div className="flex justify-center mt-4">
                    <span className="font-semibold text-lg">
                      Twoja ocena: {ocenaAdekwatnosci}
                    </span>
                  </div>
                </div>
              </label>
            </div>

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

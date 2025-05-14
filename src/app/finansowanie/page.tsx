"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useFormStore } from "@/lib/store/form-store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Finansowanie() {
  const router = useRouter();
  const { formData } = useFormStore();
  // Zabezpieczenie - sprawdzamy czy użytkownik przeszedł przez wybór ścieżki
  useEffect(() => {
    if (!formData.sciezkaWybor) {
      router.push("/sciezka");
    }
  }, [formData.sciezkaWybor, router]);

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
      <Card className="w-full max-w-lg shadow-lg">
        <CardContent className="pt-6">
          <div className="space-y-6">
            <h1 className="text-2xl font-bold">
              Sposób finansowania potrzeb dziecka
            </h1>
            <p className="text-gray-600">
              Ta strona jest w trakcie implementacji. Tutaj znajdzie się kolejny
              krok formularza.
            </p>

            <div className="flex space-x-3">
              {" "}
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => router.push("/koszty-utrzymania")}
              >
                Wstecz
              </Button>
              <Button className="flex-1" onClick={() => router.push("/")}>
                Strona główna
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

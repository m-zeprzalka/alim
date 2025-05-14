"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFormStore } from "@/lib/store/form-store";

export default function Postepowanie() {
  const router = useRouter();
  const { formData } = useFormStore();

  // Efekt kierujący do odpowiedniego wariantu na podstawie wcześniejszego wyboru
  useEffect(() => {
    // Sprawdzamy, czy mamy informację o wariancie
    if (!formData.wariantPostepu) {
      // Jeśli nie ma informacji o wariancie, przekierowujemy do strony podstawy ustaleń
      router.push("/podstawa-ustalen");
      return;
    }

    // Przekierowujemy do odpowiedniego wariantu
    switch (formData.wariantPostepu) {
      case "court":
        router.push("/postepowanie/sadowe");
        break;
      case "agreement":
        router.push("/postepowanie/porozumienie");
        break;
      case "other":
        router.push("/postepowanie/inne");
        break;
      default:
        // W razie nieprawidłowych danych, wracamy do podstawy ustaleń
        router.push("/podstawa-ustalen");
    }
  }, [formData.wariantPostepu, router]);

  // Ten komponent nie renderuje żadnego UI, służy tylko do przekierowania
  return null;
}

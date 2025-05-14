import { create } from "zustand";
import { persist } from "zustand/middleware";

// Rozszerzona definicja typów dla danych formularza
export type FormData = {
  // Krok 1: Wybór ścieżki
  sciezkaWybor?: "established" | "not-established";

  // Dane dla ścieżki alternatywnej
  alternativeEmail?: string;
  alternativeConsent?: boolean;

  // Krok 3: Podstawa ustaleń
  podstawaUstalen?: string;
  podstawaUstalenInne?: string;

  // Krok 4: Dzieci
  liczbaDzieci?: number;
  dzieci?: {
    id: number;
    wiek: number;
    plec: "K" | "M";
    specjalnePotrzeby: boolean;
    opisSpecjalnychPotrzeb?: string;
  }[];
};

// Definicja interfejsu dla store'a
interface FormStore {
  // Dane formularza
  formData: FormData;

  // Akcje
  updateFormData: (data: Partial<FormData>) => void;
  resetForm: () => void;
}

// Tworzymy store z użyciem persist middleware do zapisywania w localStorage
export const useFormStore = create<FormStore>()(
  persist(
    (set) => ({
      formData: {},

      updateFormData: (data) =>
        set((state) => ({
          formData: { ...state.formData, ...data },
        })),

      resetForm: () => set({ formData: {} }),
    }),
    {
      name: "alimatrix-form-storage",
    }
  )
);

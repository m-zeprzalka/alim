import { create } from "zustand";
import { persist } from "zustand/middleware";

// Definiujemy typy dla danych formularza
export type FormData = {
  // Krok 1: Wybór ścieżki
  sciezkaWybor?: "established" | "not-established";

  // W przyszłości dodamy tu więcej pól
};

// Definiujemy interfejs dla store'a
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

import { create } from "zustand";
import { persist } from "zustand/middleware";

// Rozszerzona definicja typów dla danych formularza
export type FormData = {
  // Krok 1: Wybór ścieżki
  sciezkaWybor?: "established" | "not-established";

  // Dane dla ścieżki alternatywnej
  alternativeEmail?: string;
  alternativeConsent?: boolean; // Krok 3: Podstawa ustaleń
  podstawaUstalen?: string;
  podstawaUstalenInne?: string;
  wariantPostepu?: "court" | "agreement" | "other"; // Kategoria dla kroku 9

  // Krok 9: Oceny adekwatności postępowania
  ocenaAdekwatnosciSad?: number;
  ocenaAdekwatnosciPorozumienie?: number;
  ocenaAdekwatnosciInne?: number;

  // Krok 4: Dzieci
  liczbaDzieci?: number;
  dzieci?: {
    id: number;
    wiek: number;
    plec: "K" | "M";
    specjalnePotrzeby: boolean;
    opisSpecjalnychPotrzeb?: string;
    modelOpieki?: "50/50" | "inny";
    // Dane związane z tabelą czasu opieki (tylko dla modelu "inny")
    cyklOpieki?: "1" | "2" | "4" | "custom"; // co tydzień, co 2 tygodnie, co 4 tygodnie, brak stałego schematu
    tabelaCzasu?: {
      [dzienTygodnia: string]: {
        // "pn", "wt", "sr", "cz", "pt", "sb", "nd"
        poranek: number;
        placowkaEdukacyjna: number;
        czasPoEdukacji: number;
        senURodzica: number;
      };
    };
  }[];

  // Stan aktualnego dziecka w tabeli czasu
  aktualneDzieckoWTabeliCzasu?: number;

  // Krok 7: Koszty utrzymania dzieci
  kosztyDzieci?: {
    id: number;
    kwotaAlimentow: number;
    twojeMiesieczneWydatki: number;
    wydatkiDrugiegoRodzica?: number;
    kosztyUznanePrzezSad?: number;
    inneZrodlaUtrzymania: {
      rentaRodzinna: boolean;
      swiadczeniePielegnacyjne: boolean;
      inne: boolean;
      inneOpis?: string;
      brakDodatkowychZrodel: boolean;
    };
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

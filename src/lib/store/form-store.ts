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
  wariantPostepu?: "court" | "agreement" | "other"; // Kategoria dla kroku 9

  // Krok 4: Sposób finansowania potrzeb dziecka
  sposobFinansowania?: "i-pay" | "i-receive" | "shared";

  // Krok 9: Oceny adekwatności postępowania
  ocenaAdekwatnosciSad?: number;
  ocenaAdekwatnosciPorozumienie?: number;
  ocenaAdekwatnosciInne?: number;
  // Krok 9: Dane postępowania sądowego
  dataDecyzjiSad?: string;
  rokDecyzjiSad?: string;
  miesiacDecyzjiSad?: string;
  rodzajSaduSad?: "rejonowy" | "okregowy" | "nie_pamietam";
  apelacjaSad?: string;
  sadOkregowyId?: string;
  sadRejonowyId?: string;
  liczbaSedzi?: "jeden" | "trzech";
  plecSedziego?: "kobieta" | "mezczyzna";
  inicjalySedziego?: string;
  czyPozew?: "tak" | "nie";
  watekWiny?: "nie" | "tak-ja" | "tak-druga-strona" | "tak-oboje";

  // Krok 9: Dane porozumienia
  dataPorozumienia?: string;
  sposobPorozumienia?: string;
  formaPorozumienia?: string;
  klauzulaWaloryzacyjna?: string;
  // Krok 9: Dane ustaleń innych
  dataUstalenInnych?: string;
  uzgodnienieFinansowania?: string;
  planyWystapieniaDoSadu?: string;

  // Krok 10: Dane demograficzne - użytkownik
  plecUzytkownika?: string;
  wiekUzytkownika?: string;
  wojewodztwoUzytkownika?: string;
  miejscowoscUzytkownika?: string;
  stanCywilnyUzytkownika?: string;
  // Krok 10: Dane demograficzne - drugi rodzic
  plecDrugiegoRodzica?: string;
  wiekDrugiegoRodzica?: string;
  wojewodztwoDrugiegoRodzica?: string;
  miejscowoscDrugiegoRodzica?: string;

  // Krok 11: Dane kontaktowe i zgody
  contactEmail?: string;
  zgodaPrzetwarzanie?: boolean;
  zgodaKontakt?: boolean;
  // Krok 4: Dzieci
  liczbaDzieci?: number;
  dzieci?: {
    id: number;
    wiek: number;
    plec: "K" | "M" | "I"; // Updated to include "I" (Inna / wolę nie podawać)
    specjalnePotrzeby: boolean;
    opisSpecjalnychPotrzeb?: string;
    uczeszczeDoPlacowki?: boolean;
    typPlacowki?:
      | "zlobek"
      | "przedszkole"
      | "podstawowa"
      | "ponadpodstawowa"
      | "";
    opiekaInnejOsoby?: boolean | null;
    modelOpieki?: "50/50" | "inny"; // Dane związane z tabelą czasu opieki (tylko dla modelu "inny")
    cyklOpieki?: "1" | "2" | "4" | "custom"; // co tydzień, co 2 tygodnie, co 4 tygodnie, brak stałego schematu
    procentCzasuOpieki?: number; // procentowy udział czasu opieki rodzica wypełniającego formularz
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

  // Krok 8: Dochody i koszty życia rodziców
  dochodyRodzicow?: {
    wlasne: {
      oficjalneDochodyNetto: number;
      potencjalDochodowy: number;
      kosztyUtrzymaniaSiebie: number;
      kosztyUtrzymaniaInnychOsob: number;
      dodatkoweZobowiazania: number;
    };
    drugiRodzic: {
      oficjalneDochodyNetto: number;
      potencjalDochodowy: number;
      kosztyUtrzymaniaSiebie: number;
      kosztyUtrzymaniaInnychOsob: number;
      dodatkoweZobowiazania: number;
    };
  };
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

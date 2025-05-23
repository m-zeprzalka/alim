// filepath: c:\ALIMATRIX\alimatrix\src\lib\store\form-store.d.ts

// Augmentation for the FormData interface in form-store.ts
declare module "@/lib/store/form-store" {
  export interface FormData {
    dzieci?: {
      id: number;
      wiek: number;
      plec: "K" | "M" | "I";
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
      modelOpieki?: "50/50" | "inny";
      cyklOpieki?: "1" | "2" | "4" | "custom";
      procentCzasuOpieki?: number;
      tabelaCzasu?: {
        [dzienTygodnia: string]: {
          poranek: number;
          placowkaEdukacyjna: number;
          czasPoEdukacji: number;
          senURodzica: number;
          senUDrugiegoRodzica: number;
        };
      };
      wskaznikiCzasuOpieki?: {
        czasOpiekiBezEdukacji: number;
        czasAktywnejOpieki: number;
        czasSnu: number;
      };
      // Dane o kosztach utrzymania i źródłach finansowania
      kwotaAlimentow?: number;
      twojeMiesieczneWydatki?: number;
      wydatkiDrugiegoRodzica?: number;
      kosztyUznanePrzezSad?: number;
      inneZrodlaUtrzymania?: {
        rentaRodzinna: boolean;
        rentaRodzinnaKwota?: number;
        swiadczeniePielegnacyjne: boolean;
        swiadczeniePielegnacyjneKwota?: number;
        inne: boolean;
        inneOpis?: string;
        inneKwota?: number;
        brakDodatkowychZrodel: boolean;
      };
      // Dane dot. opieki w okresach specjalnych (wakacje, ferie, święta)
      wakacjeProcentCzasu?: number;
      wakacjeSzczegolowyPlan?: boolean;
      wakacjeOpisPlan?: string;
    }[];
    aktualneDzieckoWTabeliCzasu?: number;
    kosztyDzieci?: {
      id: number;
      kwotaAlimentow: number;
      twojeMiesieczneWydatki: number;
      wydatkiDrugiegoRodzica?: number;
      kosztyUznanePrzezSad?: number;
      inneZrodlaUtrzymania: {
        rentaRodzinna: boolean;
        rentaRodzinnaKwota?: number;
        swiadczeniePielegnacyjne: boolean;
        swiadczeniePielegnacyjneKwota?: number;
        inne: boolean;
        inneOpis?: string;
        inneKwota?: number;
        brakDodatkowychZrodel: boolean;
      };
    }[];
  }
}

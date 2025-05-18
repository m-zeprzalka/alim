// Typowanie dla danych kosztów utrzymania

export interface InneZrodlaUtrzymania {
  rentaRodzinna: boolean;
  rentaRodzinnaKwota: number | "";
  swiadczeniePielegnacyjne: boolean;
  swiadczeniePielegnacyjneKwota: number | "";
  inne: boolean;
  inneOpis: string;
  inneKwota: number | "";
  brakDodatkowychZrodel: boolean;
}

export interface KosztyDziecka {
  id: number;
  kwotaAlimentow: number | "";
  twojeMiesieczneWydatki: number | "";
  wydatkiDrugiegoRodzica: number | "";
  kosztyUznanePrzezSad: number | "";
  inneZrodlaUtrzymania: InneZrodlaUtrzymania;
}

export interface KosztyDzieckaFormData {
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
}

export interface KosztyUtrzymaniaData {
  [dzieckoId: number]: KosztyDzieckaFormData;
}

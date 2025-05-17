// Typowanie dla tabeli czasu opieki
export interface TabelaCzasu {
  [dzien: string]: {
    poranek: number;
    placowkaEdukacyjna: number;
    czasPoEdukacji: number;
    senURodzica: number;
    senUDrugiegoRodzica: number;
  };
}

// Typowanie dla wskaźników czasu opieki
export interface WskaznikiCzasuOpieki {
  czasOpiekiBezEdukacji: number;
  czasAktywnejOpieki: number;
  czasSnu: number;
}

// Rozszerzone typowanie dla dziecka
export interface Dziecko {
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
  tabelaCzasu?: TabelaCzasu;
  wskaznikiCzasuOpieki?: WskaznikiCzasuOpieki;
}

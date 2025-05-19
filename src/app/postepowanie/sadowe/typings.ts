// Typy dla formularza postępowania sądowego

// Rodzaj sądu
export type RodzajSadu = "rejonowy" | "okregowy" | "nie_pamietam";

// Liczba sędziów
export type LiczbaSedzi = "jeden" | "trzech";

// Płeć sędziego
export type PlecSedziego = "kobieta" | "mezczyzna";

// Odpowiedź tak/nie
export type TakNie = "tak" | "nie";

// Wątek winy
export type WatekWiny = "nie" | "tak-ja" | "tak-druga-strona" | "tak-oboje";

// Wariant postępu
export type WariantPostepu = "court" | "agreement" | "other";

// Główny interfejs danych postępowania sądowego
export interface PostepowanieSadoweData {
  ocenaAdekwatnosciSad: number;
  wariantPostepu: WariantPostepu;
  rokDecyzjiSad: string;
  miesiacDecyzjiSad: string;
  rodzajSaduSad: RodzajSadu;
  apelacjaSad: string;
  apelacjaId?: string; // Dla kompatybilności z nowym schematem
  apelacjaNazwa?: string; // Nazwa apelacji
  sadOkregowyId: string;
  sadOkregowyNazwa?: string; // Nazwa sądu okręgowego
  sadRejonowyId: string;
  sadRejonowyNazwa?: string; // Nazwa sądu rejonowego
  liczbaSedzi: LiczbaSedzi;
  plecSedziego: PlecSedziego;
  inicjalySedziego: string;
  czyPozew: TakNie;
  watekWiny: WatekWiny;
}

// Interfejs dla formularza z dodatkowymi opcjonalnymi polami
export interface PostepowanieSadoweFormData extends PostepowanieSadoweData {
  // Dodatkowe pola formularzowe, jeśli potrzebne
}

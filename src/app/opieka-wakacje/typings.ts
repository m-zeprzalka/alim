// Typowanie dla danych opieki w okresach specjalnych

export interface OpiekeWakacjeData {
  wakacjeProcentCzasu: number;
  wakacjeSzczegolowyPlan: boolean;
  wakacjeOpisPlan?: string;
}

export interface WakacjeOpiekaData {
  [dzieckoId: number]: OpiekeWakacjeData;
}

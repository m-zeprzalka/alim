// Typowanie dla danych opieki w okresach specjalnych

export interface OpiekeWakacjeData {
  procentCzasu: number;
  szczegolowyPlan: boolean;
  opisPlanu?: string;
}

export interface WakacjeOpiekaData {
  [dzieckoId: number]: OpiekeWakacjeData;
}

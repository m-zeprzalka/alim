// Dane sądów w Polsce - zaczerpnięte z pliku WŁAŚCIWOŚĆ_SĄDÓW_POWSZECHNYCH_luty_2025.xls

export type Court = {
  id: string;
  name: string;
};

export type DistrictCourt = Court & {
  districtCourtId: string;
};

export type Appellation = {
  id: string;
  name: string;
  districtCourts: Court[];
};

export const APPELATIONS: Appellation[] = [
  {
    id: "bialystok",
    name: "Apelacja Białostocka",
    districtCourts: [
      { id: "bialystok", name: "Sąd Okręgowy w Białymstoku" },
      { id: "lomza", name: "Sąd Okręgowy w Łomży" },
      { id: "olsztyn", name: "Sąd Okręgowy w Olsztynie" },
      { id: "suwalki", name: "Sąd Okręgowy w Suwałkach" },
    ],
  },
  {
    id: "gdansk",
    name: "Apelacja Gdańska",
    districtCourts: [
      { id: "elblag", name: "Sąd Okręgowy w Elblągu" },
      { id: "gdansk", name: "Sąd Okręgowy w Gdańsku" },
      { id: "slupsk", name: "Sąd Okręgowy w Słupsku" },
    ],
  },
  {
    id: "katowice",
    name: "Apelacja Katowicka",
    districtCourts: [
      { id: "bielsko-biala", name: "Sąd Okręgowy w Bielsku-Białej" },
      { id: "czestochowa", name: "Sąd Okręgowy w Częstochowie" },
      { id: "gliwice", name: "Sąd Okręgowy w Gliwicach" },
      { id: "katowice", name: "Sąd Okręgowy w Katowicach" },
      { id: "rybnik", name: "Sąd Okręgowy w Rybniku" },
    ],
  },
  {
    id: "krakow",
    name: "Apelacja Krakowska",
    districtCourts: [
      { id: "kielce", name: "Sąd Okręgowy w Kielcach" },
      { id: "krakow", name: "Sąd Okręgowy w Krakowie" },
      { id: "nowy-sacz", name: "Sąd Okręgowy w Nowym Sączu" },
      { id: "tarnow", name: "Sąd Okręgowy w Tarnowie" },
    ],
  },
  {
    id: "lublin",
    name: "Apelacja Lubelska",
    districtCourts: [
      { id: "lublin", name: "Sąd Okręgowy w Lublinie" },
      { id: "radom", name: "Sąd Okręgowy w Radomiu" },
      { id: "siedlce", name: "Sąd Okręgowy w Siedlcach" },
      { id: "zamosc", name: "Sąd Okręgowy w Zamościu" },
    ],
  },
  {
    id: "lodz",
    name: "Apelacja Łódzka",
    districtCourts: [
      { id: "kalisz", name: "Sąd Okręgowy w Kaliszu" },
      { id: "lodz", name: "Sąd Okręgowy w Łodzi" },
      {
        id: "piotrkow-trybunalski",
        name: "Sąd Okręgowy w Piotrkowie Trybunalskim",
      },
      { id: "plock", name: "Sąd Okręgowy w Płocku" },
      { id: "sieradz", name: "Sąd Okręgowy w Sieradzu" },
    ],
  },
  {
    id: "poznan",
    name: "Apelacja Poznańska",
    districtCourts: [
      { id: "konin", name: "Sąd Okręgowy w Koninie" },
      { id: "poznan", name: "Sąd Okręgowy w Poznaniu" },
      { id: "zielona-gora", name: "Sąd Okręgowy w Zielonej Górze" },
    ],
  },
  {
    id: "rzeszow",
    name: "Apelacja Rzeszowska",
    districtCourts: [
      { id: "krosno", name: "Sąd Okręgowy w Krośnie" },
      { id: "przemysl", name: "Sąd Okręgowy w Przemyślu" },
      { id: "rzeszow", name: "Sąd Okręgowy w Rzeszowie" },
      { id: "tarnobrzeg", name: "Sąd Okręgowy w Tarnobrzegu" },
    ],
  },
  {
    id: "szczecin",
    name: "Apelacja Szczecińska",
    districtCourts: [
      {
        id: "gorzow-wielkopolski",
        name: "Sąd Okręgowy w Gorzowie Wielkopolskim",
      },
      { id: "koszalin", name: "Sąd Okręgowy w Koszalinie" },
      { id: "szczecin", name: "Sąd Okręgowy w Szczecinie" },
    ],
  },
  {
    id: "warszawa",
    name: "Apelacja Warszawska",
    districtCourts: [
      { id: "warszawa", name: "Sąd Okręgowy w Warszawie" },
      { id: "warszawa-praga", name: "Sąd Okręgowy Warszawa-Praga w Warszawie" },
    ],
  },
  {
    id: "wroclaw",
    name: "Apelacja Wrocławska",
    districtCourts: [
      { id: "jelenia-gora", name: "Sąd Okręgowy w Jeleniej Górze" },
      { id: "legnica", name: "Sąd Okręgowy w Legnicy" },
      { id: "opole", name: "Sąd Okręgowy w Opolu" },
      { id: "swidnica", name: "Sąd Okręgowy w Świdnicy" },
      { id: "wroclaw", name: "Sąd Okręgowy we Wrocławiu" },
    ],
  },
];

// Sądy Rejonowe przypisane do odpowiednich Sądów Okręgowych
export const REGIONAL_COURTS: Record<string, DistrictCourt[]> = {
  // Przykładowe dane dla kilku sądów okręgowych
  bialystok: [
    {
      id: "bialystok",
      name: "Sąd Rejonowy w Białymstoku",
      districtCourtId: "bialystok",
    },
    {
      id: "bielsk-podlaski",
      name: "Sąd Rejonowy w Bielsku Podlaskim",
      districtCourtId: "bialystok",
    },
    {
      id: "sokolka",
      name: "Sąd Rejonowy w Sokółce",
      districtCourtId: "bialystok",
    },
  ],
  warszawa: [
    {
      id: "warszawa-srodmiescie",
      name: "Sąd Rejonowy dla Warszawy-Śródmieścia",
      districtCourtId: "warszawa",
    },
    {
      id: "warszawa-mokotow",
      name: "Sąd Rejonowy dla Warszawy-Mokotowa",
      districtCourtId: "warszawa",
    },
    {
      id: "warszawa-wola",
      name: "Sąd Rejonowy dla Warszawy-Woli",
      districtCourtId: "warszawa",
    },
    {
      id: "warszawa-zoliborz",
      name: "Sąd Rejonowy dla Warszawy-Żoliborza",
      districtCourtId: "warszawa",
    },
  ],
  krakow: [
    {
      id: "krakow-krowodrza",
      name: "Sąd Rejonowy dla Krakowa-Krowodrzy",
      districtCourtId: "krakow",
    },
    {
      id: "krakow-nowa-huta",
      name: "Sąd Rejonowy dla Krakowa-Nowej Huty",
      districtCourtId: "krakow",
    },
    {
      id: "krakow-podgorze",
      name: "Sąd Rejonowy dla Krakowa-Podgórza",
      districtCourtId: "krakow",
    },
    {
      id: "krakow-srodmiescie",
      name: "Sąd Rejonowy dla Krakowa-Śródmieścia",
      districtCourtId: "krakow",
    },
  ],
  // W pełnej implementacji należy dodać wszystkie sądy rejonowe dla każdego sądu okręgowego
  // zgodnie z aktualną strukturą w Polsce
};

// Funkcja pomocnicza do wyszukiwania sądów rejonowych dla danego sądu okręgowego
export function getRegionalCourts(districtCourtId: string): DistrictCourt[] {
  return REGIONAL_COURTS[districtCourtId] || [];
}

// Funkcja pomocnicza do wyszukiwania sądu okręgowego po ID
export function getDistrictCourt(
  appellationId: string,
  districtCourtId: string
): Court | undefined {
  const appellation = APPELATIONS.find((a) => a.id === appellationId);
  return appellation?.districtCourts.find((c) => c.id === districtCourtId);
}

// Funkcja pomocnicza do wyszukiwania apelacji po ID
export function getAppellation(appellationId: string): Appellation | undefined {
  return APPELATIONS.find((a) => a.id === appellationId);
}

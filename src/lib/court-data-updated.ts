// Dane sądów w Polsce - zaczerpnięte z pliku sady-powszechne-json.json (luty 2025)

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

// Funkcja konwertująca nazwę na ID (slug) - usuwająca polskie znaki, zamieniająca spacje na myślniki i obniżająca wszystkie litery
function convertToId(name: string): string {
  return name
    .toLowerCase()
    .replace(/ą/g, "a")
    .replace(/ć/g, "c")
    .replace(/ę/g, "e")
    .replace(/ł/g, "l")
    .replace(/ń/g, "n")
    .replace(/ó/g, "o")
    .replace(/ś/g, "s")
    .replace(/ź/g, "z")
    .replace(/ż/g, "z")
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]/g, "");
}

export const APPELATIONS: Appellation[] = [
  {
    id: "bialystok",
    name: "Apelacja Białostocka",
    districtCourts: [
      { id: "bialystok", name: "Sąd Okręgowy w Białymstoku" },
      { id: "lomza", name: "Sąd Okręgowy w Łomży" },
      { id: "olsztyn", name: "Sąd Okręgowy w Olsztynie" },
      { id: "ostroleka", name: "Sąd Okręgowy w Ostrołęce" },
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
  // Apelacja Białostocka
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
  lomza: [
    { id: "lomza", name: "Sąd Rejonowy w Łomży", districtCourtId: "lomza" },
    {
      id: "grajewo",
      name: "Sąd Rejonowy w Grajewie",
      districtCourtId: "lomza",
    },
    {
      id: "wysokie-mazowieckie",
      name: "Sąd Rejonowy w Wysokiem Mazowieckiem",
      districtCourtId: "lomza",
    },
    {
      id: "zambrow",
      name: "Sąd Rejonowy w Zambrowie",
      districtCourtId: "lomza",
    },
  ],
  olsztyn: [
    {
      id: "bartoszyce",
      name: "Sąd Rejonowy w Bartoszycach",
      districtCourtId: "olsztyn",
    },
    {
      id: "biskupiec",
      name: "Sąd Rejonowy w Biskupcu",
      districtCourtId: "olsztyn",
    },
    {
      id: "dzialdowo",
      name: "Sąd Rejonowy w Działdowie",
      districtCourtId: "olsztyn",
    },
    {
      id: "kętrzyn",
      name: "Sąd Rejonowy w Kętrzynie",
      districtCourtId: "olsztyn",
    },
    {
      id: "lidzbark-warminski",
      name: "Sąd Rejonowy w Lidzbarku Warmińskim",
      districtCourtId: "olsztyn",
    },
    {
      id: "mrągowo",
      name: "Sąd Rejonowy w Mrągowie",
      districtCourtId: "olsztyn",
    },
    {
      id: "nidzica",
      name: "Sąd Rejonowy w Nidzicy",
      districtCourtId: "olsztyn",
    },
    {
      id: "olsztyn",
      name: "Sąd Rejonowy w Olsztynie",
      districtCourtId: "olsztyn",
    },
    {
      id: "szczytno",
      name: "Sąd Rejonowy w Szczytnie",
      districtCourtId: "olsztyn",
    },
  ],
  ostroleka: [
    {
      id: "ostroleka",
      name: "Sąd Rejonowy w Ostrołęce",
      districtCourtId: "ostroleka",
    },
    {
      id: "ostrow-mazowiecka",
      name: "Sąd Rejonowy w Ostrowi Mazowieckiej",
      districtCourtId: "ostroleka",
    },
    {
      id: "przasnysz",
      name: "Sąd Rejonowy w Przasnyszu",
      districtCourtId: "ostroleka",
    },
    {
      id: "pultusk",
      name: "Sąd Rejonowy w Pułtusku",
      districtCourtId: "ostroleka",
    },
    {
      id: "wyszkow",
      name: "Sąd Rejonowy w Wyszkowie",
      districtCourtId: "ostroleka",
    },
  ],
  suwalki: [
    {
      id: "augustow",
      name: "Sąd Rejonowy w Augustowie",
      districtCourtId: "suwalki",
    },
    { id: "elk", name: "Sąd Rejonowy w Ełku", districtCourtId: "suwalki" },
    { id: "olecko", name: "Sąd Rejonowy w Olecku", districtCourtId: "suwalki" },
    { id: "pisz", name: "Sąd Rejonowy w Piszu", districtCourtId: "suwalki" },
    {
      id: "suwalki",
      name: "Sąd Rejonowy w Suwałkach",
      districtCourtId: "suwalki",
    },
  ],

  // Apelacja Gdańska
  elblag: [
    {
      id: "braniewo",
      name: "Sąd Rejonowy w Braniewie",
      districtCourtId: "elblag",
    },
    { id: "elblag", name: "Sąd Rejonowy w Elblągu", districtCourtId: "elblag" },
    { id: "ilawa", name: "Sąd Rejonowy w Iławie", districtCourtId: "elblag" },
    {
      id: "ostroda",
      name: "Sąd Rejonowy w Ostródzie",
      districtCourtId: "elblag",
    },
  ],
  gdansk: [
    {
      id: "gdansk-polnoc",
      name: "Sąd Rejonowy Gdańsk-Północ w Gdańsku",
      districtCourtId: "gdansk",
    },
    {
      id: "gdansk-poludnie",
      name: "Sąd Rejonowy Gdańsk-Południe w Gdańsku",
      districtCourtId: "gdansk",
    },
    { id: "gdynia", name: "Sąd Rejonowy w Gdyni", districtCourtId: "gdansk" },
    {
      id: "kartuzy",
      name: "Sąd Rejonowy w Kartuzach",
      districtCourtId: "gdansk",
    },
    {
      id: "koscierzyna",
      name: "Sąd Rejonowy w Kościerzynie",
      districtCourtId: "gdansk",
    },
    {
      id: "kwidzyn",
      name: "Sąd Rejonowy w Kwidzynie",
      districtCourtId: "gdansk",
    },
    {
      id: "malbork",
      name: "Sąd Rejonowy w Malborku",
      districtCourtId: "gdansk",
    },
    { id: "sopot", name: "Sąd Rejonowy w Sopocie", districtCourtId: "gdansk" },
    {
      id: "starogard-gdanski",
      name: "Sąd Rejonowy w Starogardzie Gdańskim",
      districtCourtId: "gdansk",
    },
    { id: "tczew", name: "Sąd Rejonowy w Tczewie", districtCourtId: "gdansk" },
    {
      id: "wejherowo",
      name: "Sąd Rejonowy w Wejherowie",
      districtCourtId: "gdansk",
    },
  ],
  slupsk: [
    { id: "bytow", name: "Sąd Rejonowy w Bytowie", districtCourtId: "slupsk" },
    {
      id: "chojnice",
      name: "Sąd Rejonowy w Chojnicach",
      districtCourtId: "slupsk",
    },
    {
      id: "czluchow",
      name: "Sąd Rejonowy w Człuchowie",
      districtCourtId: "slupsk",
    },
    { id: "lebork", name: "Sąd Rejonowy w Lęborku", districtCourtId: "slupsk" },
    {
      id: "miastko",
      name: "Sąd Rejonowy w Miastku",
      districtCourtId: "slupsk",
    },
    { id: "slupsk", name: "Sąd Rejonowy w Słupsku", districtCourtId: "slupsk" },
  ],

  // Apelacja Katowicka
  "bielsko-biala": [
    {
      id: "bielsko-biala",
      name: "Sąd Rejonowy w Bielsku-Białej",
      districtCourtId: "bielsko-biala",
    },
    {
      id: "cieszyn",
      name: "Sąd Rejonowy w Cieszynie",
      districtCourtId: "bielsko-biala",
    },
    {
      id: "zywiec",
      name: "Sąd Rejonowy w Żywcu",
      districtCourtId: "bielsko-biala",
    },
  ],
  czestochowa: [
    {
      id: "czestochowa",
      name: "Sąd Rejonowy w Częstochowie",
      districtCourtId: "czestochowa",
    },
    {
      id: "lubliniec",
      name: "Sąd Rejonowy w Lublińcu",
      districtCourtId: "czestochowa",
    },
    {
      id: "myszkow",
      name: "Sąd Rejonowy w Myszkowie",
      districtCourtId: "czestochowa",
    },
  ],
  gliwice: [
    {
      id: "gliwice",
      name: "Sąd Rejonowy w Gliwicach",
      districtCourtId: "gliwice",
    },
    {
      id: "jastrzebie-zdroj",
      name: "Sąd Rejonowy w Jastrzębiu-Zdroju",
      districtCourtId: "gliwice",
    },
    {
      id: "pyskowice",
      name: "Sąd Rejonowy w Pyskowicach",
      districtCourtId: "gliwice",
    },
    {
      id: "raciborz",
      name: "Sąd Rejonowy w Raciborzu",
      districtCourtId: "gliwice",
    },
    {
      id: "ruda-slaska",
      name: "Sąd Rejonowy w Rudzie Śląskiej",
      districtCourtId: "gliwice",
    },
    {
      id: "tarnowskie-gory",
      name: "Sąd Rejonowy w Tarnowskich Górach",
      districtCourtId: "gliwice",
    },
    {
      id: "wodzislaw-slaski",
      name: "Sąd Rejonowy w Wodzisławiu Śląskim",
      districtCourtId: "gliwice",
    },
    { id: "zabrze", name: "Sąd Rejonowy w Zabrzu", districtCourtId: "gliwice" },
  ],
  katowice: [
    {
      id: "bytom",
      name: "Sąd Rejonowy w Bytomiu",
      districtCourtId: "katowice",
    },
    {
      id: "chorzow",
      name: "Sąd Rejonowy w Chorzowie",
      districtCourtId: "katowice",
    },
    {
      id: "katowice-wschod",
      name: "Sąd Rejonowy Katowice-Wschód w Katowicach",
      districtCourtId: "katowice",
    },
    {
      id: "katowice-zachod",
      name: "Sąd Rejonowy Katowice-Zachód w Katowicach",
      districtCourtId: "katowice",
    },
    {
      id: "mikolow",
      name: "Sąd Rejonowy w Mikołowie",
      districtCourtId: "katowice",
    },
    {
      id: "myslowice",
      name: "Sąd Rejonowy w Mysłowicach",
      districtCourtId: "katowice",
    },
    {
      id: "pszczyna",
      name: "Sąd Rejonowy w Pszczynie",
      districtCourtId: "katowice",
    },
    {
      id: "siemianowice-slaskie",
      name: "Sąd Rejonowy w Siemianowicach Śląskich",
      districtCourtId: "katowice",
    },
    {
      id: "sosnowiec",
      name: "Sąd Rejonowy w Sosnowcu",
      districtCourtId: "katowice",
    },
    {
      id: "tychy",
      name: "Sąd Rejonowy w Tychach",
      districtCourtId: "katowice",
    },
  ],
  rybnik: [
    { id: "rybnik", name: "Sąd Rejonowy w Rybniku", districtCourtId: "rybnik" },
    { id: "zory", name: "Sąd Rejonowy w Żorach", districtCourtId: "rybnik" },
  ],

  // Apelacja Krakowska
  kielce: [
    {
      id: "busko-zdroj",
      name: "Sąd Rejonowy w Busku-Zdroju",
      districtCourtId: "kielce",
    },
    {
      id: "jedrzejow",
      name: "Sąd Rejonowy w Jędrzejowie",
      districtCourtId: "kielce",
    },
    {
      id: "kielce",
      name: "Sąd Rejonowy w Kielcach",
      districtCourtId: "kielce",
    },
    {
      id: "konskie",
      name: "Sąd Rejonowy w Końskich",
      districtCourtId: "kielce",
    },
    {
      id: "ostrowiec-swietokrzyski",
      name: "Sąd Rejonowy w Ostrowcu Świętokrzyskim",
      districtCourtId: "kielce",
    },
    {
      id: "pinczow",
      name: "Sąd Rejonowy w Pińczowie",
      districtCourtId: "kielce",
    },
    {
      id: "skarzysko-kamienna",
      name: "Sąd Rejonowy w Skarżysku-Kamiennej",
      districtCourtId: "kielce",
    },
    {
      id: "starachowice",
      name: "Sąd Rejonowy w Starachowicach",
      districtCourtId: "kielce",
    },
    {
      id: "wloszczowa",
      name: "Sąd Rejonowy we Włoszczowie",
      districtCourtId: "kielce",
    },
  ],
  krakow: [
    {
      id: "krakow-krowodrza",
      name: "Sąd Rejonowy dla Krakowa-Krowodrzy w Krakowie",
      districtCourtId: "krakow",
    },
    {
      id: "krakow-nowa-huta",
      name: "Sąd Rejonowy dla Krakowa-Nowej Huty w Krakowie",
      districtCourtId: "krakow",
    },
    {
      id: "krakow-podgorze",
      name: "Sąd Rejonowy dla Krakowa-Podgórza w Krakowie",
      districtCourtId: "krakow",
    },
    {
      id: "krakow-srodmiescie",
      name: "Sąd Rejonowy dla Krakowa-Śródmieścia w Krakowie",
      districtCourtId: "krakow",
    },
    {
      id: "myslenice",
      name: "Sąd Rejonowy w Myślenicach",
      districtCourtId: "krakow",
    },
    {
      id: "skawina",
      name: "Sąd Rejonowy w Skawinie",
      districtCourtId: "krakow",
    },
    {
      id: "wieliczka",
      name: "Sąd Rejonowy w Wieliczce",
      districtCourtId: "krakow",
    },
  ],
  "nowy-sacz": [
    {
      id: "gorlice",
      name: "Sąd Rejonowy w Gorlicach",
      districtCourtId: "nowy-sacz",
    },
    {
      id: "limanowa",
      name: "Sąd Rejonowy w Limanowej",
      districtCourtId: "nowy-sacz",
    },
    {
      id: "nowy-sacz",
      name: "Sąd Rejonowy w Nowym Sączu",
      districtCourtId: "nowy-sacz",
    },
    {
      id: "nowy-targ",
      name: "Sąd Rejonowy w Nowym Targu",
      districtCourtId: "nowy-sacz",
    },
    {
      id: "zakopane",
      name: "Sąd Rejonowy w Zakopanem",
      districtCourtId: "nowy-sacz",
    },
  ],
  tarnow: [
    { id: "bochnia", name: "Sąd Rejonowy w Bochni", districtCourtId: "tarnow" },
    {
      id: "brzesko",
      name: "Sąd Rejonowy w Brzesku",
      districtCourtId: "tarnow",
    },
    {
      id: "dabrowa-tarnowska",
      name: "Sąd Rejonowy w Dąbrowie Tarnowskiej",
      districtCourtId: "tarnow",
    },
    {
      id: "tarnow",
      name: "Sąd Rejonowy w Tarnowie",
      districtCourtId: "tarnow",
    },
  ],

  // Więcej sądów z innych apelacji...
  // Apelacja Lubelska
  lublin: [
    {
      id: "lublin-wschod",
      name: "Sąd Rejonowy Lublin-Wschód w Lublinie z siedzibą w Świdniku",
      districtCourtId: "lublin",
    },
    {
      id: "lublin-zachod",
      name: "Sąd Rejonowy Lublin-Zachód w Lublinie",
      districtCourtId: "lublin",
    },
    {
      id: "krasnystaw",
      name: "Sąd Rejonowy w Krasnymstawie",
      districtCourtId: "lublin",
    },
    {
      id: "lubartow",
      name: "Sąd Rejonowy w Lubartowie",
      districtCourtId: "lublin",
    },
    {
      id: "opole-lubelskie",
      name: "Sąd Rejonowy w Opolu Lubelskim",
      districtCourtId: "lublin",
    },
    {
      id: "pulawy",
      name: "Sąd Rejonowy w Puławach",
      districtCourtId: "lublin",
    },
    { id: "ryki", name: "Sąd Rejonowy w Rykach", districtCourtId: "lublin" },
  ],
  radom: [
    { id: "grojec", name: "Sąd Rejonowy w Grójcu", districtCourtId: "radom" },
    {
      id: "kozienice",
      name: "Sąd Rejonowy w Kozienicach",
      districtCourtId: "radom",
    },
    { id: "lipsko", name: "Sąd Rejonowy w Lipsku", districtCourtId: "radom" },
    {
      id: "przysucha",
      name: "Sąd Rejonowy w Przysusze",
      districtCourtId: "radom",
    },
    { id: "radom", name: "Sąd Rejonowy w Radomiu", districtCourtId: "radom" },
    {
      id: "szydlowiec",
      name: "Sąd Rejonowy w Szydłowcu",
      districtCourtId: "radom",
    },
    { id: "zwolen", name: "Sąd Rejonowy w Zwoleniu", districtCourtId: "radom" },
  ],
  siedlce: [
    {
      id: "garwolin",
      name: "Sąd Rejonowy w Garwolinie",
      districtCourtId: "siedlce",
    },
    {
      id: "losice",
      name: "Sąd Rejonowy w Łosicach",
      districtCourtId: "siedlce",
    },
    {
      id: "minsk-mazowiecki",
      name: "Sąd Rejonowy w Mińsku Mazowieckim",
      districtCourtId: "siedlce",
    },
    {
      id: "siedlce",
      name: "Sąd Rejonowy w Siedlcach",
      districtCourtId: "siedlce",
    },
    {
      id: "sokolow-podlaski",
      name: "Sąd Rejonowy w Sokołowie Podlaskim",
      districtCourtId: "siedlce",
    },
    {
      id: "wegrow",
      name: "Sąd Rejonowy w Węgrowie",
      districtCourtId: "siedlce",
    },
  ],
  zamosc: [
    {
      id: "bilgoraj",
      name: "Sąd Rejonowy w Biłgoraju",
      districtCourtId: "zamosc",
    },
    { id: "chelm", name: "Sąd Rejonowy w Chełmie", districtCourtId: "zamosc" },
    {
      id: "hrubieszow",
      name: "Sąd Rejonowy w Hrubieszowie",
      districtCourtId: "zamosc",
    },
    {
      id: "janow-lubelski",
      name: "Sąd Rejonowy w Janowie Lubelskim",
      districtCourtId: "zamosc",
    },
    {
      id: "krasnystaw",
      name: "Sąd Rejonowy w Krasnymstawie",
      districtCourtId: "zamosc",
    },
    {
      id: "tomaszow-lubelski",
      name: "Sąd Rejonowy w Tomaszowie Lubelskim",
      districtCourtId: "zamosc",
    },
    {
      id: "wlodawa",
      name: "Sąd Rejonowy we Włodawie",
      districtCourtId: "zamosc",
    },
    {
      id: "zamosc",
      name: "Sąd Rejonowy w Zamościu",
      districtCourtId: "zamosc",
    },
  ],

  // Pozostałe województwa będą zaimplementowane podobnie...
  // Apelacja Warszawska
  warszawa: [
    {
      id: "warszawa-srodmiescie",
      name: "Sąd Rejonowy dla Warszawy-Śródmieścia w Warszawie",
      districtCourtId: "warszawa",
    },
    {
      id: "warszawa-mokotow",
      name: "Sąd Rejonowy dla Warszawy-Mokotowa w Warszawie",
      districtCourtId: "warszawa",
    },
    {
      id: "warszawa-wola",
      name: "Sąd Rejonowy dla Warszawy-Woli w Warszawie",
      districtCourtId: "warszawa",
    },
    {
      id: "warszawa-zoliborz",
      name: "Sąd Rejonowy dla Warszawy-Żoliborza w Warszawie",
      districtCourtId: "warszawa",
    },
    {
      id: "grodzisk-mazowiecki",
      name: "Sąd Rejonowy w Grodzisku Mazowieckim",
      districtCourtId: "warszawa",
    },
    {
      id: "piaseczno",
      name: "Sąd Rejonowy w Piasecznie",
      districtCourtId: "warszawa",
    },
    {
      id: "pruszkow",
      name: "Sąd Rejonowy w Pruszkowie",
      districtCourtId: "warszawa",
    },
  ],
  "warszawa-praga": [
    {
      id: "warszawa-praga-polnoc",
      name: "Sąd Rejonowy dla Warszawy Pragi-Północ w Warszawie",
      districtCourtId: "warszawa-praga",
    },
    {
      id: "warszawa-praga-poludnie",
      name: "Sąd Rejonowy dla Warszawy Pragi-Południe w Warszawie",
      districtCourtId: "warszawa-praga",
    },
    {
      id: "legionowo",
      name: "Sąd Rejonowy w Legionowie",
      districtCourtId: "warszawa-praga",
    },
    {
      id: "nowy-dwor-mazowiecki",
      name: "Sąd Rejonowy w Nowym Dworze Mazowieckim",
      districtCourtId: "warszawa-praga",
    },
    {
      id: "otwock",
      name: "Sąd Rejonowy w Otwocku",
      districtCourtId: "warszawa-praga",
    },
    {
      id: "wolomin",
      name: "Sąd Rejonowy w Wołominie",
      districtCourtId: "warszawa-praga",
    },
  ],
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

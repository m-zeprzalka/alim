// Dane sądów w Polsce - zaczerpnięte z pliku hierarchia-sadow-powszechnych.json (luty 2025)
import hierarchiaData from "../app/postepowanie/sadowe/hierarchia-sadow-powszechnych.json";

// Konwersja danych z JSON - upewnienie się, że mamy poprawny typ
const hierarchia = hierarchiaData as {
  title: string;
  date: string;
  courts: {
    [appellationName: string]: {
      [districtCourtName: string]: string[];
    };
  };
};

export type Court = {
  id: string;
  name: string;
};

export type RegionalCourt = Court & {
  districtCourtId: string;
  districtCourtName: string;
  appellationId: string;
  appellationName: string;
};

export type DistrictCourt = Court & {
  appellationId: string;
  appellationName: string;
  regionalCourts: RegionalCourt[];
};

export type Appellation = {
  id: string;
  name: string;
  districtCourts: DistrictCourt[];
};

// Funkcja konwertująca nazwę na ID (slug) - usuwająca polskie znaki, zamieniająca spacje na myślniki i obniżająca wszystkie litery
export function convertToId(name: string): string {
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

// Funkcja wczytująca dane sądów z hierarchii
function parseCourtHierarchy() {
  const appellations: Appellation[] = [];
  const courtsByDistrict: { [key: string]: RegionalCourt[] } = {};

  // Przetwarzanie danych hierachicznych z JSON
  Object.entries(hierarchia.courts).forEach(
    ([appellationName, districtCourts]) => {
      const appellationId = convertToId(appellationName);

      const districtCourtsArray: DistrictCourt[] = [];

      // Przetwarzanie sądów okręgowych
      Object.entries(districtCourts).forEach(
        ([districtCourtName, regionalCourtsArray]) => {
          const districtCourtId = convertToId(districtCourtName);

          // Przetwarzanie sądów rejonowych
          const regionalCourts: RegionalCourt[] = regionalCourtsArray.map(
            (regionalCourtName: string) => {
              const regionalCourtId = convertToId(regionalCourtName);

              const regionalCourt: RegionalCourt = {
                id: regionalCourtId,
                name: regionalCourtName,
                districtCourtId: districtCourtId,
                districtCourtName: districtCourtName,
                appellationId: appellationId,
                appellationName: appellationName,
              };

              return regionalCourt;
            }
          );

          // Zapisywanie sądów rejonowych dla danego sądu okręgowego
          courtsByDistrict[districtCourtId] = regionalCourts;

          // Tworzenie obiektu sądu okręgowego
          const districtCourt: DistrictCourt = {
            id: districtCourtId,
            name: districtCourtName,
            appellationId: appellationId,
            appellationName: appellationName,
            regionalCourts: regionalCourts,
          };

          districtCourtsArray.push(districtCourt);
        }
      );

      // Tworzenie obiektu apelacji
      const appellation: Appellation = {
        id: appellationId,
        name: appellationName,
        districtCourts: districtCourtsArray,
      };

      appellations.push(appellation);
    }
  );

  return { appellations, courtsByDistrict };
}

// Implementacja systemu cache dla optymalizacji wydajności
const cache = {
  appellations: null as Appellation[] | null,
  appellationMap: new Map<string, Appellation>(),
  districtCourtMap: new Map<string, DistrictCourt>(),
  regionalCourtMap: new Map<string, RegionalCourt>(),
  regionalCourtsByDistrict: new Map<string, RegionalCourt[]>(),
};

// Wczytywanie danych przy inicjalizacji
const { appellations, courtsByDistrict } = parseCourtHierarchy();

// Inicjalizacja cache
appellations.forEach((appellation) => {
  cache.appellationMap.set(appellation.id, appellation);
  appellation.districtCourts.forEach((districtCourt) => {
    cache.districtCourtMap.set(districtCourt.id, districtCourt);
    districtCourt.regionalCourts.forEach((regionalCourt) => {
      cache.regionalCourtMap.set(regionalCourt.id, regionalCourt);
    });
  });
});

export const APPELATIONS: Appellation[] = appellations;
export const REGIONAL_COURTS = courtsByDistrict;

// Funkcja pomocnicza do wyszukiwania sądów rejonowych dla danego sądu okręgowego
export function getRegionalCourts(districtCourtId: string): RegionalCourt[] {
  // Sprawdź cache
  if (cache.regionalCourtsByDistrict.has(districtCourtId)) {
    return cache.regionalCourtsByDistrict.get(districtCourtId)!;
  }

  // Jeśli nie ma w cache, pobierz z oryginalnych danych i zapisz w cache
  const regionalCourts = REGIONAL_COURTS[districtCourtId] || [];
  cache.regionalCourtsByDistrict.set(districtCourtId, regionalCourts);
  return regionalCourts;
}

// Funkcja pomocnicza do wyszukiwania sądu okręgowego po ID
export function getDistrictCourt(
  appellationId: string,
  districtCourtId: string
): DistrictCourt | undefined {
  // Szybkie wyszukiwanie z użyciem cache
  return cache.districtCourtMap.get(districtCourtId);
}

// Funkcja pomocnicza do wyszukiwania apelacji po ID
export function getAppellation(appellationId: string): Appellation | undefined {
  // Szybkie wyszukiwanie z użyciem cache
  return cache.appellationMap.get(appellationId);
}

// Funkcja zwracająca sąd rejonowy na podstawie jego ID
export function getRegionalCourtById(
  regionalCourtId: string
): RegionalCourt | undefined {
  // Szybkie wyszukiwanie z użyciem cache
  return cache.regionalCourtMap.get(regionalCourtId);
}

// Funkcja zwracająca wszystkie sądy rejonowe
export function getAllRegionalCourts(): RegionalCourt[] {
  return Object.values(REGIONAL_COURTS).flat();
}

# INSTRUKCJA IMPLEMENTACJI KORELACJI FRONTEND-BAZA

## Spis treści

1. [Wprowadzenie](#wprowadzenie)
2. [Lista zmian wymaganych w schemacie bazy danych](#lista-zmian-wymaganych-w-schemacie-bazy-danych)
3. [Kroki implementacji](#kroki-implementacji)
4. [Modyfikacje w kodzie](#modyfikacje-w-kodzie)
5. [Przygotowanie migracji danych](#przygotowanie-migracji-danych)
6. [Eksport danych do Excel](#eksport-danych-do-excel)
7. [Testowanie](#testowanie)

## Wprowadzenie

Ten dokument zawiera szczegółową instrukcję implementacji zmian mających na celu poprawę korelacji między danymi zbieranymi w formularzach frontend a ich reprezentacją w bazie danych aplikacji AliMatrix. Celem jest zapewnienie spójności danych i eliminacja przypadków, gdy dane zebrane przez aplikację nie są zapisywane w bazie danych.

## Lista zmian wymaganych w schemacie bazy danych

Na podstawie analizy rozbieżności między formularzami a bazą danych, poniżej przedstawiamy listę niezbędnych zmian w schemacie bazy danych:

### 1. Model Child

```prisma
model Child {
  // Istniejące pola
  id                     String         @id @default(cuid())
  formSubmissionId       String
  formSubmission         FormSubmission @relation(fields: [formSubmissionId], references: [id], onDelete: Cascade)
  childId                Int
  wiek                   Int?
  plec                   String?
  specjalnePotrzeby      Boolean        @default(false)
  opisSpecjalnychPotrzeb String?
  uczeszczeDoPlacowki    Boolean?
  typPlacowki            String?
  opiekaInnejOsoby       Boolean?
  modelOpieki            String?
  cyklOpieki             String?
  procentCzasuOpieki     Float?

  // NOWE POLA DO DODANIA
  poziomEdukacji         String?  // Poziom edukacyjny dla dzieci w szkole
  kosztySzkoly           Float?   // Koszty opłat za szkołę/przedszkole
  dodatkZajeciaCena      Float?   // Koszty dodatkowych zajęć
  szczegolowyProcentCzasu Json?   // Szczegółowe dane o podziale procentowym opieki

  // Istniejące relacje i pozostałe pola
  @@unique([formSubmissionId, childId])
  @@index([formSubmissionId])
}
```

### 2. Model LivingCosts

```prisma
// Utworzenie nowego modelu dla szczegółowych kosztów utrzymania
model LivingCostsDetails {
  id                  String   @id @default(cuid())
  formSubmissionId    String   @unique
  formSubmission      FormSubmission @relation(fields: [formSubmissionId], references: [id], onDelete: Cascade)

  // Koszty mieszkaniowe (obecnie zagregowane w utilities)
  czynsz              Float?
  energia             Float?
  woda                Float?
  ogrzewanie          Float?
  internet            Float?
  telefon             Float?

  // Dodatkowe szczegóły
  typZamieszkania     String?  // Własne, wynajmowane, itp.
  czestotliwoscOplat  String?  // Miesięcznie, kwartalnie, etc.
  powierzchniaMieszkania Float?
  liczbaOsob          Int?
}
```

### 3. Model CourtCase

```prisma
// Uzupełnienie informacji o sprawach sądowych
model CourtDetails {
  id                 String   @id @default(cuid())
  formSubmissionId   String   @unique
  formSubmission     FormSubmission @relation(fields: [formSubmissionId], references: [id], onDelete: Cascade)

  imieNazwiskoSedziego String?
  specjalizacjaSedziego String?
  typReprezentacji     String?  // samodzielnie, adwokat, radca prawny
  imieNazwiskoReprezentanta String?
  kosztReprezentacji   Float?
  liczbaRozpraw        Int?
}
```

## Kroki implementacji

Proces implementacji powinien być przeprowadzony w następującej kolejności:

1. **Przygotowanie migracji Prisma:**
   - Utworzenie migracji dla dodania nowych pól w istniejących modelach
   - Utworzenie migracji dla nowych modeli
2. **Aktualizacja serwisów API:**
   - Modyfikacja funkcji mapujących dane formularzy do modeli bazy danych
   - Aktualizacja endpointów API do obsługi nowych pól
3. **Dopasowanie walidacji danych:**
   - Rozszerzenie schematów walidacji Zod o nowe pola
   - Zaktualizowanie walidacji w formularzach React
4. **Aktualizacja funkcji eksportu do Excel:**
   - Rozszerzenie eksportu o nowe pola
   - Poprawa formatowania danych
5. **Migracja istniejących danych:**
   - Skrypt migracji dla już istniejących rekordów
   - Funkcje do ekstrakcji i separacji zagregowanych danych

## Modyfikacje w kodzie

### 1. Aktualizacja schematów Prisma

1. **Edytuj plik `prisma/schema.prisma` aby dodać nowe pola:**

```prisma
// Zaktualizuj model Child
model Child {
  // Istniejące pola
  ...

  // Nowe pola
  poziomEdukacji     String?
  kosztySzkoly       Float?
  dodatkZajeciaCena  Float?
  szczegolowyProcentCzasu Json?

  // Pozostałe pola
  ...
}

// Dodaj nowy model LivingCostsDetails
model LivingCostsDetails {
  id               String   @id @default(cuid())
  formSubmissionId String   @unique
  formSubmission   FormSubmission @relation(fields: [formSubmissionId], references: [id], onDelete: Cascade)

  czynsz           Float?
  energia          Float?
  woda             Float?
  ogrzewanie       Float?
  internet         Float?
  telefon          Float?

  typZamieszkania  String?
  czestotliwoscOplat String?
  powierzchniaMieszkania Float?
  liczbaOsob       Int?
}

// Dodaj nowy model CourtDetails
model CourtDetails {
  id                 String   @id @default(cuid())
  formSubmissionId   String   @unique
  formSubmission     FormSubmission @relation(fields: [formSubmissionId], references: [id], onDelete: Cascade)

  imieNazwiskoSedziego String?
  specjalizacjaSedziego String?
  typReprezentacji     String?
  imieNazwiskoReprezentanta String?
  kosztReprezentacji   Float?
  liczbaRozpraw        Int?
}
```

2. **Utwórz migrację Prisma:**

```bash
npx prisma migrate dev --name add_detailed_fields
```

### 2. Aktualizacja funkcji mapujących dane

1. **Modyfikacja funkcji mapującej dla dzieci**

```typescript
// Zaktualizuj funkcję mapującą dla dzieci w odpowiednim pliku serwisowym
export function mapChildrenFormToDbModel(formData) {
  return formData.dzieci.map((dziecko) => ({
    childId: dziecko.id,
    wiek: dziecko.wiek,
    plec: dziecko.plec,
    specjalnePotrzeby: dziecko.specjalnePotrzeby,
    opisSpecjalnychPotrzeb: dziecko.opisSpecjalnychPotrzeb,
    uczeszczeDoPlacowki: dziecko.uczeszczeDoPlacowki,
    typPlacowki: dziecko.typPlacowki,
    opiekaInnejOsoby: dziecko.opiekaInnejOsoby,
    modelOpieki: dziecko.modelOpieki,
    cyklOpieki: dziecko.cyklOpieki,
    procentCzasuOpieki: dziecko.procentCzasuOpieki,

    // Dodane nowe pola
    poziomEdukacji: dziecko.poziomEdukacji,
    kosztySzkoly: dziecko.kosztySzkoly,
    dodatkZajeciaCena: dziecko.dodatkZajeciaCena,
    szczegolowyProcentCzasu: dziecko.szczegolowyProcentCzasu
      ? JSON.stringify(dziecko.szczegolowyProcentCzasu)
      : null,

    // Dane o kosztach utrzymania dziecka
    kwotaAlimentow: dziecko.kwotaAlimentow,
    twojeMiesieczneWydatki: dziecko.twojeMiesieczneWydatki,
    wydatkiDrugiegoRodzica: dziecko.wydatkiDrugiegoRodzica,
    kosztyUznanePrzezSad: dziecko.kosztyUznanePrzezSad,

    // Inne źródła utrzymania
    rentaRodzinna: dziecko.inneZrodlaUtrzymania?.rentaRodzinna || false,
    rentaRodzinnaKwota: dziecko.inneZrodlaUtrzymania?.rentaRodzinnaKwota,
    swiadczeniePielegnacyjne:
      dziecko.inneZrodlaUtrzymania?.swiadczeniePielegnacyjne || false,
    swiadczeniePielegnacyjneKwota:
      dziecko.inneZrodlaUtrzymania?.swiadczeniePielegnacyjneKwota,
    inneZrodla: dziecko.inneZrodlaUtrzymania?.inne || false,
    inneZrodlaOpis: dziecko.inneZrodlaUtrzymania?.inneOpis,
    inneZrodlaKwota: dziecko.inneZrodlaUtrzymania?.inneKwota,
    brakDodatkowychZrodel:
      dziecko.inneZrodlaUtrzymania?.brakDodatkowychZrodel || true,
  }));
}
```

2. **Funkcje mapujące dla kosztów utrzymania**

```typescript
// Dodaj funkcję mapującą dla szczegółowych kosztów utrzymania
export function mapLivingCostsToDbModel(formData) {
  return {
    // Zachowaj kompatybilność wsteczną
    czynsz: formData.czynsz || 0,
    utilities:
      (formData.energia || 0) +
      (formData.woda || 0) +
      (formData.ogrzewanie || 0) +
      (formData.internet || 0) +
      (formData.telefon || 0),

    // Nowy model ze szczegółami
    livingCostsDetails: {
      create: {
        czynsz: formData.czynsz || 0,
        energia: formData.energia || 0,
        woda: formData.woda || 0,
        ogrzewanie: formData.ogrzewanie || 0,
        internet: formData.internet || 0,
        telefon: formData.telefon || 0,
        typZamieszkania: formData.typZamieszkania,
        czestotliwoscOplat: formData.czestotliwoscOplat,
        powierzchniaMieszkania: formData.powierzchniaMieszkania,
        liczbaOsob: formData.liczbaOsob,
      },
    },
  };
}
```

3. **Funkcje mapujące dla danych sądowych**

```typescript
// Dodaj funkcję mapującą dla szczegółowych danych sądowych
export function mapCourtDetailsToDbModel(formData) {
  return {
    // Zachowaj kompatybilność wsteczną dla podstawowych danych sądowych
    courtId: formData.sadId,

    // Nowy model ze szczegółami
    courtDetails: {
      create: {
        imieNazwiskoSedziego: formData.imieNazwiskoSedziego,
        specjalizacjaSedziego: formData.specjalizacjaSedziego,
        typReprezentacji: formData.typReprezentacji,
        imieNazwiskoReprezentanta: formData.imieNazwiskoReprezentanta,
        kosztReprezentacji: formData.kosztReprezentacji,
        liczbaRozpraw: formData.liczbaRozpraw,
      },
    },
  };
}
```

### 3. Aktualizacja endpointów API

1. **Zaktualizuj API dla zapisywania danych o dzieciach:**

```typescript
// W odpowiednim pliku API route
import { mapChildrenFormToDbModel } from "@/lib/mappers";

export async function POST(request) {
  try {
    const data = await request.json();

    // Walidacja danych
    // ...

    // Konwersja danych formularza na model bazy danych
    const childrenData = mapChildrenFormToDbModel(data);

    // Zapisanie danych w bazie
    const result = await prisma.formSubmission.update({
      where: {
        id: data.formSubmissionId,
      },
      data: {
        dzieci: {
          deleteMany: {}, // Opcjonalnie usuń istniejące dane
          create: childrenData,
        },
      },
    });

    return Response.json({ success: true, data: result });
  } catch (error) {
    console.error("Error saving children data:", error);
    return Response.json({ error: "Błąd serwera" }, { status: 500 });
  }
}
```

## Przygotowanie migracji danych

Aby przenieść dane z istniejącego formatu do nowego, potrzebny będzie skrypt migracyjny. Poniżej przedstawiamy przykładową implementację:

```typescript
// scripts/migrateData.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function migrateData() {
  console.log("Rozpoczynanie migracji danych...");

  // 1. Migracja danych o kosztach utrzymania
  await migrateUtilitiesToDetailedFields();

  // 2. Ekstrakcja danych z JSON do dedykowanych pól
  await extractJSONDataToFields();

  console.log("Migracja zakończona pomyślnie!");
}

async function migrateUtilitiesToDetailedFields() {
  // Pobierz wszystkie rekordy FormSubmission
  const submissions = await prisma.formSubmission.findMany({
    select: {
      id: true,
      formData: true,
    },
  });

  console.log(`Znaleziono ${submissions.length} formularzy do migracji.`);

  for (const submission of submissions) {
    const formData = submission.formData as any;

    // Sprawdź czy formData zawiera informacje o kosztach utrzymania
    if (formData && formData.kosztyUtrzymania) {
      // Wyciągnij wartości - to jest uproszczenie, w rzeczywistości
      // potrzebna byłaby bardziej złożona logika
      const utilities = formData.kosztyUtrzymania.utilities || 0;

      // Przykładowy podział na równe części (w rzeczywistości należy
      // zastosować bardziej zaawansowaną logikę, jeśli to możliwe)
      const avgValue = utilities / 3;

      try {
        // Utwórz nowy rekord szczegółów kosztów utrzymania
        await prisma.livingCostsDetails.create({
          data: {
            formSubmissionId: submission.id,
            energia: avgValue,
            woda: avgValue,
            ogrzewanie: avgValue,
            internet: 0, // Domyślnie 0, bo nie mamy danych
            telefon: 0, // Domyślnie 0, bo nie mamy danych
          },
        });

        console.log(
          `Utworzono szczegóły kosztów dla formularza ${submission.id}`
        );
      } catch (error) {
        console.error(
          `Błąd podczas migracji kosztów dla formularza ${submission.id}:`,
          error
        );
      }
    }
  }
}

async function extractJSONDataToFields() {
  // Pobierz wszystkie dzieci z danymi w formacie JSON
  const children = await prisma.child.findMany({
    select: {
      id: true,
      formSubmissionId: true,
      tabelaCzasu: true, // Pole JSON
      wskaznikiCzasuOpieki: true, // Pole JSON
    },
  });

  console.log(`Znaleziono ${children.length} dzieci do migracji danych JSON.`);

  for (const child of children) {
    try {
      // Tylko jeśli mamy dane w polu tabelaCzasu
      if (child.tabelaCzasu) {
        // Parse JSON
        const tabelaData =
          typeof child.tabelaCzasu === "string"
            ? JSON.parse(child.tabelaCzasu)
            : child.tabelaCzasu;

        // Ekstrahuj szczegółowe procenty czasu opieki, jeśli są dostępne
        if (tabelaData && typeof tabelaData === "object") {
          // Zaktualizuj rekord dziecka z wyodrębnionymi danymi
          await prisma.child.update({
            where: { id: child.id },
            data: {
              // Zapisz szczegółowe dane o czasie
              szczegolowyProcentCzasu: tabelaData,
            },
          });

          console.log(
            `Zaktualizowano dane o czasie opieki dla dziecka ${child.id}`
          );
        }
      }
    } catch (error) {
      console.error(
        `Błąd podczas ekstrakcji danych JSON dla dziecka ${child.id}:`,
        error
      );
    }
  }
}

// Uruchom migrację
migrateData()
  .catch((e) => {
    console.error("Błąd podczas migracji:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

## Eksport danych do Excel

Aby zapewnić spójność między danymi w bazie a eksportem Excel, należy zaktualizować funkcje eksportu:

```typescript
// Zaktualizowana funkcja eksportu danych do Excel
import * as XLSX from "xlsx";

export function exportUserDataToExcel(userData) {
  // Utwórz nowy workbook
  const workbook = XLSX.utils.book_new();

  // 1. Arkusz główny z podsumowaniem
  const mainData = [
    {
      "ID Formularza": userData.id,
      "Adres Email": userData.email,
      "Data wypełnienia": formatDateForExport(userData.submittedAt),
      "Podstawa ustaleń": mapPodstawaUstalenToDisplay(userData.podstawaUstalen),
      "Sposób finansowania": mapSposobFinansowaniaToDisplay(
        userData.sposobFinansowania
      ),

      // Dane demograficzne
      "Płeć użytkownika": userData.plecUzytkownika,
      "Wiek użytkownika": userData.wiekUzytkownika,
      Województwo: userData.wojewodztwoUzytkownika,
      Miejscowość: userData.miejscowoscUzytkownika,
      "Stan cywilny": userData.stanCywilnyUzytkownika,

      // Dane drugiego rodzica
      "Płeć drugiego rodzica": userData.plecDrugiegoRodzica,
      "Wiek drugiego rodzica": userData.wiekDrugiegoRodzica,
      "Województwo (drugi rodzic)": userData.wojewodztwoDrugiegoRodzica,
      "Miejscowość (drugi rodzic)": userData.miejscowoscDrugiegoRodzica,

      // Dane sądowe
      Sąd: userData.sadRejonowyNazwa || userData.sadOkregowyNazwa,
      Apelacja: userData.apelacjaNazwa,
      "Rok decyzji": userData.rokDecyzjiSad,
      "Liczba sędziów": userData.liczbaSedzi,
      "Płeć sędziego": userData.plecSedziego,

      // Nowe pola z modelu CourtDetails
      "Imię i nazwisko sędziego": userData.courtDetails?.imieNazwiskoSedziego,
      "Specjalizacja sędziego": userData.courtDetails?.specjalizacjaSedziego,
      "Typ reprezentacji": userData.courtDetails?.typReprezentacji,
      Reprezentant: userData.courtDetails?.imieNazwiskoReprezentanta,
      "Koszt reprezentacji": userData.courtDetails?.kosztReprezentacji,
      "Liczba rozpraw": userData.courtDetails?.liczbaRozpraw,

      // Liczba dzieci
      "Liczba dzieci": userData.liczbaDzieci,
    },
  ];

  // Utwórz arkusz główny
  const mainSheet = XLSX.utils.json_to_sheet(mainData);
  XLSX.utils.book_append_sheet(workbook, mainSheet, "Informacje ogólne");

  // 2. Arkusz z danymi dzieci
  if (userData.dzieci && userData.dzieci.length > 0) {
    const childrenData = userData.dzieci.map((dziecko) => ({
      "ID dziecka": dziecko.childId,
      Wiek: dziecko.wiek,
      Płeć: dziecko.plec,
      "Specjalne potrzeby": dziecko.specjalnePotrzeby ? "Tak" : "Nie",
      "Opis specjalnych potrzeb": dziecko.opisSpecjalnychPotrzeb,
      "Uczęszcza do placówki": dziecko.uczeszczeDoPlacowki ? "Tak" : "Nie",
      "Typ placówki": mapTypPlacowkiToDisplay(dziecko.typPlacowki),
      "Opieka innej osoby": dziecko.opiekaInnejOsoby ? "Tak" : "Nie",
      "Model opieki": dziecko.modelOpieki,
      "Cykl opieki": dziecko.cyklOpieki,
      "Procent czasu opieki": dziecko.procentCzasuOpieki
        ? `${dziecko.procentCzasuOpieki}%`
        : "",

      // Nowe pola
      "Poziom edukacji": dziecko.poziomEdukacji,
      "Koszty szkoły/przedszkola": formatCurrencyForExport(
        dziecko.kosztySzkoly
      ),
      "Koszty zajęć dodatkowych": formatCurrencyForExport(
        dziecko.dodatkZajeciaCena
      ),

      // Koszty utrzymania
      "Kwota alimentów": formatCurrencyForExport(dziecko.kwotaAlimentow),
      "Wydatki wypełniającego": formatCurrencyForExport(
        dziecko.twojeMiesieczneWydatki
      ),
      "Wydatki drugiego rodzica": formatCurrencyForExport(
        dziecko.wydatkiDrugiegoRodzica
      ),
      "Koszty uznane przez sąd": formatCurrencyForExport(
        dziecko.kosztyUznanePrzezSad
      ),

      // Inne źródła
      "Renta rodzinna": dziecko.rentaRodzinna ? "Tak" : "Nie",
      "Kwota renty rodzinnej": formatCurrencyForExport(
        dziecko.rentaRodzinnaKwota
      ),
      "Świadczenie pielęgnacyjne": dziecko.swiadczeniePielegnacyjne
        ? "Tak"
        : "Nie",
      "Kwota świadczenia pielęgnacyjnego": formatCurrencyForExport(
        dziecko.swiadczeniePielegnacyjneKwota
      ),
      "Inne źródła": dziecko.inneZrodla ? "Tak" : "Nie",
      "Opis innych źródeł": dziecko.inneZrodlaOpis,
      "Kwota z innych źródeł": formatCurrencyForExport(dziecko.inneZrodlaKwota),
    }));

    const childrenSheet = XLSX.utils.json_to_sheet(childrenData);
    XLSX.utils.book_append_sheet(workbook, childrenSheet, "Dzieci");
  }

  // 3. Arkusz z kosztami utrzymania
  if (userData.livingCostsDetails) {
    const costsData = [
      {
        Czynsz: formatCurrencyForExport(userData.livingCostsDetails.czynsz),
        Energia: formatCurrencyForExport(userData.livingCostsDetails.energia),
        Woda: formatCurrencyForExport(userData.livingCostsDetails.woda),
        Ogrzewanie: formatCurrencyForExport(
          userData.livingCostsDetails.ogrzewanie
        ),
        Internet: formatCurrencyForExport(userData.livingCostsDetails.internet),
        Telefon: formatCurrencyForExport(userData.livingCostsDetails.telefon),
        "Suma mediów": formatCurrencyForExport(
          (userData.livingCostsDetails.energia || 0) +
            (userData.livingCostsDetails.woda || 0) +
            (userData.livingCostsDetails.ogrzewanie || 0) +
            (userData.livingCostsDetails.internet || 0) +
            (userData.livingCostsDetails.telefon || 0)
        ),
        "Typ zamieszkania": userData.livingCostsDetails.typZamieszkania,
        "Częstotliwość opłat": userData.livingCostsDetails.czestotliwoscOplat,
        "Powierzchnia mieszkania":
          userData.livingCostsDetails.powierzchniaMieszkania,
        "Liczba osób": userData.livingCostsDetails.liczbaOsob,
      },
    ];

    const costsSheet = XLSX.utils.json_to_sheet(costsData);
    XLSX.utils.book_append_sheet(workbook, costsSheet, "Koszty utrzymania");
  }

  return workbook;
}

// Funkcje pomocnicze
function formatDateForExport(date) {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString("pl-PL", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

function formatCurrencyForExport(value) {
  if (value === null || value === undefined) return "";
  return parseFloat(value).toFixed(2);
}

function mapPodstawaUstalenToDisplay(value) {
  const mapping = {
    "postanowienie-zabezpieczajace": "Postanowienie zabezpieczające",
    "wyrok-rozwodowy": "Wyrok rozwodowy",
    "porozumienie-sad": "Porozumienie zatwierdzone przez sąd",
    "porozumienie-mediacja": "Porozumienie z mediacji",
    "porozumienie-prywatne": "Porozumienie prywatne",
    inne: "Inne",
  };
  return mapping[value] || value;
}

function mapSposobFinansowaniaToDisplay(value) {
  const mapping = {
    "i-pay": "Płacę alimenty",
    "i-receive": "Otrzymuję alimenty",
    shared: "Koszty dzielone proporcjonalnie",
  };
  return mapping[value] || value;
}

function mapTypPlacowkiToDisplay(value) {
  const mapping = {
    zlobek: "Żłobek",
    przedszkole: "Przedszkole",
    podstawowa: "Szkoła podstawowa",
    ponadpodstawowa: "Szkoła ponadpodstawowa",
  };
  return mapping[value] || value;
}
```

## Testowanie

Po wdrożeniu wszystkich zmian, należy przeprowadzić testy w celu weryfikacji, czy dane są poprawnie zapisywane i odczytywane. Zalecamy następujące kroki:

1. **Test jednostkowy funkcji mapujących:**

   - Sprawdzenie, czy funkcje mapujące poprawnie konwertują dane formularza na modele bazy danych
   - Weryfikacja obsługi przypadków brzegowych (brak danych, dane niepełne)

2. **Test integracyjny API:**

   - Sprawdzenie, czy API poprawnie zapisuje dane w nowej strukturze
   - Weryfikacja, czy zmiany są zgodne wstecz z istniejącymi formularzami

3. **Test eksportu danych:**

   - Sprawdzenie, czy dane eksportowane do Excela są kompletne i poprawnie sformatowane
   - Weryfikacja czytelności i użyteczności eksportu

4. **Test migracji danych:**

   - Weryfikacja, czy skrypt migracyjny poprawnie przenosi dane ze starej do nowej struktury
   - Sprawdzenie integralności danych po migracji

5. **Test end-to-end:**
   - Wypełnienie formularza z nowymi polami
   - Sprawdzenie, czy dane są poprawnie zapisane w bazie
   - Eksport danych i weryfikacja poprawności

---

Powyższa instrukcja zawiera kompletny plan implementacji zmian mających na celu poprawę korelacji między frontendem a bazą danych. Po wdrożeniu tych zmian, aplikacja AliMatrix będzie przechowywać wszystkie dane zbierane w formularzach, co znacząco poprawi ich wartość analityczną oraz doświadczenie użytkownika.

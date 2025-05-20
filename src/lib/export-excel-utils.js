// Zaktualizowana funkcja eksportu danych do Excel z uwzględnieniem wszystkich pól
import * as XLSX from "xlsx";

export function exportUserDataToExcel(userData) {
  // Utwórz nowy workbook z wieloma arkuszami
  const workbook = XLSX.utils.book_new();

  // 1. Arkusz główny z podstawowymi informacjami o formularzu
  const mainData = {
    "ID Formularza": userData.id,
    "Adres Email": userData.emailSubscription?.email || "",
    "Data wypełnienia": formatDateForExport(userData.submittedAt),
    Status: userData.status,
    "URL raportu": userData.reportUrl || "",

    // Główne informacje o formularzu
    "Ścieżka wyboru": mapSciezkaWyborToDisplay(userData.sciezkaWybor),
    "Podstawa ustaleń": mapPodstawaUstalenToDisplay(userData.podstawaUstalen),
    "Podstawa ustaleń - inne": userData.podstawaUstalenInne || "",
    "Wariant postępowania": mapWariantPostepu(userData.wariantPostepu),
    "Sposób finansowania": mapSposobFinansowania(userData.sposobFinansowania),

    // Dane demograficzne użytkownika
    "Płeć użytkownika": userData.plecUzytkownika || "",
    "Wiek użytkownika": userData.wiekUzytkownika || "",
    Województwo: userData.wojewodztwoUzytkownika || "",
    Miejscowość: userData.miejscowoscUzytkownika || "",
    "Stan cywilny": userData.stanCywilnyUzytkownika || "",

    // Nowe dane o użytkowniku
    PESEL: userData.pesel || "",
    "Adres - ulica": userData.adresUlica || "",
    "Adres - kod pocztowy": userData.adresKodPocztowy || "",
    "Adres - miasto": userData.adresMiasto || "",
    Telefon: userData.telefon || "",
    "Status zatrudnienia": userData.statusZatrudnienia || "",
    "Dochód miesięczny": formatCurrencyForExport(userData.dochodMiesieczny),

    // Dane drugiego rodzica
    "Płeć drugiego rodzica": userData.plecDrugiegoRodzica || "",
    "Wiek drugiego rodzica": userData.wiekDrugiegoRodzica || "",
    "Województwo (drugi rodzic)": userData.wojewodztwoDrugiegoRodzica || "",
    "Miejscowość (drugi rodzic)": userData.miejscowoscDrugiegoRodzica || "",

    // Dane sądowe
    "Rodzaj sądu": userData.rodzajSaduSad || "",
    Apelacja: userData.apelacjaNazwa || "",
    "Sąd okręgowy": userData.sadOkregowyNazwa || "",
    "Sąd rejonowy": userData.sadRejonowyNazwa || "",
    "Rok decyzji": userData.rokDecyzjiSad || "",
    "Miesiąc decyzji": userData.miesiacDecyzjiSad || "",
    "Data decyzji": userData.dataDecyzjiSad || "",
    "Liczba sędziów": userData.liczbaSedzi || "",
    "Płeć sędziego": userData.plecSedziego || "",
    "Inicjały sędziego": userData.inicjalySedziego || "",

    // Nowe dane sądowe
    "Imię sędziego": userData.imieSedziego || "",
    "Nazwisko sędziego": userData.nazwiskoSedziego || "",
    "Typ reprezentacji": userData.typReprezentacji || "",
    "Imię reprezentanta": userData.imieReprezentanta || "",
    "Nazwisko reprezentanta": userData.nazwiskoReprezentanta || "",
    "Koszt reprezentacji": formatCurrencyForExport(userData.kosztReprezentacji),
    "Data rozprawy": formatDateForExport(userData.dataRozprawy),
    "Data złożenia pozwu": formatDateForExport(userData.dataZlozeniaPozwu),
    "Liczba rozpraw": userData.liczbaRozpraw || "",

    // Dane porozumienia
    "Data porozumienia": userData.dataPorozumienia || "",
    "Sposób porozumienia": userData.sposobPorozumienia || "",
    "Forma porozumienia": userData.formaPorozumienia || "",
    "Klauzula waloryzacyjna": userData.klauzulaWaloryzacyjna || "",

    // Dane ustaleń innych
    "Data ustaleń innych": userData.dataUstalenInnych || "",
    "Uzgodnienie finansowania": userData.uzgodnienieFinansowania || "",
    "Plany wystąpienia do sądu": userData.planyWystapieniaDoSadu || "",

    // Oceny adekwatności
    "Ocena adekwatności sąd": userData.ocenaAdekwatnosciSad || "",
    "Ocena adekwatności porozumienie":
      userData.ocenaAdekwatnosciPorozumienie || "",
    "Ocena adekwatności inne": userData.ocenaAdekwatnosciInne || "",

    // Liczba dzieci
    "Liczba dzieci": userData.liczbaDzieci || 0,
  };

  // Utwórz arkusz główny i dodaj go do workbooka
  const mainSheet = XLSX.utils.json_to_sheet([mainData]);
  XLSX.utils.book_append_sheet(workbook, mainSheet, "Informacje ogólne");

  // 2. Arkusz z danymi dzieci
  if (userData.dzieci && userData.dzieci.length > 0) {
    const childrenData = userData.dzieci.map((dziecko) => ({
      "ID dziecka": dziecko.childId,
      Wiek: dziecko.wiek || "",
      Płeć: dziecko.plec || "",
      "Specjalne potrzeby": dziecko.specjalnePotrzeby ? "Tak" : "Nie",
      "Opis specjalnych potrzeb": dziecko.opisSpecjalnychPotrzeb || "",
      "Uczęszcza do placówki": dziecko.uczeszczeDoPlacowki ? "Tak" : "Nie",
      "Typ placówki": mapTypPlacowki(dziecko.typPlacowki),
      "Opieka innej osoby": dziecko.opiekaInnejOsoby ? "Tak" : "Nie",
      "Model opieki": dziecko.modelOpieki || "",
      "Cykl opieki": dziecko.cyklOpieki || "",
      "Procent czasu opieki": dziecko.procentCzasuOpieki
        ? `${dziecko.procentCzasuOpieki}%`
        : "",

      // Nowe pola edukacyjne
      "Poziom edukacji": dziecko.poziomEdukacji || "",
      "Koszty szkoły/przedszkola": formatCurrencyForExport(
        dziecko.kosztySzkoly
      ),
      "Koszty zajęć dodatkowych": formatCurrencyForExport(
        dziecko.dodatkZajeciaCena
      ),
      "Rodzaj zajęć dodatkowych": dziecko.rodzajZajec || "",

      // Koszty utrzymania dziecka
      "Kwota alimentów": formatCurrencyForExport(dziecko.kwotaAlimentow),
      "Miesięczne wydatki wypełniającego": formatCurrencyForExport(
        dziecko.twojeMiesieczneWydatki
      ),
      "Wydatki drugiego rodzica": formatCurrencyForExport(
        dziecko.wydatkiDrugiegoRodzica
      ),
      "Koszty uznane przez sąd": formatCurrencyForExport(
        dziecko.kosztyUznanePrzezSad
      ),

      // Inne źródła utrzymania
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
      "Opis innych źródeł": dziecko.inneZrodlaOpis || "",
      "Kwota z innych źródeł": formatCurrencyForExport(dziecko.inneZrodlaKwota),
      "Brak dodatkowych źródeł": dziecko.brakDodatkowychZrodel ? "Tak" : "Nie",

      // Dane o wakacjach
      "Procent czasu opieki w wakacje": dziecko.wakacjeProcentCzasu
        ? `${dziecko.wakacjeProcentCzasu}%`
        : "",
      "Szczegółowy plan wakacji": dziecko.wakacjeSzczegolowyPlan
        ? "Tak"
        : "Nie",
      "Opis planu wakacji": dziecko.wakacjeOpisPlan || "",
    }));

    const childrenSheet = XLSX.utils.json_to_sheet(childrenData);
    XLSX.utils.book_append_sheet(workbook, childrenSheet, "Dzieci");
  }

  // 3. Arkusz z danymi dochodów
  if (userData.dochodyRodzicow) {
    const incomeData = {
      // Dochody wypełniającego
      "Oficjalne dochody netto (własne)": formatCurrencyForExport(
        userData.dochodyRodzicow.wlasneDochodyNetto
      ),
      "Potencjał dochodowy (własny)": formatCurrencyForExport(
        userData.dochodyRodzicow.wlasnePotencjalDochodowy
      ),
      "Koszty utrzymania siebie": formatCurrencyForExport(
        userData.dochodyRodzicow.wlasneKosztyUtrzymania
      ),
      "Koszty utrzymania innych osób": formatCurrencyForExport(
        userData.dochodyRodzicow.wlasneKosztyInni
      ),
      "Dodatkowe zobowiązania (własne)": formatCurrencyForExport(
        userData.dochodyRodzicow.wlasneDodatkoweZobowiazania
      ),

      // Dochody drugiego rodzica
      "Dochody drugiego rodzica": formatCurrencyForExport(
        userData.dochodyRodzicow.drugiRodzicDochody
      ),
      "Potencjał dochodowy (drugi rodzic)": formatCurrencyForExport(
        userData.dochodyRodzicow.drugiRodzicPotencjal
      ),
      "Koszty utrzymania (drugi rodzic)": formatCurrencyForExport(
        userData.dochodyRodzicow.drugiRodzicKoszty
      ),
      "Koszty utrzymania innych osób (drugi rodzic)": formatCurrencyForExport(
        userData.dochodyRodzicow.drugiRodzicKosztyInni
      ),
      "Dodatkowe zobowiązania (drugi rodzic)": formatCurrencyForExport(
        userData.dochodyRodzicow.drugiRodzicDodatkowe
      ),
    };

    const incomeSheet = XLSX.utils.json_to_sheet([incomeData]);
    XLSX.utils.book_append_sheet(workbook, incomeSheet, "Dochody");
  }

  // 4. Arkusz z kosztami utrzymania
  if (userData.kosztyUtrzymania) {
    const costsData = {
      // Koszty podstawowe
      "Koszty utrzymania (łącznie)": formatCurrencyForExport(
        userData.kosztyUtrzymania.kosztyUtrzymania
      ),
      "Czynsz/Rata kredytu": formatCurrencyForExport(
        userData.kosztyUtrzymania.czynsz
      ),
      "Media (łącznie)": formatCurrencyForExport(
        userData.kosztyUtrzymania.media
      ),

      // Szczegółowe koszty mediów
      "Energia elektryczna": formatCurrencyForExport(
        userData.kosztyUtrzymania.energia
      ),
      Woda: formatCurrencyForExport(userData.kosztyUtrzymania.woda),
      Ogrzewanie: formatCurrencyForExport(userData.kosztyUtrzymania.ogrzewanie),
      Internet: formatCurrencyForExport(userData.kosztyUtrzymania.internet),
      Telefon: formatCurrencyForExport(userData.kosztyUtrzymania.telefon),

      // Inne koszty
      Transport: formatCurrencyForExport(userData.kosztyUtrzymania.transport),
      Żywność: formatCurrencyForExport(userData.kosztyUtrzymania.zywnosc),
      Lekarstwa: formatCurrencyForExport(userData.kosztyUtrzymania.lekarstwa),
      "Inne koszty miesięczne": formatCurrencyForExport(
        userData.kosztyUtrzymania.inneKosztyMiesieczne
      ),
      "Opis innych kosztów": userData.kosztyUtrzymania.inneKosztyOpis || "",

      // Dodatkowe informacje
      "Typ zamieszkania": userData.kosztyUtrzymania.typZamieszkania || "",
      "Częstotliwość opłat": userData.kosztyUtrzymania.czestotliwoscOplat || "",
      "Powierzchnia mieszkania (m²)":
        userData.kosztyUtrzymania.powierzchniaMieszkania || "",
      "Liczba osób w gospodarstwie": userData.kosztyUtrzymania.liczbaOsob || "",
    };

    const costsSheet = XLSX.utils.json_to_sheet([costsData]);
    XLSX.utils.book_append_sheet(workbook, costsSheet, "Koszty utrzymania");
  }

  // 5. Możemy także dodać arkusz z surowymi danymi JSON, jeśli potrzeba
  if (userData.formData) {
    const rawData =
      typeof userData.formData === "string"
        ? JSON.parse(userData.formData)
        : userData.formData;

    // Spłaszczamy JSON do pojedynczego wiersza, zachowując nazwy kluczy
    const flattenedData = flattenObject(rawData);

    const rawSheet = XLSX.utils.json_to_sheet([flattenedData]);
    XLSX.utils.book_append_sheet(workbook, rawSheet, "Dane JSON");
  }

  return workbook;
}

// Funkcje pomocnicze

function formatDateForExport(date) {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return ""; // Invalid date
  return d.toLocaleDateString("pl-PL", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

function formatCurrencyForExport(value) {
  if (value === null || value === undefined) return "";
  const num = parseFloat(value);
  if (isNaN(num)) return "";
  return num.toFixed(2);
}

function mapSciezkaWyborToDisplay(value) {
  const mapping = {
    established: "Już ustalone",
    "not-established": "Jeszcze nie ustalone",
  };
  return mapping[value] || value || "";
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
  return mapping[value] || value || "";
}

function mapWariantPostepu(value) {
  const mapping = {
    court: "Sąd",
    agreement: "Porozumienie",
    other: "Inne",
  };
  return mapping[value] || value || "";
}

function mapSposobFinansowania(value) {
  const mapping = {
    "i-pay": "Płacę alimenty",
    "i-receive": "Otrzymuję alimenty",
    shared: "Koszty dzielone proporcjonalnie",
  };
  return mapping[value] || value || "";
}

function mapTypPlacowki(value) {
  const mapping = {
    zlobek: "Żłobek",
    przedszkole: "Przedszkole",
    podstawowa: "Szkoła podstawowa",
    ponadpodstawowa: "Szkoła ponadpodstawowa",
  };
  return mapping[value] || value || "";
}

// Funkcja do spłaszczania zagnieżdżonych obiektów JSON
function flattenObject(obj, prefix = "") {
  return Object.keys(obj).reduce((acc, k) => {
    const pre = prefix.length ? `${prefix}.` : "";
    if (
      typeof obj[k] === "object" &&
      obj[k] !== null &&
      !Array.isArray(obj[k])
    ) {
      Object.assign(acc, flattenObject(obj[k], pre + k));
    } else if (Array.isArray(obj[k])) {
      obj[k].forEach((item, i) => {
        if (typeof item === "object" && item !== null) {
          Object.assign(acc, flattenObject(item, `${pre}${k}[${i}]`));
        } else {
          acc[`${pre}${k}[${i}]`] = item;
        }
      });
    } else {
      acc[pre + k] = obj[k];
    }
    return acc;
  }, {});
}

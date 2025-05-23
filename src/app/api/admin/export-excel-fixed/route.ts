// Endpoint do generowania pliku Excel z pełnymi danymi z bazy
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import * as ExcelJS from "exceljs";
import { checkAdminRateLimit } from "@/lib/form-validation";
import {
  adminApiKeySchema,
  exportRequestParamsSchema,
} from "@/lib/schemas/admin-api-schema";
import {
  Child,
  Dochody,
  EmailSubscription,
  FormSubmission,
  Prisma,
} from "@prisma/client";

// Używamy silnego klucza API z zmiennych środowiskowych
const API_KEY = process.env.ADMIN_API_KEY;
if (!API_KEY) {
  console.error("ADMIN_API_KEY nie jest ustawiony w zmiennych środowiskowych!");
}

export async function GET(request: NextRequest) {
  try {
    // Usunięto zbędne logi ze względów bezpieczeństwa

    // Get IP for rate limiting
    const ip = request.headers.get("x-forwarded-for") || "anonymous";

    // Apply rate limiting for admin API - mniejszy limit dla exportu (obciążające operacje)
    if (!checkAdminRateLimit(ip, 5, 120000)) {
      // Limit 5 na 2 minuty dla dużych operacji eksportu
      return NextResponse.json(
        {
          error: "Zbyt wiele żądań eksportu. Spróbuj ponownie za kilka minut.",
        },
        { status: 429 }
      );
    }

    // Sprawdzenie klucza API z walidacją przez Zod
    const apiKey = request.headers.get("x-api-key") || "";

    try {
      adminApiKeySchema.parse({ apiKey });
    } catch (validationError) {
      return NextResponse.json(
        {
          error: "Nieprawidłowy klucz API lub brak autoryzacji",
          details:
            process.env.NODE_ENV === "development"
              ? validationError
              : undefined,
        },
        { status: 401 }
      );
    }

    // Walidacja parametrów zapytania
    const { searchParams } = new URL(request.url);
    const format = searchParams.get("format") || "xlsx";
    const includePersonalData =
      searchParams.get("includePersonalData") === "true";
    const startDate = searchParams.get("startDate") || undefined;
    const endDate = searchParams.get("endDate") || undefined;

    try {
      exportRequestParamsSchema.parse({
        format,
        includePersonalData,
        startDate,
        endDate,
      });
    } catch (validationError) {
      return NextResponse.json(
        {
          error: "Nieprawidłowe parametry zapytania",
          details:
            process.env.NODE_ENV === "development"
              ? validationError
              : undefined,
        },
        { status: 400 }
      );
    }

    // Zmienna do przechowywania formularzy
    let formSubmissions: any[] = [];
    let emailSubscriptions: any[] = [];

    try {
      console.log("Sprawdzanie struktury bazy danych...");

      // Sprawdzamy strukturę tabeli FormSubmission
      const tableInfo = await prisma.$queryRaw`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'FormSubmission'
      `;

      const columnNames = (tableInfo as any[]).map((col) => col.column_name);
      console.log("Dostępne kolumny w tabeli FormSubmission:", columnNames);

      // Sprawdzamy tabelę EmailSubscription
      console.log("Pobieranie subskrypcji email...");
      emailSubscriptions = await prisma.emailSubscription.findMany({
        orderBy: { createdAt: "desc" },
      });
      console.log(`Pobrano ${emailSubscriptions.length} subskrypcji email`); // Bezpieczne pobieranie formularzy - WSZYSTKIE pola z bazy
      console.log("Rozpoczynam pobieranie danych formularzy...");
      formSubmissions = await prisma.formSubmission.findMany({
        select: {
          id: true,
          emailSubscriptionId: true,
          formData: true,
          submittedAt: true,
          processedAt: true,
          status: true,
          reportUrl: true,

          // Dane sądowe
          rodzajSaduSad: true,
          apelacjaSad: true,
          // apelacjaId: true, // Usunięte - kolumna nie istnieje w bazie
          // apelacjaNazwa: true, // Usunięte - kolumna nie istnieje w bazie
          sadOkregowyId: true,
          // sadOkregowyNazwa: true, // Usunięte - kolumna nie istnieje w bazie
          sadRejonowyId: true,
          // sadRejonowyNazwa: true, // Usunięte - kolumna nie istnieje w bazie
          rokDecyzjiSad: true,
          miesiacDecyzjiSad: true,
          dataDecyzjiSad: true,
          liczbaSedzi: true,
          plecSedziego: true,
          inicjalySedziego: true,
          czyPozew: true,
          watekWiny: true,

          // Główne informacje
          sciezkaWybor: true,
          podstawaUstalen: true,
          podstawaUstalenInne: true,
          wariantPostepu: true,
          sposobFinansowania: true,
          liczbaDzieci: true,

          // Dane demograficzne
          plecUzytkownika: true,
          wiekUzytkownika: true,
          wojewodztwoUzytkownika: true,
          miejscowoscUzytkownika: true,
          stanCywilnyUzytkownika: true,
          plecDrugiegoRodzica: true,
          wiekDrugiegoRodzica: true,
          wojewodztwoDrugiegoRodzica: true,
          miejscowoscDrugiegoRodzica: true,

          // Dane porozumienia
          dataPorozumienia: true,
          sposobPorozumienia: true,
          formaPorozumienia: true,
          klauzulaWaloryzacyjna: true,

          // Dane ustaleń innych
          dataUstalenInnych: true,
          uzgodnienieFinansowania: true,
          planyWystapieniaDoSadu: true,

          // Oceny adekwatności
          ocenaAdekwatnosciSad: true,
          ocenaAdekwatnosciPorozumienie: true,
          ocenaAdekwatnosciInne: true,

          // Relacje
          emailSubscription: true,
          dzieci: {
            select: {
              id: true,
              formSubmissionId: true,
              childId: true,
              wiek: true,
              plec: true,
              specjalnePotrzeby: true,
              opisSpecjalnychPotrzeb: true,
              uczeszczeDoPlacowki: true,
              typPlacowki: true,
              opiekaInnejOsoby: true,
              modelOpieki: true,
              cyklOpieki: true,
              procentCzasuOpieki: true,
              kwotaAlimentow: true,
              twojeMiesieczneWydatki: true,
              wydatkiDrugiegoRodzica: true,
              kosztyUznanePrzezSad: true,
              rentaRodzinna: true,
              rentaRodzinnaKwota: true,
              swiadczeniePielegnacyjne: true,
              swiadczeniePielegnacyjneKwota: true,
              inneZrodla: true,
              inneZrodlaOpis: true,
              inneZrodlaKwota: true,
              brakDodatkowychZrodel: true,
              tabelaCzasu: true,
              wskaznikiCzasuOpieki: true,
              wakacjeProcentCzasu: true,
              wakacjeSzczegolowyPlan: true,
              wakacjeOpisPlan: true,
            },
          },
          dochodyRodzicow: {
            select: {
              id: true,
              formSubmissionId: true,
              wlasneDochodyNetto: true,
              wlasnePotencjalDochodowy: true,
              wlasneKosztyUtrzymania: true,
              wlasneKosztyInni: true,
              wlasneDodatkoweZobowiazania: true,
              drugiRodzicDochody: true,
              drugiRodzicPotencjal: true,
              drugiRodzicKoszty: true,
              drugiRodzicKosztyInni: true,
              drugiRodzicDodatkowe: true,
            },
          },
        },
        orderBy: {
          submittedAt: "desc",
        },
      });
      console.log(`Pobrano ${formSubmissions.length} formularzy z bazy danych`);

      // Dodatkowa diagnostyka danych
      console.log(`Szczegóły formularzy:`);
      console.log(`- Pierwszy formularz ID: ${formSubmissions[0]?.id}`);
      console.log(
        `- Ostatni formularz ID: ${
          formSubmissions[formSubmissions.length - 1]?.id
        }`
      );
      console.log(
        `- Liczba dzieci we wszystkich formularzach: ${formSubmissions.reduce(
          (sum, form) => sum + (form.dzieci?.length || 0),
          0
        )}`
      );
    } catch (error) {
      console.error("Błąd podczas pobierania danych z bazy:", error);
      throw new Error(
        `Błąd pobierania danych: ${
          error instanceof Error ? error.message : "Nieznany błąd"
        }`
      );
    }

    // Tworzenie workbooka Excel
    console.log("Tworzenie pliku Excel...");
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "AliMatrix Admin";
    workbook.lastModifiedBy = "AliMatrix System";
    workbook.created = new Date();
    workbook.modified = new Date();

    // --- ARKUSZ 1: Podsumowanie ---
    const summarySheet = workbook.addWorksheet("Podsumowanie");

    // Informacje o eksporcie
    summarySheet.mergeCells("A1:C1");
    summarySheet.getCell("A1").value = "EXPORT DANYCH ALIMATRIX";
    summarySheet.getCell("A1").font = { bold: true, size: 16 };

    summarySheet.getCell("A3").value = "Data eksportu:";
    summarySheet.getCell("B3").value = new Date().toLocaleString("pl-PL");
    summarySheet.getCell("A4").value = "Liczba formularzy:";
    summarySheet.getCell("B4").value = formSubmissions.length;

    summarySheet.getCell("A5").value = "Liczba subskrypcji:";
    summarySheet.getCell("B5").value = emailSubscriptions.length;

    // Dodajemy więcej szczegółów dla większej pewności poprawności danych
    summarySheet.getCell("A6").value =
      "Liczba dzieci we wszystkich formularzach:";
    summarySheet.getCell("B6").value = formSubmissions.reduce(
      (sum, form) => sum + (form.dzieci?.length || 0),
      0
    );
    summarySheet.getCell("A7").value = "Zawartość arkuszy:";
    summarySheet.getCell("A8").value = "1. Podsumowanie - ten arkusz";
    summarySheet.getCell("A9").value =
      "2. Subskrypcje - dane subskrypcji email";
    summarySheet.getCell("A10").value =
      "3. Formularze - wszystkie podstawowe dane formularzy";
    summarySheet.getCell("A11").value =
      "4. Dane o dzieciach - szczegółowe informacje o dzieciach i kosztach opieki";
    summarySheet.getCell("A12").value =
      "5. Dochody - dane o dochodach rodziców";
    summarySheet.getCell("A13").value =
      "6. Dane JSON - pełne dane formularzy w formacie JSON";

    // --- ARKUSZ 2: Subskrypcje ---
    const subscriptionSheet = workbook.addWorksheet("Subskrypcje");

    // Nagłówki
    subscriptionSheet.columns = [
      { header: "ID", key: "id", width: 25 },
      { header: "Email", key: "email", width: 30 },
      { header: "Data utworzenia", key: "createdAt", width: 20 },
      { header: "Data przesłania", key: "submittedAt", width: 20 },
      { header: "Status", key: "status", width: 15 },
      { header: "Zgoda na kontakt", key: "acceptedContact", width: 15 },
      { header: "Zgoda na przetwarzanie", key: "acceptedTerms", width: 15 },
    ];

    // Dane
    emailSubscriptions.forEach((subscription) => {
      subscriptionSheet.addRow({
        id: subscription.id,
        email: subscription.email,
        createdAt: subscription.createdAt?.toLocaleString("pl-PL") || "",
        submittedAt: subscription.submittedAt?.toLocaleString("pl-PL") || "",
        status: subscription.status,
        acceptedContact: subscription.acceptedContact ? "Tak" : "Nie",
        acceptedTerms: subscription.acceptedTerms ? "Tak" : "Nie",
      });
    }); // --- ARKUSZ 3: Formularze ---
    const formSheet = workbook.addWorksheet("Formularze");

    // Nagłówki - tylko pola które istnieją w bazie danych
    formSheet.columns = [
      // Podstawowe dane
      { header: "ID", key: "id", width: 25 },
      { header: "Email", key: "email", width: 30 },
      { header: "Data przesłania", key: "submittedAt", width: 20 },
      { header: "Data przetworzenia", key: "processedAt", width: 20 },
      { header: "Status", key: "status", width: 15 },
      { header: "URL raportu", key: "reportUrl", width: 30 },

      // Główne informacje
      { header: "Ścieżka wyboru", key: "sciezkaWybor", width: 20 },
      { header: "Podstawa ustaleń", key: "podstawaUstalen", width: 20 },
      {
        header: "Podstawa ustaleń - inne",
        key: "podstawaUstalenInne",
        width: 25,
      },
      { header: "Wariant postępowania", key: "wariantPostepu", width: 20 },
      { header: "Sposób finansowania", key: "sposobFinansowania", width: 20 },
      { header: "Liczba dzieci", key: "liczbaDzieci", width: 15 },

      // Dane demograficzne - użytkownik
      { header: "Płeć użytkownika", key: "plecUzytkownika", width: 15 },
      { header: "Wiek użytkownika", key: "wiekUzytkownika", width: 15 },
      {
        header: "Województwo użytkownika",
        key: "wojewodztwoUzytkownika",
        width: 20,
      },
      {
        header: "Miejscowość użytkownika",
        key: "miejscowoscUzytkownika",
        width: 20,
      },
      {
        header: "Stan cywilny użytkownika",
        key: "stanCywilnyUzytkownika",
        width: 20,
      },

      // Dane demograficzne - drugi rodzic
      {
        header: "Płeć drugiego rodzica",
        key: "plecDrugiegoRodzica",
        width: 15,
      },
      {
        header: "Wiek drugiego rodzica",
        key: "wiekDrugiegoRodzica",
        width: 15,
      },
      {
        header: "Województwo drugiego rodzica",
        key: "wojewodztwoDrugiegoRodzica",
        width: 20,
      },
      {
        header: "Miejscowość drugiego rodzica",
        key: "miejscowoscDrugiegoRodzica",
        width: 20,
      },

      // Dane sądowe
      { header: "Rodzaj sądu", key: "rodzajSaduSad", width: 15 },
      { header: "Apelacja (legacy)", key: "apelacjaSad", width: 15 },
      { header: "Sąd okręgowy ID", key: "sadOkregowyId", width: 20 },
      { header: "Sąd rejonowy ID", key: "sadRejonowyId", width: 20 },
      { header: "Rok decyzji", key: "rokDecyzjiSad", width: 15 },
      { header: "Miesiąc decyzji", key: "miesiacDecyzjiSad", width: 15 },
      { header: "Data decyzji", key: "dataDecyzjiSad", width: 15 },
      { header: "Liczba sędziów", key: "liczbaSedzi", width: 15 },
      { header: "Płeć sędziego", key: "plecSedziego", width: 15 },
      { header: "Inicjały sędziego", key: "inicjalySedziego", width: 15 },
      { header: "Czy pozew", key: "czyPozew", width: 15 },
      { header: "Wątek winy", key: "watekWiny", width: 20 },

      // Dane porozumienia
      { header: "Data porozumienia", key: "dataPorozumienia", width: 15 },
      { header: "Sposób porozumienia", key: "sposobPorozumienia", width: 20 },
      { header: "Forma porozumienia", key: "formaPorozumienia", width: 20 },
      {
        header: "Klauzula waloryzacyjna",
        key: "klauzulaWaloryzacyjna",
        width: 20,
      },

      // Dane ustaleń innych
      { header: "Data ustaleń innych", key: "dataUstalenInnych", width: 15 },
      {
        header: "Uzgodnienie finansowania",
        key: "uzgodnienieFinansowania",
        width: 20,
      },
      {
        header: "Plany wystąpienia do sądu",
        key: "planyWystapieniaDoSadu",
        width: 20,
      },

      // Oceny adekwatności
      {
        header: "Ocena adekwatności sądu",
        key: "ocenaAdekwatnosciSad",
        width: 15,
      },
      {
        header: "Ocena adekwatności porozumienia",
        key: "ocenaAdekwatnosciPorozumienie",
        width: 15,
      },
      {
        header: "Ocena adekwatności inne",
        key: "ocenaAdekwatnosciInne",
        width: 15,
      },

      // Dodatkowe dane
      {
        header: "Całkowita liczba dzieci",
        key: "calkowitaLiczbaDzieci",
        width: 15,
      },
      {
        header: "Sumaryczne wydatki na dzieci",
        key: "sumaryczneWydatkiNaDzieci",
        width: 20,
      },
      { header: "Własne dochody netto", key: "wlasneDochodyNetto", width: 15 },
      {
        header: "Dochody drugiego rodzica",
        key: "drugiRodzicDochody",
        width: 15,
      },
    ];

    // Dane
    formSubmissions.forEach((submission) => {
      // Ekstrahujemy dodatkowe dane z JSON, jeśli są dostępne
      const formData = submission.formData || {};
      // Obliczenie sumarycznych wydatków na dzieci
      const sumaryczneWydatki =
        submission.dzieci?.reduce(
          (sum: number, dziecko: any) =>
            sum + (dziecko.twojeMiesieczneWydatki || 0),
          0
        ) || 0;

      // Pobieramy dane o dochodach
      const dochodyData = submission.dochodyRodzicow || {};

      formSheet.addRow({
        // Podstawowe dane
        id: submission.id,
        email: submission.emailSubscription?.email || "",
        submittedAt: submission.submittedAt?.toLocaleString("pl-PL") || "",
        processedAt: submission.processedAt?.toLocaleString("pl-PL") || "",
        status: submission.status,
        reportUrl: submission.reportUrl || "",

        // Główne informacje
        sciezkaWybor: submission.sciezkaWybor || formData.sciezkaWybor || "",
        podstawaUstalen:
          submission.podstawaUstalen || formData.podstawaUstalen || "",
        podstawaUstalenInne:
          submission.podstawaUstalenInne || formData.podstawaUstalenInne || "",
        wariantPostepu:
          submission.wariantPostepu || formData.wariantPostepu || "",
        sposobFinansowania:
          submission.sposobFinansowania || formData.sposobFinansowania || "",
        liczbaDzieci: submission.liczbaDzieci || submission.dzieci?.length || 0,

        // Dane demograficzne - użytkownik
        plecUzytkownika:
          submission.plecUzytkownika || formData.plecUzytkownika || "",
        wiekUzytkownika:
          submission.wiekUzytkownika || formData.wiekUzytkownika || "",
        wojewodztwoUzytkownika:
          submission.wojewodztwoUzytkownika ||
          formData.wojewodztwoUzytkownika ||
          "",
        miejscowoscUzytkownika:
          submission.miejscowoscUzytkownika ||
          formData.miejscowoscUzytkownika ||
          "",
        stanCywilnyUzytkownika:
          submission.stanCywilnyUzytkownika ||
          formData.stanCywilnyUzytkownika ||
          "",

        // Dane demograficzne - drugi rodzic
        plecDrugiegoRodzica:
          submission.plecDrugiegoRodzica || formData.plecDrugiegoRodzica || "",
        wiekDrugiegoRodzica:
          submission.wiekDrugiegoRodzica || formData.wiekDrugiegoRodzica || "",
        wojewodztwoDrugiegoRodzica:
          submission.wojewodztwoDrugiegoRodzica ||
          formData.wojewodztwoDrugiegoRodzica ||
          "",
        miejscowoscDrugiegoRodzica:
          submission.miejscowoscDrugiegoRodzica ||
          formData.miejscowoscDrugiegoRodzica ||
          "",

        // Dane sądowe
        rodzajSaduSad: submission.rodzajSaduSad || formData.rodzajSaduSad || "",
        apelacjaSad: submission.apelacjaSad || formData.apelacjaSad || "",
        sadOkregowyId: submission.sadOkregowyId || formData.sadOkregowyId || "",
        sadRejonowyId: submission.sadRejonowyId || formData.sadRejonowyId || "",
        rokDecyzjiSad: submission.rokDecyzjiSad || formData.rokDecyzjiSad || "",
        miesiacDecyzjiSad:
          submission.miesiacDecyzjiSad || formData.miesiacDecyzjiSad || "",
        dataDecyzjiSad:
          submission.dataDecyzjiSad || formData.dataDecyzjiSad || "",
        liczbaSedzi: submission.liczbaSedzi || formData.liczbaSedzi || "",
        plecSedziego: submission.plecSedziego || formData.plecSedziego || "",
        inicjalySedziego:
          submission.inicjalySedziego || formData.inicjalySedziego || "",
        czyPozew: submission.czyPozew || formData.czyPozew || "",
        watekWiny: submission.watekWiny || formData.watekWiny || "",

        // Dane porozumienia
        dataPorozumienia:
          submission.dataPorozumienia || formData.dataPorozumienia || "",
        sposobPorozumienia:
          submission.sposobPorozumienia || formData.sposobPorozumienia || "",
        formaPorozumienia:
          submission.formaPorozumienia || formData.formaPorozumienia || "",
        klauzulaWaloryzacyjna:
          submission.klauzulaWaloryzacyjna ||
          formData.klauzulaWaloryzacyjna ||
          "",

        // Dane ustaleń innych
        dataUstalenInnych:
          submission.dataUstalenInnych || formData.dataUstalenInnych || "",
        uzgodnienieFinansowania:
          submission.uzgodnienieFinansowania ||
          formData.uzgodnienieFinansowania ||
          "",
        planyWystapieniaDoSadu:
          submission.planyWystapieniaDoSadu ||
          formData.planyWystapieniaDoSadu ||
          "",

        // Oceny adekwatności
        ocenaAdekwatnosciSad: submission.ocenaAdekwatnosciSad,
        ocenaAdekwatnosciPorozumienie: submission.ocenaAdekwatnosciPorozumienie,
        ocenaAdekwatnosciInne: submission.ocenaAdekwatnosciInne,

        // Dodatkowe dane
        calkowitaLiczbaDzieci: submission.dzieci?.length || 0,
        sumaryczneWydatkiNaDzieci: sumaryczneWydatki,
        wlasneDochodyNetto: dochodyData?.wlasneDochodyNetto || 0,
        drugiRodzicDochody: dochodyData?.drugiRodzicDochody || 0,
      });
    }); // --- ARKUSZ 4: Dane o dzieciach ---
    const childrenSheet = workbook.addWorksheet("Dane o dzieciach");

    // Nagłówki
    childrenSheet.columns = [
      { header: "ID formularza", key: "formId", width: 25 },
      { header: "ID dziecka", key: "childId", width: 15 },
      { header: "Nr dziecka", key: "childNumber", width: 10 },
      { header: "Wiek", key: "wiek", width: 10 },
      { header: "Płeć", key: "plec", width: 10 },
      { header: "Specjalne potrzeby", key: "specjalnePotrzeby", width: 15 },
      {
        header: "Opis specjalnych potrzeb",
        key: "opisSpecjalnychPotrzeb",
        width: 30,
      },
      {
        header: "Uczęszcza do placówki",
        key: "uczeszczeDoPlacowki",
        width: 15,
      },
      { header: "Typ placówki", key: "typPlacowki", width: 15 },
      { header: "Opieka innej osoby", key: "opiekaInnejOsoby", width: 15 },
      { header: "Model opieki", key: "modelOpieki", width: 15 },
      { header: "Cykl opieki", key: "cyklOpieki", width: 15 },
      { header: "Procent czasu opieki", key: "procentCzasuOpieki", width: 15 },
      { header: "Kwota alimentów", key: "kwotaAlimentow", width: 15 },
      {
        header: "Miesięczne wydatki użytkownika",
        key: "twojeMiesieczneWydatki",
        width: 20,
      },
      {
        header: "Wydatki drugiego rodzica",
        key: "wydatkiDrugiegoRodzica",
        width: 20,
      },
      {
        header: "Koszty uznane przez sąd",
        key: "kosztyUznanePrzezSad",
        width: 20,
      },
      { header: "Renta rodzinna", key: "rentaRodzinna", width: 15 },
      { header: "Kwota renty rodzinnej", key: "rentaRodzinnaKwota", width: 15 },
      {
        header: "Świadczenie pielęgnacyjne",
        key: "swiadczeniePielegnacyjne",
        width: 20,
      },
      {
        header: "Kwota świadczenia pielęgnacyjnego",
        key: "swiadczeniePielegnacyjneKwota",
        width: 20,
      },
      { header: "Inne źródła", key: "inneZrodla", width: 15 },
      { header: "Opis innych źródeł", key: "inneZrodlaOpis", width: 25 },
      { header: "Kwota z innych źródeł", key: "inneZrodlaKwota", width: 20 },
      {
        header: "Brak dodatkowych źródeł",
        key: "brakDodatkowychZrodel",
        width: 20,
      },
      {
        header: "Wakacje procent czasu",
        key: "wakacjeProcentCzasu",
        width: 20,
      },
      {
        header: "Wakacje szczegółowy plan",
        key: "wakacjeSzczegolowyPlan",
        width: 20,
      },
      { header: "Wakacje opis planu", key: "wakacjeOpisPlan", width: 30 },
    ];

    // Dane o dzieciach
    formSubmissions.forEach((submission) => {
      if (submission.dzieci && submission.dzieci.length > 0) {
        submission.dzieci.forEach((dziecko: any) => {
          childrenSheet.addRow({
            formId: submission.id,
            childId: dziecko.id,
            childNumber: dziecko.childId,
            wiek: dziecko.wiek,
            plec: dziecko.plec,
            specjalnePotrzeby: dziecko.specjalnePotrzeby ? "Tak" : "Nie",
            opisSpecjalnychPotrzeb: dziecko.opisSpecjalnychPotrzeb || "",
            uczeszczeDoPlacowki: dziecko.uczeszczeDoPlacowki ? "Tak" : "Nie",
            typPlacowki: dziecko.typPlacowki || "",
            opiekaInnejOsoby: dziecko.opiekaInnejOsoby ? "Tak" : "Nie",
            modelOpieki: dziecko.modelOpieki || "",
            cyklOpieki: dziecko.cyklOpieki || "",
            procentCzasuOpieki: dziecko.procentCzasuOpieki,
            kwotaAlimentow: dziecko.kwotaAlimentow,
            twojeMiesieczneWydatki: dziecko.twojeMiesieczneWydatki,
            wydatkiDrugiegoRodzica: dziecko.wydatkiDrugiegoRodzica,
            kosztyUznanePrzezSad: dziecko.kosztyUznanePrzezSad,
            rentaRodzinna: dziecko.rentaRodzinna ? "Tak" : "Nie",
            rentaRodzinnaKwota: dziecko.rentaRodzinnaKwota,
            swiadczeniePielegnacyjne: dziecko.swiadczeniePielegnacyjne
              ? "Tak"
              : "Nie",
            swiadczeniePielegnacyjneKwota:
              dziecko.swiadczeniePielegnacyjneKwota,
            inneZrodla: dziecko.inneZrodla ? "Tak" : "Nie",
            inneZrodlaOpis: dziecko.inneZrodlaOpis || "",
            inneZrodlaKwota: dziecko.inneZrodlaKwota,
            brakDodatkowychZrodel: dziecko.brakDodatkowychZrodel
              ? "Tak"
              : "Nie",
            wakacjeProcentCzasu: dziecko.wakacjeProcentCzasu,
            wakacjeSzczegolowyPlan: dziecko.wakacjeSzczegolowyPlan
              ? "Tak"
              : "Nie",
            wakacjeOpisPlan: dziecko.wakacjeOpisPlan || "",
          });
        });
      }
    });

    // --- ARKUSZ 5: Dochody ---
    const incomeSheet = workbook.addWorksheet("Dochody");

    // Nagłówki
    incomeSheet.columns = [
      { header: "ID formularza", key: "formId", width: 25 },
      { header: "ID dochodów", key: "incomeId", width: 25 },
      { header: "Email", key: "email", width: 30 },
      // Dochody wypełniającego
      { header: "Własne dochody netto", key: "wlasneDochodyNetto", width: 20 },
      {
        header: "Własny potencjał dochodowy",
        key: "wlasnePotencjalDochodowy",
        width: 20,
      },
      {
        header: "Własne koszty utrzymania",
        key: "wlasneKosztyUtrzymania",
        width: 20,
      },
      {
        header: "Własne koszty innych osób",
        key: "wlasneKosztyInni",
        width: 20,
      },
      {
        header: "Własne dodatkowe zobowiązania",
        key: "wlasneDodatkoweZobowiazania",
        width: 25,
      },
      // Dochody drugiego rodzica
      {
        header: "Dochody drugiego rodzica",
        key: "drugiRodzicDochody",
        width: 20,
      },
      {
        header: "Potencjał drugiego rodzica",
        key: "drugiRodzicPotencjal",
        width: 20,
      },
      {
        header: "Koszty drugiego rodzica",
        key: "drugiRodzicKoszty",
        width: 20,
      },
      {
        header: "Koszty innych osób (drugi rodzic)",
        key: "drugiRodzicKosztyInni",
        width: 25,
      },
      {
        header: "Dodatkowe zobowiązania (drugi rodzic)",
        key: "drugiRodzicDodatkowe",
        width: 25,
      },
    ];

    // Dane o dochodach
    formSubmissions.forEach((submission) => {
      if (submission.dochodyRodzicow) {
        incomeSheet.addRow({
          formId: submission.id,
          incomeId: submission.dochodyRodzicow.id,
          email: submission.emailSubscription?.email || "",
          wlasneDochodyNetto: submission.dochodyRodzicow.wlasneDochodyNetto,
          wlasnePotencjalDochodowy:
            submission.dochodyRodzicow.wlasnePotencjalDochodowy,
          wlasneKosztyUtrzymania:
            submission.dochodyRodzicow.wlasneKosztyUtrzymania,
          wlasneKosztyInni: submission.dochodyRodzicow.wlasneKosztyInni,
          wlasneDodatkoweZobowiazania:
            submission.dochodyRodzicow.wlasneDodatkoweZobowiazania,
          drugiRodzicDochody: submission.dochodyRodzicow.drugiRodzicDochody,
          drugiRodzicPotencjal: submission.dochodyRodzicow.drugiRodzicPotencjal,
          drugiRodzicKoszty: submission.dochodyRodzicow.drugiRodzicKoszty,
          drugiRodzicKosztyInni:
            submission.dochodyRodzicow.drugiRodzicKosztyInni,
          drugiRodzicDodatkowe: submission.dochodyRodzicow.drugiRodzicDodatkowe,
        });
      }
    });

    // --- ARKUSZ 6: Pełne dane JSON ---
    const jsonSheet = workbook.addWorksheet("Dane JSON");

    // Nagłówki
    jsonSheet.columns = [
      { header: "ID", key: "id", width: 25 },
      { header: "Pełne dane formularza (JSON)", key: "jsonData", width: 150 },
    ];

    // Dane JSON
    formSubmissions.forEach((submission) => {
      jsonSheet.addRow({
        id: submission.id,
        jsonData: JSON.stringify(submission.formData || {}),
      });
    }); // Zapisz workbook do bufora
    console.log("Generowanie pliku Excel...");
    const buffer = await workbook.xlsx.writeBuffer();

    // Oblicz rozmiar pliku w MB
    const fileSizeInMB = (buffer.byteLength / (1024 * 1024)).toFixed(2);
    console.log(`Rozmiar pliku: ${fileSizeInMB} MB`);

    // Zwróć plik Excel jako odpowiedź
    console.log("Eksport Excel zakończony sukcesem");
    return new NextResponse(buffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="alimatrix-export-${new Date()
          .toISOString()
          .slice(0, 10)}.xlsx"`,
        "X-File-Size": fileSizeInMB,
      },
    });
  } catch (error) {
    console.error("Błąd podczas generowania pliku Excel:", error);
    return NextResponse.json(
      {
        error: `Error generating Excel: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      },
      { status: 500 }
    );
  }
}

// Endpoint do generowania pliku Excel z pełnymi danymi z bazy
// Ulepszony eksport - naprawia problemy z relacjami i brakującymi kolumnami
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import * as ExcelJS from "exceljs";
import {
  Child,
  Dochody,
  EmailSubscription,
  FormSubmission,
  Prisma,
} from "@prisma/client";

// Proste zabezpieczenie - w produkcji należałoby to zamienić na uwierzytelnianie
const API_KEY = process.env.ADMIN_API_KEY || "tajny_klucz_admin_2025";

export async function GET(request: NextRequest) {
  try {
    console.log(
      "Żądanie eksportu Excel otrzymane - COMPLETE VERSION - " +
        new Date().toISOString()
    );

    // Sprawdzenie klucza API
    const apiKey = request.headers.get("x-api-key");
    if (apiKey !== API_KEY) {
      console.log("Błąd autoryzacji - niepoprawny klucz API");
      return NextResponse.json({ error: "Brak autoryzacji" }, { status: 401 });
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
      console.log(`Pobrano ${emailSubscriptions.length} subskrypcji email`);

      // Bezpieczne pobieranie formularzy - WSZYSTKIE pola z bazy
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

          // Dane sądowe - tylko te pola, które istnieją w bazie
          rodzajSaduSad: true,
          apelacjaSad: true,
          sadOkregowyId: true,
          sadRejonowyId: true,
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

      // Sprawdzanie dzieci w formData
      let childrenInFormData = 0;
      formSubmissions.forEach((form) => {
        if (
          form.formData &&
          form.formData.dzieci &&
          Array.isArray(form.formData.dzieci)
        ) {
          childrenInFormData += form.formData.dzieci.length;
        }
      });

      console.log(`- Liczba dzieci w formData JSON: ${childrenInFormData}`);
      console.log(
        `- Liczba dzieci w relacji dzieci: ${formSubmissions.reduce(
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
    const childrenInFormData = formSubmissions.reduce((sum, form) => {
      if (
        form.formData &&
        form.formData.dzieci &&
        Array.isArray(form.formData.dzieci)
      ) {
        return sum + form.formData.dzieci.length;
      }
      return sum;
    }, 0);

    summarySheet.getCell("A6").value = "Liczba dzieci w relacji dzieci:";
    summarySheet.getCell("B6").value = formSubmissions.reduce(
      (sum, form) => sum + (form.dzieci?.length || 0),
      0
    );

    summarySheet.getCell("A7").value = "Liczba dzieci w formData JSON:";
    summarySheet.getCell("B7").value = childrenInFormData;

    summarySheet.getCell("A9").value = "Zawartość arkuszy:";
    summarySheet.getCell("A10").value = "1. Podsumowanie - ten arkusz";
    summarySheet.getCell("A11").value =
      "2. Subskrypcje - dane subskrypcji email";
    summarySheet.getCell("A12").value =
      "3. Formularze - wszystkie podstawowe dane formularzy";
    summarySheet.getCell("A13").value =
      "4. Dane o dzieciach - szczegółowe informacje o dzieciach i kosztach opieki";
    summarySheet.getCell("A14").value =
      "5. Dane o dzieciach z formData - dane dzieci wyekstrahowane z JSON";
    summarySheet.getCell("A15").value =
      "6. Dochody - dane o dochodach rodziców";
    summarySheet.getCell("A16").value =
      "7. Dane JSON - pełne dane formularzy w formacie JSON";

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
    });

    // --- ARKUSZ 3: Formularze ---
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
      { header: "Rok decyzji sądu", key: "rokDecyzjiSad", width: 15 },
      { header: "Miesiąc decyzji sądu", key: "miesiacDecyzjiSad", width: 15 },
      { header: "Data decyzji sądu", key: "dataDecyzjiSad", width: 15 },
      { header: "Liczba sędziów", key: "liczbaSedzi", width: 15 },
      { header: "Płeć sędziego", key: "plecSedziego", width: 15 },
      { header: "Inicjały sędziego", key: "inicjalySedziego", width: 15 },
      { header: "Czy pozew", key: "czyPozew", width: 15 },
      { header: "Wątek winy", key: "watekWiny", width: 15 },

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
        header: "Ocena adekwatności - sąd",
        key: "ocenaAdekwatnosciSad",
        width: 20,
      },
      {
        header: "Ocena adekwatności - porozumienie",
        key: "ocenaAdekwatnosciPorozumienie",
        width: 25,
      },
      {
        header: "Ocena adekwatności - inne",
        key: "ocenaAdekwatnosciInne",
        width: 20,
      },

      // Dane liczbowe
      {
        header: "Liczba dzieci (relacja)",
        key: "calkowitaLiczbaDzieci",
        width: 15,
      },
      {
        header: "Sumaryczne wydatki na dzieci",
        key: "sumaryczneWydatkiNaDzieci",
        width: 25,
      },
      { header: "Własne dochody netto", key: "wlasneDochodyNetto", width: 20 },
      {
        header: "Dochody drugiego rodzica",
        key: "drugiRodzicDochody",
        width: 20,
      },
    ];

    // Dodanie danych formularzy
    for (const submission of formSubmissions) {
      // Wyliczamy sumaryczne wydatki na dzieci
      const sumaryczneWydatki =
        submission.dzieci?.reduce(
          (sum, dziecko) =>
            sum +
            (parseFloat(dziecko.twojeMiesieczneWydatki || "0") +
              parseFloat(dziecko.wydatkiDrugiegoRodzica || "0")),
          0
        ) || 0;

      // Pobieramy dane o dochodach
      const dochodyData = submission.dochodyRodzicow;

      // Kluczowe - formData
      const formData = submission.formData || {};

      // Dodajemy wiersz
      formSheet.addRow({
        // Podstawowe dane
        id: submission.id,
        email: submission.emailSubscription?.email,
        submittedAt: submission.submittedAt?.toLocaleString("pl-PL") || "",
        processedAt: submission.processedAt?.toLocaleString("pl-PL") || "",
        status: submission.status,
        reportUrl: submission.reportUrl,

        // Dane główne
        sciezkaWybor: submission.sciezkaWybor || formData.sciezkaWybor || "",
        podstawaUstalen:
          submission.podstawaUstalen || formData.podstawaUstalen || "",
        podstawaUstalenInne:
          submission.podstawaUstalenInne || formData.podstawaUstalenInne || "",
        wariantPostepu:
          submission.wariantPostepu || formData.wariantPostepu || "",
        sposobFinansowania:
          submission.sposobFinansowania || formData.sposobFinansowania || "",
        liczbaDzieci: submission.liczbaDzieci || formData.liczbaDzieci || "",

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
    }

    // --- ARKUSZ 4: Dane o dzieciach ---
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

    // Dodanie danych o dzieciach
    formSubmissions.forEach((submission) => {
      const formEmail = submission.emailSubscription?.email;

      // Jeśli są dane dzieci w relacji, dodajemy je
      if (submission.dzieci && submission.dzieci.length > 0) {
        submission.dzieci.forEach((dziecko, index) => {
          childrenSheet.addRow({
            formId: submission.id,
            childId: dziecko.id,
            childNumber: index + 1,
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
            kwotaAlimentow: dziecko.kwotaAlimentow,
            twojeMiesieczneWydatki: dziecko.twojeMiesieczneWydatki,
            wydatkiDrugiegoRodzica: dziecko.wydatkiDrugiegoRodzica,
            kosztyUznanePrzezSad: dziecko.kosztyUznanePrzezSad,
            rentaRodzinna: dziecko.rentaRodzinna,
            rentaRodzinnaKwota: dziecko.rentaRodzinnaKwota,
            swiadczeniePielegnacyjne: dziecko.swiadczeniePielegnacyjne,
            swiadczeniePielegnacyjneKwota:
              dziecko.swiadczeniePielegnacyjneKwota,
            inneZrodla: dziecko.inneZrodla,
            inneZrodlaOpis: dziecko.inneZrodlaOpis,
            inneZrodlaKwota: dziecko.inneZrodlaKwota,
            brakDodatkowychZrodel: dziecko.brakDodatkowychZrodel,
            wakacjeProcentCzasu: dziecko.wakacjeProcentCzasu,
            wakacjeSzczegolowyPlan: dziecko.wakacjeSzczegolowyPlan,
            wakacjeOpisPlan: dziecko.wakacjeOpisPlan,
          });
        });
      }
    });

    // --- ARKUSZ 5: Dane dzieci z formData ---
    const childrenFromFormDataSheet = workbook.addWorksheet(
      "Dane o dzieciach z formData"
    );

    // Nagłówki
    childrenFromFormDataSheet.columns = [
      { header: "ID formularza", key: "formId", width: 25 },
      { header: "Email", key: "email", width: 30 },
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
    ];

    // Dodanie danych o dzieciach z formData JSON
    formSubmissions.forEach((submission) => {
      const formEmail = submission.emailSubscription?.email;
      const formData = submission.formData || {};

      // Jeśli są dane dzieci w formData JSON, dodajemy je
      if (
        formData.dzieci &&
        Array.isArray(formData.dzieci) &&
        formData.dzieci.length > 0
      ) {
        formData.dzieci.forEach((dziecko, index) => {
          childrenFromFormDataSheet.addRow({
            formId: submission.id,
            email: formEmail,
            childNumber: index + 1,
            wiek: dziecko.wiek,
            plec: dziecko.plec,
            specjalnePotrzeby: dziecko.specjalnePotrzeby,
            opisSpecjalnychPotrzeb: dziecko.opisSpecjalnychPotrzeb,
            uczeszczeDoPlacowki: dziecko.uczeszczeDoPlacowki,
            typPlacowki: dziecko.typPlacowki,
            procentCzasuOpieki: dziecko.procentCzasuOpieki,
            kwotaAlimentow: dziecko.kwotaAlimentow,
            twojeMiesieczneWydatki: dziecko.twojeMiesieczneWydatki,
            wydatkiDrugiegoRodzica: dziecko.wydatkiDrugiegoRodzica,
          });
        });
      }
    });

    // --- ARKUSZ 6: Dane o dochodach ---
    const incomeSheet = workbook.addWorksheet("Dochody");

    // Nagłówki
    incomeSheet.columns = [
      { header: "ID formularza", key: "formId", width: 25 },
      { header: "Email", key: "email", width: 30 },
      { header: "Własne dochody netto", key: "wlasneDochodyNetto", width: 15 },
      {
        header: "Własny potencjał dochodowy",
        key: "wlasnePotencjal",
        width: 20,
      },
      { header: "Własne koszty utrzymania", key: "wlasneKoszty", width: 20 },
      {
        header: "Własne koszty innych osób",
        key: "wlasneKosztyInni",
        width: 20,
      },
      {
        header: "Własne dodatkowe zobowiązania",
        key: "wlasneDodatkowe",
        width: 25,
      },
      { header: "Dochody drugiego rodzica", key: "drugiDochody", width: 15 },
      {
        header: "Potencjał drugiego rodzica",
        key: "drugiPotencjal",
        width: 20,
      },
      { header: "Koszty drugiego rodzica", key: "drugiKoszty", width: 20 },
      {
        header: "Koszty innych osób (drugi rodzic)",
        key: "drugiKosztyInni",
        width: 25,
      },
      {
        header: "Dodatkowe zobowiązania (drugi rodzic)",
        key: "drugiDodatkowe",
        width: 25,
      },
    ];

    // Dodanie danych o dochodach
    formSubmissions.forEach((submission) => {
      if (submission.dochodyRodzicow) {
        const dochody = submission.dochodyRodzicow;

        incomeSheet.addRow({
          formId: submission.id,
          email: submission.emailSubscription?.email,
          wlasneDochodyNetto: dochody.wlasneDochodyNetto,
          wlasnePotencjal: dochody.wlasnePotencjalDochodowy,
          wlasneKoszty: dochody.wlasneKosztyUtrzymania,
          wlasneKosztyInni: dochody.wlasneKosztyInni,
          wlasneDodatkowe: dochody.wlasneDodatkoweZobowiazania,
          drugiDochody: dochody.drugiRodzicDochody,
          drugiPotencjal: dochody.drugiRodzicPotencjal,
          drugiKoszty: dochody.drugiRodzicKoszty,
          drugiKosztyInni: dochody.drugiRodzicKosztyInni,
          drugiDodatkowe: dochody.drugiRodzicDodatkowe,
        });
      } else if (submission.formData && submission.formData.dochodyRodzicow) {
        // Jeśli nie ma bezpośredniej relacji, spróbuj pobrać z formData
        const dochodyFormData = submission.formData.dochodyRodzicow;

        incomeSheet.addRow({
          formId: submission.id,
          email: submission.emailSubscription?.email,
          wlasneDochodyNetto: dochodyFormData.wlasneDochodyNetto,
          wlasnePotencjal: dochodyFormData.wlasnePotencjalDochodowy,
          wlasneKoszty: dochodyFormData.wlasneKosztyUtrzymania,
          wlasneKosztyInni: dochodyFormData.wlasneKosztyInni,
          wlasneDodatkowe: dochodyFormData.wlasneDodatkoweZobowiazania,
          drugiDochody: dochodyFormData.drugiRodzicDochody,
          drugiPotencjal: dochodyFormData.drugiRodzicPotencjal,
          drugiKoszty: dochodyFormData.drugiRodzicKoszty,
          drugiKosztyInni: dochodyFormData.drugiRodzicKosztyInni,
          drugiDodatkowe: dochodyFormData.drugiRodzicDodatkowe,
        });
      }
    });

    // --- ARKUSZ 7: Dane JSON ---
    const jsonSheet = workbook.addWorksheet("Dane JSON");

    // Nagłówki
    jsonSheet.columns = [
      { header: "ID formularza", key: "id", width: 25 },
      { header: "Email", key: "email", width: 30 },
      { header: "Data przesłania", key: "submittedAt", width: 20 },
      { header: "JSON formularza", key: "formData", width: 150 },
    ];

    // Dane JSON
    formSubmissions.forEach((submission) => {
      jsonSheet.addRow({
        id: submission.id,
        email: submission.emailSubscription?.email,
        submittedAt: submission.submittedAt?.toLocaleString("pl-PL") || "",
        formData: JSON.stringify(submission.formData || {}),
      });
    });

    // Tworzenie bufora z danymi Excel
    console.log("Pakowanie pliku Excel do bufora...");
    const buffer = await workbook.xlsx.writeBuffer();

    // Zwrócenie pliku Excel jako odpowiedzi
    console.log("Zwracanie pliku Excel jako odpowiedzi HTTP...");
    return new NextResponse(buffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename=alimatrix-export-${new Date()
          .toISOString()
          .slice(0, 10)}.xlsx`,
      },
    });
  } catch (error) {
    console.error("Błąd generowania Excela:", error);
    return NextResponse.json(
      {
        error: `Wystąpił błąd: ${
          error instanceof Error ? error.message : "Nieznany błąd"
        }`,
      },
      { status: 500 }
    );
  }
}

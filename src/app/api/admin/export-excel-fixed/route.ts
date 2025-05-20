// Endpoint do generowania pliku Excel z pełnymi danymi z bazy
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
      "Żądanie eksportu Excel otrzymane - FIXED VERSION - " +
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

      // Bezpieczne pobieranie formularzy - tylko pola, które na pewno istnieją
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
          sciezkaWybor: true,
          podstawaUstalen: true,
          podstawaUstalenInne: true,
          wariantPostepu: true,
          sposobFinansowania: true,
          liczbaDzieci: true,
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
      "3. Formularze - podstawowe dane formularzy";
    summarySheet.getCell("A11").value =
      "4. Dane JSON - pełne dane formularzy w formacie JSON";

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

    // Nagłówki
    formSheet.columns = [
      { header: "ID", key: "id", width: 25 },
      { header: "Email", key: "email", width: 30 },
      { header: "Data przesłania", key: "submittedAt", width: 20 },
      { header: "Status", key: "status", width: 15 },
      { header: "Ścieżka wyboru", key: "sciezkaWybor", width: 20 },
      { header: "Sposób finansowania", key: "sposobFinansowania", width: 20 },
      { header: "Liczba dzieci", key: "liczbaDzieci", width: 15 },
      { header: "Podstawa ustaleń", key: "podstawaUstalen", width: 20 },
      {
        header: "Województwo użytkownika",
        key: "wojewodztwoUzytkownika",
        width: 20,
      },
    ];

    // Dane
    formSubmissions.forEach((submission) => {
      // Ekstrahujemy dodatkowe dane z JSON, jeśli są dostępne
      const formData = submission.formData || {};

      formSheet.addRow({
        id: submission.id,
        email: submission.emailSubscription?.email || "",
        submittedAt: submission.submittedAt?.toLocaleString("pl-PL") || "",
        status: submission.status,
        sciezkaWybor: formData.sciezkaWybor || submission.sciezkaWybor || "",
        sposobFinansowania:
          formData.sposobFinansowania || submission.sposobFinansowania || "",
        liczbaDzieci: submission.dzieci?.length || formData.liczbaDzieci || 0,
        podstawaUstalen:
          formData.podstawaUstalen || submission.podstawaUstalen || "",
        wojewodztwoUzytkownika:
          formData.wojewodztwoUzytkownika ||
          submission.wojewodztwoUzytkownika ||
          "",
      });
    });

    // --- ARKUSZ 4: Pełne dane JSON ---
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
    });

    // Zapisz workbook do bufora
    console.log("Generowanie pliku Excel...");
    const buffer = await workbook.xlsx.writeBuffer();

    // Zwróć plik Excel jako odpowiedź
    console.log("Eksport Excel zakończony sukcesem");
    return new NextResponse(buffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="alimatrix-export-${new Date()
          .toISOString()
          .slice(0, 10)}.xlsx"`,
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

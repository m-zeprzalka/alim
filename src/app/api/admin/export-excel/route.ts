// Endpoint do generowania pliku Excel z pełnymi danymi z bazy
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import * as ExcelJS from "exceljs";

// Proste zabezpieczenie - w produkcji należałoby to zamienić na uwierzytelnianie
const API_KEY = process.env.ADMIN_API_KEY || "tajny_klucz_admin_2025";

export async function GET(request: NextRequest) {
  try {
    // Sprawdzenie klucza API
    const apiKey = request.headers.get("x-api-key");
    if (apiKey !== API_KEY) {
      return NextResponse.json({ error: "Brak autoryzacji" }, { status: 401 });
    } // Definicja typu dla danych z raw query
    type FormSubmissionWithEmail = {
      formid: string;
      emailsubscriptionid: string;
      submittedat: Date | null;
      processedat: Date | null;
      formstatus: string;
      reporturl: string | null;
      rodzajsadusad: string | null;
      apelacjasad: string | null;
      sadokregowyid: string | null;
      rokdecyzjisad: string | null;
      watekviny: string | null;
      formdata: Record<string, any> | null;
      subscriptionid: string;
      email: string;
      createdat: Date;
      updatedat: Date;
      subscriptionsubmittedat: Date | null;
      acceptedterms: boolean;
      acceptedcontact: boolean;
      subscriptionstatus: string;
      verificationtoken: string | null;
      verifiedat: Date | null;
    }; // Pobranie wszystkich danych z bazy za pomocą raw query dla pełnej kontroli
    const allData = await prisma.$queryRaw<FormSubmissionWithEmail[]>`
      SELECT 
        fs."id" as formid,
        fs."emailSubscriptionId" as emailsubscriptionid,
        fs."submittedAt" as submittedat,
        fs."processedAt" as processedat,
        fs."status" as formstatus,
        fs."reportUrl" as reporturl,
        fs."rodzajSaduSad" as rodzajsadusad,
        fs."apelacjaSad" as apelacjasad,
        fs."sadOkregowyId" as sadokregowyid,
        fs."rokDecyzjiSad" as rokdecyzjisad,
        fs."watekWiny" as watekviny,
        fs."formData" as formdata,
        es."id" as subscriptionid,
        es."email" as email,
        es."createdAt" as createdat,
        es."updatedAt" as updatedat,
        es."submittedAt" as subscriptionsubmittedat,
        es."acceptedTerms" as acceptedterms,
        es."acceptedContact" as acceptedcontact,
        es."status" as subscriptionstatus,
        es."verificationToken" as verificationtoken,
        es."verifiedAt" as verifiedat
      FROM "FormSubmission" fs
      JOIN "EmailSubscription" es ON fs."emailSubscriptionId" = es."id"
    `;

    // Tworzenie workbooka Excel
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

    summarySheet.getCell("A4").value = "Liczba rekordów:";
    summarySheet.getCell("B4").value = allData.length;

    summarySheet.getCell("A6").value = "Zawartość arkuszy:";
    summarySheet.getCell("A7").value = "1. Podsumowanie - ten arkusz";
    summarySheet.getCell("A8").value =
      "2. Formularze - podstawowe dane formularzy";
    summarySheet.getCell("A9").value =
      "3. Subskrypcje - dane subskrypcji email";
    summarySheet.getCell("A10").value =
      "4. Dane sądowe - informacje o postępowaniach sądowych";
    summarySheet.getCell("A11").value = "5. Dzieci - dane o dzieciach";
    summarySheet.getCell("A12").value =
      "6. Finansowanie - dane o alimentach i kosztach";
    summarySheet.getCell("A13").value =
      "7. Dochody - dane o dochodach rodziców";
    summarySheet.getCell("A14").value =
      "8. Pełne dane JSON - wszystkie dane formularza w formacie JSON";

    // --- ARKUSZ 2: Formularze - podstawowe informacje ---
    const formsSheet = workbook.addWorksheet("Formularze");
    formsSheet.columns = [
      { header: "ID Formularza", key: "formid", width: 40 },
      { header: "Email", key: "email", width: 30 },
      { header: "Status formularza", key: "formstatus", width: 15 },
      { header: "Data złożenia", key: "submittedat", width: 20 },
      { header: "Data przetworzenia", key: "processedat", width: 20 },
      { header: "URL raportu", key: "reporturl", width: 40 },
      { header: "Ścieżka wybór", key: "sciezkaWybor", width: 20 },
      { header: "Podstawa ustaleń", key: "podstawaUstalen", width: 25 },
      { header: "Sposób finansowania", key: "sposobFinansowania", width: 25 },
      { header: "Wariant postępu", key: "wariantPostepu", width: 20 },
    ];

    // Styl nagłówków
    formsSheet.getRow(1).font = { bold: true };
    formsSheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFE0E0E0" },
    };

    // --- ARKUSZ 3: Subskrypcje email ---
    const subscriptionsSheet = workbook.addWorksheet("Subskrypcje");
    subscriptionsSheet.columns = [
      { header: "ID Subskrypcji", key: "subscriptionid", width: 40 },
      { header: "Email", key: "email", width: 30 },
      { header: "Status subskrypcji", key: "subscriptionstatus", width: 15 },
      { header: "Data utworzenia", key: "createdat", width: 20 },
      { header: "Data aktualizacji", key: "updatedat", width: 20 },
      { header: "Data złożenia", key: "subscriptionsubmittedat", width: 20 },
      { header: "Data weryfikacji", key: "verifiedat", width: 20 },
      { header: "Token weryfikacji", key: "verificationtoken", width: 40 },
      { header: "Akceptacja regulaminu", key: "acceptedterms", width: 15 },
      { header: "Zgoda na kontakt", key: "acceptedcontact", width: 15 },
    ];

    subscriptionsSheet.getRow(1).font = { bold: true };
    subscriptionsSheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFE0E0E0" },
    };

    // --- ARKUSZ 4: Dane sądowe ---
    const courtSheet = workbook.addWorksheet("Dane sądowe");
    courtSheet.columns = [
      { header: "ID Formularza", key: "formid", width: 40 },
      { header: "Email", key: "email", width: 30 },
      { header: "Rodzaj sądu", key: "rodzajsadusad", width: 15 },
      { header: "Apelacja", key: "apelacjasad", width: 20 },
      { header: "ID sądu okręgowego", key: "sadokregowyid", width: 25 },
      { header: "Rok decyzji", key: "rokdecyzjisad", width: 15 },
      { header: "Miesiąc decyzji", key: "miesiacdecyzjisad", width: 15 },
      { header: "Wątek winy", key: "watekviny", width: 25 },
      { header: "Liczba sędziów", key: "liczbaSedzi", width: 15 },
      { header: "Płeć sędziego", key: "plecSedziego", width: 15 },
      { header: "Inicjały sędziego", key: "inicjalySedziego", width: 15 },
      { header: "Czy pozew", key: "czyPozew", width: 10 },
    ];

    courtSheet.getRow(1).font = { bold: true };
    courtSheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFE0E0E0" },
    };

    // --- ARKUSZ 5: Dzieci ---
    const childrenSheet = workbook.addWorksheet("Dzieci");
    childrenSheet.columns = [
      { header: "ID Formularza", key: "formid", width: 40 },
      { header: "Email", key: "email", width: 30 },
      { header: "Liczba dzieci", key: "liczbaDzieci", width: 15 },
      { header: "ID Dziecka", key: "childId", width: 10 },
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
      { header: "Typ placówki", key: "typPlacowki", width: 20 },
      { header: "Model opieki", key: "modelOpieki", width: 15 },
      { header: "Cykl opieki", key: "cyklOpieki", width: 15 },
      { header: "% czasu opieki", key: "procentCzasuOpieki", width: 15 },
    ];

    childrenSheet.getRow(1).font = { bold: true };
    childrenSheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFE0E0E0" },
    };

    // --- ARKUSZ 6: Finansowanie ---
    const financeSheet = workbook.addWorksheet("Finansowanie");
    financeSheet.columns = [
      { header: "ID Formularza", key: "formid", width: 40 },
      { header: "Email", key: "email", width: 30 },
      { header: "ID Dziecka", key: "childId", width: 10 },
      { header: "Kwota alimentów", key: "kwotaAlimentow", width: 15 },
      {
        header: "Twoje miesięczne wydatki",
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
      {
        header: "Świadczenie pielęgnacyjne",
        key: "swiadczeniePielegnacyjne",
        width: 20,
      },
      { header: "Inne źródła", key: "inneZrodla", width: 15 },
      { header: "Opis innych źródeł", key: "inneZrodlaOpis", width: 30 },
    ];

    financeSheet.getRow(1).font = { bold: true };
    financeSheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFE0E0E0" },
    };

    // --- ARKUSZ 7: Dochody ---
    const incomeSheet = workbook.addWorksheet("Dochody");
    incomeSheet.columns = [
      { header: "ID Formularza", key: "formid", width: 40 },
      { header: "Email", key: "email", width: 30 },
      { header: "Twoje dochody netto", key: "wlasneDochodyNetto", width: 20 },
      {
        header: "Twój potencjał dochodowy",
        key: "wlasnePotencjalDochodowy",
        width: 20,
      },
      {
        header: "Twoje koszty utrzymania",
        key: "wlasneKosztyUtrzymania",
        width: 20,
      },
      {
        header: "Twoje koszty utrzymania innych osób",
        key: "wlasneKosztyInni",
        width: 25,
      },
      {
        header: "Twoje dodatkowe zobowiązania",
        key: "wlasneDodatkoweZobowiazania",
        width: 25,
      },
      {
        header: "Dochody drugiego rodzica",
        key: "drugiRodzicDochody",
        width: 20,
      },
      {
        header: "Potencjał dochodowy drugiego rodzica",
        key: "drugiRodzicPotencjal",
        width: 25,
      },
      {
        header: "Koszty utrzymania drugiego rodzica",
        key: "drugiRodzicKoszty",
        width: 25,
      },
      {
        header: "Koszty utrzymania innych osób (drugi rodzic)",
        key: "drugiRodzicKosztyInni",
        width: 30,
      },
      {
        header: "Dodatkowe zobowiązania drugiego rodzica",
        key: "drugiRodzicDodatkowe",
        width: 30,
      },
    ];

    incomeSheet.getRow(1).font = { bold: true };
    incomeSheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFE0E0E0" },
    };

    // --- ARKUSZ 8: Wszystkie dane JSON ---
    const jsonDataSheet = workbook.addWorksheet("Pełne dane JSON");
    jsonDataSheet.columns = [
      { header: "ID Formularza", key: "formid", width: 40 },
      { header: "Email", key: "email", width: 30 },
      {
        header: "Pełne dane formularza (JSON)",
        key: "formDataJson",
        width: 150,
      },
    ];

    jsonDataSheet.getRow(1).font = { bold: true };
    jsonDataSheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFE0E0E0" },
    };

    // Wypełnianie arkuszy danymi
    allData.forEach((data: any) => {
      const formData = data.formdata || {}; // Dane podstawowe formularza
      formsSheet.addRow({
        formid: data.formid,
        email: data.email,
        formstatus: data.formstatus,
        submittedat: data.submittedat
          ? new Date(data.submittedat).toLocaleString("pl-PL")
          : null,
        processedat: data.processedat
          ? new Date(data.processedat).toLocaleString("pl-PL")
          : null,
        reporturl: data.reporturl,
        sciezkaWybor: formData.sciezkaWybor,
        podstawaUstalen: formData.podstawaUstalen,
        sposobFinansowania: formData.sposobFinansowania,
        wariantPostepu: formData.wariantPostepu,
      }); // Dane subskrypcji
      subscriptionsSheet.addRow({
        subscriptionid: data.subscriptionid,
        email: data.email,
        subscriptionstatus: data.subscriptionstatus,
        createdat: data.createdat
          ? new Date(data.createdat).toLocaleString("pl-PL")
          : null,
        updatedat: data.updatedat
          ? new Date(data.updatedat).toLocaleString("pl-PL")
          : null,
        subscriptionsubmittedat: data.subscriptionsubmittedat
          ? new Date(data.subscriptionsubmittedat).toLocaleString("pl-PL")
          : null,
        verifiedat: data.verifiedat
          ? new Date(data.verifiedat).toLocaleString("pl-PL")
          : null,
        verificationtoken: data.verificationtoken,
        acceptedterms: data.acceptedterms ? "Tak" : "Nie",
        acceptedcontact: data.acceptedcontact ? "Tak" : "Nie",
      }); // Dane sądowe
      courtSheet.addRow({
        formid: data.formid,
        email: data.email,
        rodzajsadusad: data.rodzajsadusad || formData.rodzajSaduSad,
        apelacjasad: data.apelacjasad || formData.apelacjaSad,
        sadokregowyid: data.sadokregowyid || formData.sadOkregowyId,
        rokdecyzjisad: data.rokdecyzjisad || formData.rokDecyzjiSad,
        miesiacdecyzjisad: formData.miesiacDecyzjiSad,
        watekviny: data.watekviny || formData.watekWiny,
        liczbaSedzi: formData.liczbaSedzi,
        plecSedziego: formData.plecSedziego,
        inicjalySedziego: formData.inicjalySedziego,
        czyPozew: formData.czyPozew,
      });

      // Dane dzieci
      if (formData.dzieci && Array.isArray(formData.dzieci)) {
        formData.dzieci.forEach((dziecko: any, index: number) => {
          childrenSheet.addRow({
            formid: data.formid,
            email: data.email,
            liczbaDzieci: formData.liczbaDzieci,
            childId: dziecko.id,
            wiek: dziecko.wiek,
            plec: dziecko.plec,
            specjalnePotrzeby: dziecko.specjalnePotrzeby ? "Tak" : "Nie",
            opisSpecjalnychPotrzeb: dziecko.opisSpecjalnychPotrzeb,
            uczeszczeDoPlacowki: dziecko.uczeszczeDoPlacowki ? "Tak" : "Nie",
            typPlacowki: dziecko.typPlacowki,
            modelOpieki: dziecko.modelOpieki,
            cyklOpieki: dziecko.cyklOpieki,
            procentCzasuOpieki: dziecko.procentCzasuOpieki,
          });
        });
      }

      // Dane finansowania
      if (formData.kosztyDzieci && Array.isArray(formData.kosztyDzieci)) {
        formData.kosztyDzieci.forEach((koszt: any) => {
          financeSheet.addRow({
            formid: data.formid,
            email: data.email,
            childId: koszt.id,
            kwotaAlimentow: koszt.kwotaAlimentow,
            twojeMiesieczneWydatki: koszt.twojeMiesieczneWydatki,
            wydatkiDrugiegoRodzica: koszt.wydatkiDrugiegoRodzica,
            kosztyUznanePrzezSad: koszt.kosztyUznanePrzezSad,
            rentaRodzinna: koszt.inneZrodlaUtrzymania?.rentaRodzinna
              ? "Tak"
              : "Nie",
            swiadczeniePielegnacyjne: koszt.inneZrodlaUtrzymania
              ?.swiadczeniePielegnacyjne
              ? "Tak"
              : "Nie",
            inneZrodla: koszt.inneZrodlaUtrzymania?.inne ? "Tak" : "Nie",
            inneZrodlaOpis: koszt.inneZrodlaUtrzymania?.inneOpis,
          });
        });
      }

      // Dane dochodów
      if (formData.dochodyRodzicow) {
        incomeSheet.addRow({
          formid: data.formid,
          email: data.email,
          wlasneDochodyNetto:
            formData.dochodyRodzicow.wlasne?.oficjalneDochodyNetto,
          wlasnePotencjalDochodowy:
            formData.dochodyRodzicow.wlasne?.potencjalDochodowy,
          wlasneKosztyUtrzymania:
            formData.dochodyRodzicow.wlasne?.kosztyUtrzymaniaSiebie,
          wlasneKosztyInni:
            formData.dochodyRodzicow.wlasne?.kosztyUtrzymaniaInnychOsob,
          wlasneDodatkoweZobowiazania:
            formData.dochodyRodzicow.wlasne?.dodatkoweZobowiazania,
          drugiRodzicDochody:
            formData.dochodyRodzicow.drugiRodzic?.oficjalneDochodyNetto,
          drugiRodzicPotencjal:
            formData.dochodyRodzicow.drugiRodzic?.potencjalDochodowy,
          drugiRodzicKoszty:
            formData.dochodyRodzicow.drugiRodzic?.kosztyUtrzymaniaSiebie,
          drugiRodzicKosztyInni:
            formData.dochodyRodzicow.drugiRodzic?.kosztyUtrzymaniaInnychOsob,
          drugiRodzicDodatkowe:
            formData.dochodyRodzicow.drugiRodzic?.dodatkoweZobowiazania,
        });
      } // Pełne dane JSON
      jsonDataSheet.addRow({
        formid: data.formid,
        email: data.email,
        formDataJson: JSON.stringify(data.formdata, null, 2),
      });
    });

    // Generowanie bufora
    const buffer = await workbook.xlsx.writeBuffer();

    // Ustawienie nagłówków odpowiedzi
    const response = new NextResponse(buffer);
    response.headers.set(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    response.headers.set(
      "Content-Disposition",
      "attachment; filename=alimatrix-pelne-dane.xlsx"
    );

    return response;
  } catch (error) {
    console.error("Error generating Excel:", error);
    return NextResponse.json(
      { error: "Wystąpił błąd podczas generowania pliku Excel" },
      { status: 500 }
    );
  }
}

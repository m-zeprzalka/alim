const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  try {
    console.log("Połączono z bazą danych");
    console.log(
      "Używana baza danych: ",
      process.env.DATABASE_URL || "nie skonfigurowano"
    );

    // Sprawdź liczbę rekordów w tabelach
    const subscriptionCount = await prisma.emailSubscription.count();
    const formSubmissionCount = await prisma.formSubmission.count();

    console.log(`Liczba subskrypcji: ${subscriptionCount}`);
    console.log(`Liczba przesłanych formularzy: ${formSubmissionCount}`);

    // Pobierz przykład danych z formularzy, jeśli istnieją
    if (formSubmissionCount > 0) {
      const formSubmissions = await prisma.formSubmission.findMany({
        take: 3, // Pobierz maksymalnie 3 przykłady
        include: {
          emailSubscription: true,
        },
      });

      console.log("\nPrzykładowe formularze:");

      formSubmissions.forEach((form, index) => {
        console.log(`\n--- Formularz #${index + 1} ---`);
        console.log(`ID: ${form.id}`);
        console.log(`Email: ${form.emailSubscription.email}`);
        console.log(`Status: ${form.status}`);
        console.log(`Przesłany: ${form.submittedAt}`);
        console.log(`Przetworzony: ${form.processedAt || "Nie przetworzono"}`);

        // Sprawdź pola związane z sądem
        console.log(`\nDane sądowe:`);
        console.log(`Rodzaj sądu: ${form.rodzajSaduSad || "brak danych"}`);
        console.log(`Apelacja: ${form.apelacjaSad || "brak danych"}`);
        console.log(
          `ID sądu okręgowego: ${form.sadOkregowyId || "brak danych"}`
        );
        console.log(`Rok decyzji: ${form.rokDecyzjiSad || "brak danych"}`);
        console.log(`Wątek winy: ${form.watekWiny || "brak danych"}`);

        // Sprawdź formData (jako JSON)
        console.log(`\nZawartość formData:`);
        const formData = form.formData;
        console.log(`- sciezkaWybor: ${formData.sciezkaWybor || "brak"}`);
        console.log(`- podstawaUstalen: ${formData.podstawaUstalen || "brak"}`);
        console.log(`- liczbaDzieci: ${formData.liczbaDzieci || "brak"}`);

        // Sprawdź, czy dane sądu są zapisane również w formData
        console.log(`\nDane sądu w formData:`);
        console.log(`- rodzajSaduSad: ${formData.rodzajSaduSad || "brak"}`);
        console.log(`- apelacjaSad: ${formData.apelacjaSad || "brak"}`);
        console.log(`- sadOkregowyId: ${formData.sadOkregowyId || "brak"}`);
        console.log(`- rokDecyzjiSad: ${formData.rokDecyzjiSad || "brak"}`);
        console.log(`- watekWiny: ${formData.watekWiny || "brak"}`);

        // Dzieci
        console.log(`\nDzieci:`);
        if (formData.dzieci && Array.isArray(formData.dzieci)) {
          console.log(`Liczba dzieci w formularzu: ${formData.dzieci.length}`);
          formData.dzieci.forEach((dziecko, idx) => {
            console.log(`  Dziecko #${idx + 1}:`);
            console.log(`  - ID: ${dziecko.id || "brak"}`);
            console.log(`  - Wiek: ${dziecko.wiek || "brak"}`);
            console.log(`  - Płeć: ${dziecko.plec || "brak"}`);
          });
        } else {
          console.log("Brak danych o dzieciach");
        }
      });
    }

    // Sprawdź zawartość kolumn z danych sądu
    if (formSubmissionCount > 0) {
      console.log("\n--- Sprawdzanie kolumn sądowych ---");

      const formSadData = await prisma.$queryRaw`
                SELECT 
                  id, 
                  "rodzajSaduSad", 
                  "apelacjaSad", 
                  "sadOkregowyId", 
                  "rokDecyzjiSad", 
                  "watekWiny"
                FROM "FormSubmission"
                LIMIT 5
            `;

      console.log("Dane z kolumn sądowych:");
      console.log(formSadData);
    }

    console.log("\nSprawdzanie zakończone");
  } catch (error) {
    console.error("Błąd podczas sprawdzania bazy danych:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();

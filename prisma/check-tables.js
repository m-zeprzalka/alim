const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  try {
    console.log("Połączono z bazą danych");

    // Sprawdź tabele w bazie
    const tables = await prisma.$queryRaw`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            ORDER BY table_name
        `;

    console.log("Tabele w bazie danych:");
    console.log(tables);

    // Sprawdzenie kolumn w tabeli FormSubmission
    const columns = await prisma.$queryRaw`
            SELECT 
                column_name, 
                data_type, 
                is_nullable
            FROM 
                information_schema.columns 
            WHERE 
                table_schema = 'public' AND 
                table_name = 'FormSubmission' 
            ORDER BY 
                ordinal_position
        `;

    console.log("\nKolumny w tabeli FormSubmission:");
    console.log(columns);

    // Sprawdź liczbę rekordów w tabelach
    const subscriptionCount = await prisma.emailSubscription.count();
    const formSubmissionCount = await prisma.formSubmission.count();

    console.log(`\nLiczba subskrypcji: ${subscriptionCount}`);
    console.log(`Liczba przesłanych formularzy: ${formSubmissionCount}`);

    // Pokaż przykład danych formularza
    if (formSubmissionCount > 0) {
      // Najpierw wyświetl tylko identyfikatory
      const allFormIds = await prisma.formSubmission.findMany({
        select: { id: true },
      });

      console.log("\nWszystkie identyfikatory formularzy:");
      allFormIds.forEach((form, idx) => {
        console.log(`${idx + 1}. ${form.id}`);
      });

      // Jeśli są dane, pobierz jeden rekord do szczegółowej analizy
      const formData = await prisma.formSubmission.findFirst({
        include: {
          emailSubscription: true,
        },
      });

      if (formData) {
        console.log("\n=== Przykładowy formularz ===");
        console.log("ID formularza:", formData.id);
        console.log("Email:", formData.emailSubscription.email);
        console.log("Status:", formData.status);

        console.log("\nWartości kolumn sądowych:");
        console.log("rodzajSaduSad:", formData.rodzajSaduSad);
        console.log("apelacjaSad:", formData.apelacjaSad);
        console.log("sadOkregowyId:", formData.sadOkregowyId);
        console.log("rokDecyzjiSad:", formData.rokDecyzjiSad);
        console.log("watekWiny:", formData.watekWiny);

        console.log("\nDane formData:");
        // Wypisz kluczowe wartości z JSON (formData)
        const jsonFormData = formData.formData;

        // Wyświetl klucze formData
        console.log("Klucze w formData:", Object.keys(jsonFormData));

        // Sprawdź, czy dane sądu są też w formData
        if (jsonFormData.rodzajSaduSad) {
          console.log("\nDane sądowe w formData:");
          console.log("rodzajSaduSad:", jsonFormData.rodzajSaduSad);
          console.log("apelacjaSad:", jsonFormData.apelacjaSad);
          console.log("sadOkregowyId:", jsonFormData.sadOkregowyId);
          console.log("rokDecyzjiSad:", jsonFormData.rokDecyzjiSad);
          console.log("miesiacDecyzjiSad:", jsonFormData.miesiacDecyzjiSad);
          console.log("watekWiny:", jsonFormData.watekWiny);
        }
      }
    }
  } catch (error) {
    console.error("Błąd podczas sprawdzania bazy danych:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();

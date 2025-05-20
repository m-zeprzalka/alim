// Skrypt do testowania nowych pól w bazie danych
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function testNewFields() {
  try {
    console.log("Pobieram formularz z nowymi polami...");

    // Pobierz jeden formularz z relacjami
    const submissions = await prisma.formSubmission.findMany({
      take: 3,
      include: {
        dzieci: true,
        kosztyUtrzymania: true,
        dochodyRodzicow: true,
      },
    });

    if (submissions.length === 0) {
      console.log("Nie znaleziono żadnych formularzy");
      return;
    }

    // Dla każdego formularza wypisz informacje o nowych polach
    for (const submission of submissions) {
      console.log(`\n===== Formularz ID: ${submission.id} =====`);

      // Sprawdź nowe pola w FormSubmission
      console.log("\nNowe pola w FormSubmission:");
      console.log(
        `- Adres: ${submission.adresUlica || "brak"}, ${
          submission.adresKodPocztowy || "brak"
        }, ${submission.adresMiasto || "brak"}`
      );
      console.log(`- PESEL: ${submission.pesel || "brak"}`);
      console.log(`- Telefon: ${submission.telefon || "brak"}`);
      console.log(
        `- Status zatrudnienia: ${submission.statusZatrudnienia || "brak"}`
      );
      console.log(
        `- Dochód miesięczny: ${submission.dochodMiesieczny || "brak"}`
      );

      // Szczegółowe dane sądowe
      console.log("\nSzczegółowe dane sądowe:");
      console.log(`- Imię sędziego: ${submission.imieSedziego || "brak"}`);
      console.log(
        `- Nazwisko sędziego: ${submission.nazwiskoSedziego || "brak"}`
      );
      console.log(
        `- Typ reprezentacji: ${submission.typReprezentacji || "brak"}`
      );
      console.log(
        `- Imię reprezentanta: ${submission.imieReprezentanta || "brak"}`
      );
      console.log(
        `- Nazwisko reprezentanta: ${
          submission.nazwiskoReprezentanta || "brak"
        }`
      );
      console.log(
        `- Koszt reprezentacji: ${submission.kosztReprezentacji || "brak"}`
      );
      console.log(`- Data rozprawy: ${submission.dataRozprawy || "brak"}`);
      console.log(
        `- Data złożenia pozwu: ${submission.dataZlozeniaPozwu || "brak"}`
      );
      console.log(`- Liczba rozpraw: ${submission.liczbaRozpraw || "brak"}`);

      // Koszty utrzymania
      if (submission.kosztyUtrzymania) {
        console.log("\nKoszty utrzymania:");
        console.log(
          `- Czynsz: ${submission.kosztyUtrzymania.czynsz || "brak"}`
        );
        console.log(
          `- Media (ogólnie): ${submission.kosztyUtrzymania.media || "brak"}`
        );
        console.log(
          `- Energia: ${submission.kosztyUtrzymania.energia || "brak"}`
        );
        console.log(`- Woda: ${submission.kosztyUtrzymania.woda || "brak"}`);
        console.log(
          `- Ogrzewanie: ${submission.kosztyUtrzymania.ogrzewanie || "brak"}`
        );
        console.log(
          `- Internet: ${submission.kosztyUtrzymania.internet || "brak"}`
        );
        console.log(
          `- Telefon: ${submission.kosztyUtrzymania.telefon || "brak"}`
        );
        console.log(
          `- Transport: ${submission.kosztyUtrzymania.transport || "brak"}`
        );
        console.log(
          `- Żywność: ${submission.kosztyUtrzymania.zywnosc || "brak"}`
        );
        console.log(
          `- Lekarstwa: ${submission.kosztyUtrzymania.lekarstwa || "brak"}`
        );
        console.log(
          `- Typ zamieszkania: ${
            submission.kosztyUtrzymania.typZamieszkania || "brak"
          }`
        );
      } else {
        console.log("\nBrak danych o kosztach utrzymania");
      }

      // Dzieci
      if (submission.dzieci && submission.dzieci.length > 0) {
        console.log("\nNowe pola dla dzieci:");
        for (const dziecko of submission.dzieci) {
          console.log(`\nDziecko ID: ${dziecko.childId}`);
          console.log(`- Poziom edukacji: ${dziecko.poziomEdukacji || "brak"}`);
          console.log(`- Koszty szkoły: ${dziecko.kosztySzkoly || "brak"}`);
          console.log(
            `- Koszty zajęć dodatkowych: ${dziecko.dodatkZajeciaCena || "brak"}`
          );
          console.log(`- Rodzaj zajęć: ${dziecko.rodzajZajec || "brak"}`);
          console.log(
            `- Szczegółowy procent czasu: ${
              dziecko.szczegolowyProcentCzasu ? "zdefiniowano" : "brak"
            }`
          );
        }
      } else {
        console.log("\nBrak danych o dzieciach");
      }
    }
  } catch (error) {
    console.error("Błąd podczas testowania nowych pól:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Uruchom test
testNewFields()
  .then(() => console.log("Test zakończony"))
  .catch((e) => console.error("Błąd podczas testu:", e));

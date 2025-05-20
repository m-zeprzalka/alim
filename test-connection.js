// Prosty skrypt do testowania połączenia z bazą danych
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log("Sprawdzanie połączenia z bazą danych...");
    const count = await prisma.formSubmission.count();
    console.log(`Liczba formularzy w bazie danych: ${count}`);

    if (count > 0) {
      const firstFormSubmission = await prisma.formSubmission.findFirst();
      console.log("Pierwszy formularz:", firstFormSubmission.id);
    }

    console.log("Połączenie z bazą danych działa poprawnie!");
  } catch (error) {
    console.error("Błąd podczas testowania połączenia:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection()
  .then(() => console.log("Test zakończony"))
  .catch((e) => console.error("Błąd podczas testu:", e));

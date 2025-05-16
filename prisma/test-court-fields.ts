import { PrismaClient } from "@prisma/client";

// Inicjalizacja klienta Prisma
const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

async function main() {
  try {
    console.log("🔍 Sprawdzanie struktury tabeli FormSubmission...");

    // Sprawdzenie czy nowe kolumny istnieją
    const result = await prisma.$queryRaw`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'FormSubmission' 
      ORDER BY column_name`;
    console.log("Struktura tabeli FormSubmission:");
    console.log(JSON.stringify(result, null, 2));

    // Sprawdzenie czy indeksy zostały utworzone
    const indices = await prisma.$queryRaw`
      SELECT indexname, indexdef
      FROM pg_indexes
      WHERE tablename = 'FormSubmission'
      ORDER BY indexname`;

    console.log("\nIndeksy tabeli FormSubmission:");
    console.log(JSON.stringify(indices, null, 2));
    // Wyświetlenie przykładowych danych
    const sampleData = await prisma.$queryRaw`
      SELECT id, "rodzajSaduSad", "apelacjaSad", "sadOkregowyId", "rokDecyzjiSad", "watekWiny", "createdAt"
      FROM "FormSubmission"
      LIMIT 5
    `;

    console.log("\nPrzykładowe dane:");
    console.log(JSON.stringify(sampleData, null, 2));

    console.log("✅ Test zakończony pomyślnie!");
  } catch (error) {
    console.error("❌ Błąd podczas testowania:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();

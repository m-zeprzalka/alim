const { PrismaClient } = require("@prisma/client");

async function main() {
  const prisma = new PrismaClient({
    log: ["query", "info", "warn", "error"],
  });

  try {
    console.log("Checking database structure..."); // This is the query pattern that's failing from the error message
    console.log(
      "Attempting to query Dochody model with EXACT query from error message..."
    );
    const dochodyResults = await prisma.dochody.findMany({
      take: 100,
      skip: 0,
      select: {
        id: true,
        formSubmissionId: true,
        formSubmission: true,
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
    });

    console.log("Dochody query successful:", dochodyResults);
  } catch (error) {
    console.error("Error:", error);
    console.error("Error detailed:", JSON.stringify(error, null, 2));
  } finally {
    await prisma.$disconnect();
  }
}

main();

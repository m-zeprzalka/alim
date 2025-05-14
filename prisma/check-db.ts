import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    const subscriptions = await prisma.emailSubscription.findMany();
    console.log("Znalezione subskrypcje:");
    console.log(JSON.stringify(subscriptions, null, 2));
    console.log(`Łączna liczba rekordów: ${subscriptions.length}`);
  } catch (error) {
    console.error("Wystąpił błąd podczas pobierania danych:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();

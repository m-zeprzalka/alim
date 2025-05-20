// Simple script to check database connections and structure
import { PrismaClient } from "@prisma/client";

async function checkDatabase() {
  const prisma = new PrismaClient({
    log: ["query", "info", "warn", "error"],
  });

  try {
    console.log("Checking database connection...");

    // Test basic connection
    const result =
      await prisma.$queryRaw`SELECT current_database(), current_user, version()`;
    console.log("Connection successful!");
    console.log("Database info:", result);

    // Check EmailSubscription table
    console.log("\nChecking EmailSubscription table...");
    const emailCount = await prisma.emailSubscription.count();
    console.log(`EmailSubscription table has ${emailCount} records`);

    // Check FormSubmission table
    console.log("\nChecking FormSubmission table...");
    const formCount = await prisma.formSubmission.count();
    console.log(`FormSubmission table has ${formCount} records`);

    // Check Child table
    console.log("\nChecking Child table...");
    const childCount = await prisma.child.count();
    console.log(`Child table has ${childCount} records`);

    // Check Dochody table
    console.log("\nChecking Dochody table...");
    const dochodyCount = await prisma.dochody.count();
    console.log(`Dochody table has ${dochodyCount} records`);

    console.log("\nAll database checks completed successfully! ✅");
  } catch (error) {
    console.error("Error checking database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();

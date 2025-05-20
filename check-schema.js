// check-schema.js
// Script to check database schema structure
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient({
  log: ["query", "info"],
});

async function checkSchema() {
  try {
    console.log("Checking database schema structure...");

    // Check tables
    const tables = await prisma.$queryRaw`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
    `;
    console.log(
      "Available tables:",
      tables.map((t) => t.table_name).join(", ")
    );

    // Check FormSubmission columns
    console.log("\nFormSubmission columns:");
    const fsColumns = await prisma.$queryRaw`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'FormSubmission'
    `;
    console.log(JSON.stringify(fsColumns, null, 2));

    // Check EmailSubscription columns
    console.log("\nEmailSubscription columns:");
    const esColumns = await prisma.$queryRaw`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'EmailSubscription'
    `;
    console.log(JSON.stringify(esColumns, null, 2));

    // Check Child columns
    console.log("\nChild columns:");
    const childColumns = await prisma.$queryRaw`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'Child'
    `;
    console.log(JSON.stringify(childColumns, null, 2));

    // Check Dochody columns
    console.log("\nDochody columns:");
    const dochodyColumns = await prisma.$queryRaw`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'Dochody'
    `;
    console.log(JSON.stringify(dochodyColumns, null, 2));

    console.log("\nSchema check completed successfully");
  } catch (error) {
    console.error("Error checking schema:", error);
  } finally {
    await prisma.$disconnect();
    console.log("Disconnected from database");
  }
}

checkSchema().catch(console.error);

// Simple database check script
const { PrismaClient } = require("@prisma/client");

async function checkDatabase() {
  console.log("Starting database check...");

  // Create Prisma client with verbose logging
  const prisma = new PrismaClient({
    log: ["query", "info", "warn", "error"],
  });

  try {
    console.log("Checking connection to database...");

    // Check if we can connect to the database
    const result = await prisma.$queryRaw`SELECT NOW() as time`;
    console.log("Successfully connected to database!");
    console.log("Current database time:", result[0].time);

    // List all tables
    console.log("\nChecking database tables...");
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;

    if (tables.length === 0) {
      console.log(
        "No tables found in database. The schema might not be properly migrated."
      );
    } else {
      console.log(`Found ${tables.length} tables in database:`);
      tables.forEach((t, i) => console.log(`${i + 1}. ${t.table_name}`));

      // Check if we have the Child model properly set up
      console.log("\nChecking Child table structure...");
      const childColumns = await prisma.$queryRaw`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'Child'
      `;

      if (childColumns.length === 0) {
        console.log("Child table not found or has no columns.");
      } else {
        console.log(`Child table has ${childColumns.length} columns:`);
        childColumns.forEach((col) => {
          console.log(`- ${col.column_name}: ${col.data_type}`);
        });
      }
    }
  } catch (error) {
    console.error("Error connecting to database:");
    console.error(error);
  } finally {
    await prisma.$disconnect();
    console.log("\nDatabase check complete.");
  }
}

checkDatabase();

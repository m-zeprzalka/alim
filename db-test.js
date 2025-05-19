// Simple database connection test script
const { PrismaClient } = require("@prisma/client");

async function testDbConnection() {
  console.log("Starting database connection test...");
  const prisma = new PrismaClient();

  try {
    console.log("Connecting to the database...");
    await prisma.$connect();
    console.log("Successfully connected to the database!");

    // Try a simple query
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log("Query result:", result);

    console.log("Disconnecting...");
    await prisma.$disconnect();
    console.log("Test completed successfully!");
  } catch (error) {
    console.error("Error connecting to the database:", error);
    process.exit(1);
  }
}

testDbConnection();

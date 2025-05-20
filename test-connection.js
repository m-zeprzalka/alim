// Simple test of Prisma connection
const { PrismaClient } = require("@prisma/client");

async function testConnection() {
  console.log("Starting database connection test");

  try {
    const prisma = new PrismaClient({
      log: ["query", "info", "warn", "error"],
    });

    await prisma.$connect();
    console.log("Successfully connected to database!");

    // Try a simple query
    const result = await prisma.emailSubscription.findMany({
      take: 5,
    });

    console.log(`Found ${result.length} email subscriptions`);

    // Disconnect
    await prisma.$disconnect();
    console.log("Successfully disconnected from database");
  } catch (error) {
    console.error("Error connecting to database:", error);
  }
}

testConnection();

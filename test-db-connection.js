// Simple script to test database connection
const { PrismaClient } = require("@prisma/client");

// Create a new Prisma client instance
const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log("Attempting to connect to the database...");

    // Try to connect
    await prisma.$connect();
    console.log("✅ Database connection successful!");

    // Try a simple query to further verify the connection
    try {
      // Count users or any other table that should exist
      const count = await prisma.emailSubscription.count();
      console.log(`Found ${count} email subscription(s) in the database.`);
    } catch (queryError) {
      console.log(
        "Connected to database but query failed:",
        queryError.message
      );
    }

    // Disconnect when done
    await prisma.$disconnect();
    console.log("Database connection closed.");
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    if (error.stack) {
      console.error("Stack trace:", error.stack);
    }
  }
}

// Run the test
console.log(
  "Database URL (masked):",
  process.env.DATABASE_URL?.substring(0, 20) + "..."
);
testConnection();

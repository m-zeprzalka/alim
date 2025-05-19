// Enhanced database connection test with dotenv
require("dotenv").config({ path: "./.env.local" });

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function testConnection() {
  console.log("Environment:");
  console.log("- NODE_ENV:", process.env.NODE_ENV);
  console.log(
    "- DATABASE_URL (masked):",
    process.env.DATABASE_URL?.substring(0, 20) + "..."
  );

  try {
    console.log("\nAttempting to connect to the database...");
    await prisma.$connect();
    console.log("✅ Database connection successful!");

    try {
      const count = await prisma.emailSubscription.count();
      console.log(`Found ${count} email subscription(s) in the database.`);
    } catch (queryError) {
      console.log(
        "Connected to database but query failed:",
        queryError.message
      );
      console.log("This might indicate a schema mismatch or missing tables.");
    }

    await prisma.$disconnect();
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);

    // Provide more specific guidance based on error type
    if (error.code === "P1001") {
      console.error(
        "Cannot reach database server. Check if PostgreSQL is running."
      );
    } else if (error.code === "P1003") {
      console.error(
        "Database does not exist. You may need to create it first."
      );
    }
  }
}

testConnection();

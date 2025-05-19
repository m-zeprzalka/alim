// This script tests the Prisma database connection with full error handling
// It provides detailed diagnostics about connection issues

const { PrismaClient } = require("@prisma/client");

// Create a new Prisma Client instance with verbose logging
const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
  errorFormat: "pretty",
});

async function testDatabaseConnection() {
  console.log("Database connection test script");
  console.log("===============================");

  // Log database URL prefix for debugging (masking most of URL for security)
  const databaseUrl = process.env.DATABASE_URL || "";
  if (databaseUrl) {
    const dbUrlPrefix = databaseUrl.substring(0, 20);
    console.log(`Using database URL prefix: ${dbUrlPrefix}...`);

    // Check URL format
    if (
      databaseUrl.startsWith("prisma+postgres://") ||
      databaseUrl.startsWith("prisma://")
    ) {
      console.log(
        "✓ Database URL format appears correct (starts with proper protocol)"
      );
    } else {
      console.warn(
        '⚠ WARNING: Database URL might have incorrect format. Should start with "prisma+postgres://" or "prisma://"'
      );
    }
  } else {
    console.error("✗ ERROR: DATABASE_URL environment variable is not set");
    return;
  }

  try {
    console.log("\nAttempting database connection...");

    // Test a simple query
    const result = await prisma.$queryRaw`SELECT 1 as connected`;
    console.log("✓ Database connection successful!");
    console.log("Query result:", result);

    // Test a more complex query to verify schema access
    try {
      console.log("\nChecking for required tables...");
      const tables = await prisma.$queryRaw`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      `;
      console.log(
        "Available tables:",
        tables.map((t) => t.table_name).join(", ")
      );
    } catch (schemaError) {
      console.warn("⚠ Could not check schema tables:", schemaError.message);
    }
  } catch (error) {
    console.error("✗ Database connection failed:");
    console.error("Error message:", error.message);

    if (error.code) {
      console.error("Error code:", error.code);
    }

    // Provide specific advice based on error types
    if (error.message.includes("P1001")) {
      console.error("\nPossible cause: The database server is unreachable.");
      console.error(
        "Solution: Check if your database is running and network connectivity is working."
      );
    } else if (error.message.includes("P1003")) {
      console.error("\nPossible cause: The database does not exist.");
      console.error(
        "Solution: Create the database first or check your DATABASE_URL."
      );
    } else if (error.message.includes("P1017")) {
      console.error("\nPossible cause: Server has closed the connection.");
      console.error(
        "Solution: Check your database server logs for connection limit issues."
      );
    } else if (error.message.includes("P2022")) {
      console.error("\nPossible cause: Missing required table.");
      console.error(
        'Solution: Run "npx prisma migrate deploy" to apply migrations.'
      );
    } else if (error.message.includes("Error parsing connection string")) {
      console.error("\nPossible cause: Invalid connection string format.");
      console.error("Solution: Check your DATABASE_URL format.");
      console.error(
        "For Prisma Accelerate it should be: prisma+postgres://...?api_key=..."
      );
    }
  } finally {
    // Always disconnect the client to prevent hanging
    await prisma.$disconnect();
    console.log("\nTest completed and connection closed.");
  }
}

// Run the test
testDatabaseConnection().catch((e) => {
  console.error("Unexpected error during test execution:", e);
  process.exit(1);
});

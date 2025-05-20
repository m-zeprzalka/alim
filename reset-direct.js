// Direct Prisma schema reset and creation
const { PrismaClient } = require("@prisma/client");
const { execSync } = require("child_process");
const fs = require("fs");

// Helper function to log with timestamps
function log(message) {
  console.log(`[${new Date().toISOString()}] ${message}`);
}

async function resetDatabase() {
  log("Starting direct database reset process");

  try {
    // Step 1: Check environment
    log("Step 1: Checking environment");

    // Check for Prisma environment variables
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      log("Loading DATABASE_URL from .env file");
      try {
        const envContent = fs.readFileSync(".env", "utf8");
        const match = envContent.match(/DATABASE_URL="([^"]+)"/);
        if (match && match[1]) {
          process.env.DATABASE_URL = match[1];
          log("Successfully loaded DATABASE_URL from .env file");
        } else {
          throw new Error("Could not find DATABASE_URL in .env file");
        }
      } catch (error) {
        throw new Error(
          `Failed to load environment variables: ${error.message}`
        );
      }
    }

    log(`Using DATABASE_URL: ${process.env.DATABASE_URL.substring(0, 20)}...`);

    // Step 2: Initialize Prisma client
    log("Step 2: Initializing Prisma client");
    const prisma = new PrismaClient({
      log: ["info", "warn", "error"],
    });

    // Step 3: Try to connect
    log("Step 3: Testing database connection");
    await prisma.$connect();
    log("Successfully connected to database");

    // Step 4: Execute schema reset
    log("Step 4: Creating Schema Migration");
    execSync("npx prisma migrate dev --name init_schema --create-only", {
      stdio: "inherit",
    });

    log("Step 5: Applying Migration");
    execSync("npx prisma migrate deploy", { stdio: "inherit" });

    log("Step 6: Verifying schema creation");
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;

    log(`Found ${tables.length} tables in database`);
    for (const table of tables) {
      log(`- ${table.table_name}`);
    }

    // Step 7: Ensure Child table exists
    log("Step 7: Verifying Child table exists");
    const childTable = tables.find((t) => t.table_name === "Child");
    if (!childTable) {
      log(
        "Warning: Child table not found in database! Schema migration might have failed."
      );
    } else {
      log("Child table verified in database");

      // Check columns
      const columns = await prisma.$queryRaw`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'Child'
      `;

      log(`Child table has ${columns.length} columns`);
      for (const column of columns) {
        log(`  - ${column.column_name}: ${column.data_type}`);
      }
    }

    // Step 8: Clean up
    log("Step 8: Cleaning up");
    await prisma.$disconnect();

    log("Database reset and initialization completed successfully! ✅");
  } catch (error) {
    log(`❌ Error: ${error.message}`);
    if (error.stack) {
      log(`Stack trace: ${error.stack}`);
    }
    process.exit(1);
  }
}

resetDatabase();

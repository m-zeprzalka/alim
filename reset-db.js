// Database reset script using the Prisma JavaScript client
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

// Helper function to execute commands
function runCommand(command) {
  return new Promise((resolve, reject) => {
    console.log(`Running: ${command}`);

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        console.error(`Stderr: ${stderr}`);
        reject(error);
        return;
      }

      console.log(`Stdout: ${stdout}`);
      if (stderr) console.log(`Stderr: ${stderr}`);
      resolve(stdout);
    });
  });
}

async function resetDatabase() {
  console.log("Database Reset Script");
  console.log("=====================");
  console.log("This script will reset your database schema completely");

  try {
    // Ensure we have the DATABASE_URL environment variable
    if (!process.env.DATABASE_URL) {
      // Try to load from .env file
      try {
        const envPath = path.join(process.cwd(), ".env");
        if (fs.existsSync(envPath)) {
          const envContent = fs.readFileSync(envPath, "utf8");
          const match = envContent.match(/DATABASE_URL="([^"]+)"/);

          if (match && match[1]) {
            process.env.DATABASE_URL = match[1];
            console.log("Loaded DATABASE_URL from .env file");
          }
        }
      } catch (error) {
        console.log("Could not load .env file:", error.message);
      }
    }

    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL environment variable is not set");
    }

    console.log(
      "Database URL prefix:",
      process.env.DATABASE_URL.substring(0, 20) + "..."
    );

    // Step 1: Generate Prisma Client
    console.log("\nStep 1: Generating Prisma client...");
    await runCommand("npx prisma generate");

    // Step 2: Create fresh migration
    console.log("\nStep 2: Creating fresh migration...");
    await runCommand("npx prisma migrate dev --name reset_all --create-only");

    // Step 3: Apply migration
    console.log("\nStep 3: Applying migration...");
    await runCommand("npx prisma migrate deploy");

    // Step 4: Regenerate client
    console.log("\nStep 4: Regenerating Prisma client...");
    await runCommand("npx prisma generate");

    console.log("\nDatabase reset completed successfully! ✅");
  } catch (error) {
    console.error("\n❌ Error:", error.message);
    process.exit(1);
  }
}

resetDatabase();

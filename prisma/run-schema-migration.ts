// Script to run the optimized schema migration
import { PrismaClient } from "@prisma/client";
import { execSync } from "child_process";

async function runMigration() {
  console.log("Starting optimized schema migration...");

  try {
    // Create new migration using Prisma
    console.log("Creating migration...");
    execSync("npx prisma migrate dev --name optimize_schema --create-only", {
      stdio: "inherit",
    });

    console.log("Replacing migration file with our custom one...");
    execSync(
      "copy /Y prisma\\migrations\\20250517000000_optimize_schema\\migration.sql prisma\\migrations\\*_optimize_schema\\migration.sql",
      { stdio: "inherit" }
    );

    console.log("Applying migration...");
    execSync("npx prisma migrate deploy", { stdio: "inherit" });

    console.log("Generating Prisma client...");
    execSync("npx prisma generate", { stdio: "inherit" });

    console.log("Migration completed successfully!");

    // Test the database connection
    const prisma = new PrismaClient();
    await prisma.$connect(); // Get the number of form submissions
    const formCount = await prisma.formSubmission.count();
    console.log(`Database has ${formCount} form submissions`);
    // Get the number of children records if the table exists
    try {
      const childCount = await prisma.child.count();
      console.log(`Database has ${childCount} child records`);
    } catch (error) {
      console.log("Child table might not exist yet");
    }

    await prisma.$disconnect();
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

runMigration();

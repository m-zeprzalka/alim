// Script to replace the problematic migration file with a fixed version
const fs = require("fs");
const path = require("path");

try {
  console.log("Starting migration file fix process...");

  // Paths
  const migrationDir = path.join(
    __dirname,
    "prisma",
    "migrations",
    "20250517205554_optimize_schema"
  );
  const migrationFile = path.join(migrationDir, "migration.sql");
  const fixedFile = path.join(__dirname, "prisma", "fix-migration.sql");
  const backupFile = path.join(migrationDir, "migration.sql.backup");

  // Verify paths exist
  if (!fs.existsSync(migrationDir)) {
    console.error(`Error: Migration directory not found: ${migrationDir}`);
    process.exit(1);
  }

  if (!fs.existsSync(fixedFile)) {
    console.error(`Error: Fixed migration file not found: ${fixedFile}`);
    process.exit(1);
  }

  // Create backup of original migration file
  if (fs.existsSync(migrationFile)) {
    console.log(`Backing up original migration file to: ${backupFile}`);
    fs.copyFileSync(migrationFile, backupFile);
  } else {
    console.log(`Original migration file not found at: ${migrationFile}`);
  }

  // Copy fixed migration file to replace original
  console.log(`Copying fixed migration file to: ${migrationFile}`);
  fs.copyFileSync(fixedFile, migrationFile);

  console.log("Migration file successfully replaced!");
  console.log("\nNow you can run:");
  console.log(
    "npx prisma migrate resolve --applied 20250517205554_optimize_schema"
  );
  console.log("npx prisma migrate reset --force");
} catch (error) {
  console.error("Error replacing migration file:", error);
}

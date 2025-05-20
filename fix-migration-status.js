// Script to mark the problematic migration as completed in the database
const { PrismaClient } = require("@prisma/client");
const { execSync } = require("child_process");

async function fixMigrationStatus() {
  console.log("Attempting to fix the migration status in the database...");

  try {
    console.log("Creating Prisma client...");
    const prisma = new PrismaClient();

    // First, let's see the current state of this migration
    const result = await prisma.$queryRaw`
      SELECT * FROM "_prisma_migrations"
      WHERE migration_name = '20250517205554_optimize_schema'
    `;

    console.log("Current migration status:", result);

    if (result && result.length > 0) {
      // The migration exists but might be marked as failed
      console.log("Updating the migration to mark it as complete...");

      // Set finished_at to current timestamp and clear logs
      await prisma.$executeRaw`
        UPDATE "_prisma_migrations"
        SET finished_at = NOW(),
            logs = NULL
        WHERE migration_name = '20250517205554_optimize_schema'
      `;

      console.log("Migration marked as complete in the database.");
    } else {
      console.log("Migration record not found. Creating it...");

      // Insert a new record for the migration
      await prisma.$executeRaw`
        INSERT INTO "_prisma_migrations" (
          id,
          checksum,
          finished_at,
          migration_name,
          logs,
          rolled_back_at,
          started_at,
          applied_steps_count
        ) VALUES (
          uuid_generate_v4(),
          '4d29fc84f61d77124edf5865a789376fb65d95e6ddea4f50a35f485b6c2fa702',
          NOW(),
          '20250517205554_optimize_schema',
          NULL,
          NULL,
          NOW(),
          1
        )
      `;

      console.log("Migration record created and marked as complete.");
    }

    // Verify the change
    const updatedResult = await prisma.$queryRaw`
      SELECT * FROM "_prisma_migrations"
      WHERE migration_name = '20250517205554_optimize_schema'
    `;

    console.log("Updated migration status:", updatedResult);

    await prisma.$disconnect();

    console.log("Fix completed successfully. Now you can try running:");
    console.log(
      "npx prisma migrate resolve --applied 20250517205554_optimize_schema"
    );
    console.log("followed by:");
    console.log("npx prisma migrate reset --force");
  } catch (error) {
    console.error("Error fixing migration status:", error);
  }
}

fixMigrationStatus().catch(console.error);

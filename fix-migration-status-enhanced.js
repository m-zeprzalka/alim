// Enhanced script to mark the problematic migration as completed in the database
const { PrismaClient } = require("@prisma/client");
const { withAccelerate } = require("@prisma/extension-accelerate");

async function fixMigrationStatus() {
  console.log("Attempting to fix the migration status in the database...");

  try {
    console.log("Creating Prisma client with Accelerate...");
    const prisma = new PrismaClient().$extends(withAccelerate());

    console.log("Checking for the problematic migration record...");
    try {
      // Check if the table exists first
      await prisma.$transaction(async (tx) => {
        console.log("Querying _prisma_migrations table...");

        const result = await tx.$queryRaw`
          SELECT * FROM "_prisma_migrations"
          WHERE migration_name = '20250517205554_optimize_schema'
        `;

        console.log(
          "Current migration status:",
          JSON.stringify(result, null, 2)
        );

        if (result && result.length > 0) {
          console.log("Migration found. Updating to mark as complete...");

          // Update the record to mark it as completed
          await tx.$executeRaw`
            UPDATE "_prisma_migrations"
            SET finished_at = NOW(),
                logs = NULL,
                applied_steps_count = 1
            WHERE migration_name = '20250517205554_optimize_schema'
          `;

          console.log("Migration updated successfully.");
        } else {
          console.log("Migration record not found. Creating it...");

          // Insert a new record for this migration
          await tx.$executeRaw`
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
        const updatedResult = await tx.$queryRaw`
          SELECT * FROM "_prisma_migrations"
          WHERE migration_name = '20250517205554_optimize_schema'
        `;

        console.log(
          "Updated migration status:",
          JSON.stringify(updatedResult, null, 2)
        );
      });
    } catch (txError) {
      console.error("Transaction error:", txError);
    }

    await prisma.$disconnect();

    console.log("Fix attempt completed. Now try running:");
    console.log(
      "npx prisma migrate resolve --applied 20250517205554_optimize_schema"
    );
    console.log("followed by:");
    console.log("npx prisma migrate reset --force");
  } catch (error) {
    console.error("Error in fixMigrationStatus:", error);
  }
}

fixMigrationStatus().catch((e) => {
  console.error("Unhandled error:", e);
  process.exit(1);
});

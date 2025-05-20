// Script to mark the problematic migration as applied
const { PrismaClient } = require("@prisma/client");

async function markMigrationAsApplied() {
  console.log("Starting migration fix script...");
  console.log(
    "DATABASE_URL:",
    process.env.DATABASE_URL
      ? "defined (first 20 chars): " +
          process.env.DATABASE_URL.substring(0, 20) +
          "..."
      : "undefined"
  );

  const prisma = new PrismaClient({
    log: ["info", "warn", "error", "query"],
  });
  try {
    // Connect to the database
    await prisma.$connect();

    // Update the migration to mark it as successfully applied
    const result = await prisma.$executeRawUnsafe(`
      UPDATE "_prisma_migrations"
      SET finished_at = NOW(), 
          applied_steps_count = 1,
          logs = 'Fixed manually by marking as applied'
      WHERE migration_name = '20250517205554_optimize_schema'
    `);

    console.log(`Migration marked as applied. Affected rows: ${result}`);

    // Check the updated migration status
    const migrations = await prisma.$queryRaw`
      SELECT migration_name, finished_at, applied_steps_count, logs
      FROM "_prisma_migrations"
      ORDER BY started_at DESC
      LIMIT 5
    `;

    console.log("\nRecent migrations status:");
    console.table(migrations);
  } catch (error) {
    console.error("Error fixing migration:", error);
  } finally {
    await prisma.$disconnect();
  }
}

markMigrationAsApplied()
  .then(() => {
    console.log(
      "Script completed. You can now try running the remaining migrations."
    );
  })
  .catch((err) => {
    console.error("Script failed with error:", err);
    process.exit(1);
  });

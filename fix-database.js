// Script to fix the database indexes
const { PrismaClient } = require("@prisma/client");
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

async function fixDatabase() {
  console.log("Starting database index fix...");

  try {
    // Read the SQL file
    const sqlPath = path.join(__dirname, "prisma", "fix-indexes.sql");
    console.log("SQL path:", sqlPath);
    const sql = fs.readFileSync(sqlPath, "utf8");
    console.log("SQL content loaded:", sql.substring(0, 100) + "...");

    // Create a new Prisma client
    console.log("Creating Prisma client...");
    const prisma = new PrismaClient({
      log: ["query", "info", "warn", "error"],
    });

    // Split the SQL into individual commands
    const commands = sql.split(";").filter((cmd) => cmd.trim().length > 0);

    // Execute each SQL command
    for (const command of commands) {
      try {
        console.log(`Executing: ${command}`);
        await prisma.$executeRawUnsafe(`${command};`);
        console.log("Command executed successfully");
      } catch (err) {
        // If the index doesn't exist, that's fine, just continue
        if (err.code === "42704") {
          // PostgreSQL code for "object does not exist"
          console.log(`Index doesn't exist, continuing: ${err.message}`);
        } else {
          console.warn(`Warning: ${err.message}`);
        }
      }
    }

    console.log("SQL commands completed. Now trying to fix the migrations...");

    // Now try to fix the migration history if needed
    try {
      // Check if the migration is marked as applied but failed
      const migrationHistory = await prisma.$queryRaw`
        SELECT * FROM "_prisma_migrations" 
        WHERE migration_name = '20250517205554_optimize_schema'
      `;

      console.log("Migration history:", migrationHistory);

      if (migrationHistory && migrationHistory.length > 0) {
        // If the migration is there but didn't fully apply, we may need to update its status
        const migration = migrationHistory[0];
        if (migration.applied_steps_count < migration.migration_steps) {
          console.log("Fixing migration status...");
          await prisma.$executeRaw`
            UPDATE "_prisma_migrations" 
            SET applied_steps_count = migration_steps,
                finished_at = NOW()
            WHERE migration_name = '20250517205554_optimize_schema'
          `;
          console.log("Migration status updated");
        }
      }
    } catch (err) {
      // If _prisma_migrations table doesn't exist, that's ok
      console.warn(`Could not check migration history: ${err.message}`);
    }

    console.log(
      "Fix completed. Now you can try running the migration reset again."
    );

    await prisma.$disconnect();
  } catch (err) {
    console.error("Error fixing database:", err);
    process.exit(1);
  }
}

fixDatabase();

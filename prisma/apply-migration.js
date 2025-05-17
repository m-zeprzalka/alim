// Simple prisma migration script
const { exec } = require("child_process");
const { promisify } = require("util");

const execAsync = promisify(exec);

async function runMigration() {
  try {
    console.log("\n--- ROZPOCZYNANIE MIGRACJI SCHEMATU ---");

    // Step 1: Apply the new schema from schema.prisma.new
    console.log("\n[KROK 1] Kopiowanie nowego schematu do schema.prisma...");
    const copyResult = await execAsync(
      "copy /Y prisma\\schema.prisma.new prisma\\schema.prisma"
    );
    console.log("Wynik:", copyResult.stdout);

    // Step 2: Create the migration
    console.log("\n[KROK 2] Tworzenie migracji...");
    const createResult = await execAsync(
      "npx prisma migrate dev --name optimize_schema --create-only"
    );
    console.log("Wynik:", createResult.stdout);
    // Step 3: Replace with our custom migration
    console.log(
      "\n[KROK 3] Zastępowanie pliku migracji niestandardowym plikiem..."
    );
    const replaceResult = await execAsync(
      "copy /Y prisma\\migrations\\20250517000000_optimize_schema\\migration.sql prisma\\migrations\\20250517205554_optimize_schema\\migration.sql"
    );
    console.log("Wynik:", replaceResult.stdout);

    // Step 4: Apply the migration
    console.log("\n[KROK 4] Stosowanie migracji...");
    const deployResult = await execAsync("npx prisma migrate deploy");
    console.log("Wynik:", deployResult.stdout);

    // Step 5: Generate updated Prisma client
    console.log("\n[KROK 5] Generowanie zaktualizowanego klienta Prisma...");
    const generateResult = await execAsync("npx prisma generate");
    console.log("Wynik:", generateResult.stdout);

    console.log("\n--- MIGRACJA ZAKOŃCZONA POMYŚLNIE ---");
  } catch (error) {
    console.error("\n--- BŁĄD MIGRACJI ---");
    console.error("Komunikat:", error.message);
    if (error.stdout) console.error("Stdout:", error.stdout);
    if (error.stderr) console.error("Stderr:", error.stderr);
    process.exit(1);
  }
}

runMigration().catch((err) => {
  console.error("Błąd nieobsługiwany:", err);
  process.exit(1);
});

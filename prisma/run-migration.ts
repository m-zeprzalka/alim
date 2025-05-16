// Skrypt do wykonania migracji bazy danych
import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs";
import path from "path";

const execPromisified = promisify(exec);

async function runMigrations() {
  console.log("⏳ Uruchamianie migracji bazy danych...");

  try {
    // Generowanie migracji na podstawie zmian w schema.prisma
    console.log("📝 Generowanie pliku migracji...");
    await execPromisified("npx prisma migrate dev --name add_court_fields");

    console.log("✅ Migracja wygenerowana i zastosowana pomyślnie!");

    // Generowanie typów Prisma Client
    console.log("🔄 Aktualizacja typów Prisma Client...");
    await execPromisified("npx prisma generate");

    console.log("✅ Typy Prisma Client zaktualizowane!");

    // Sprawdzanie połączenia z bazą danych
    console.log("🔍 Sprawdzanie połączenia z bazą danych...");
    await execPromisified("ts-node prisma/check-db.ts");

    console.log("🎉 Wszystkie operacje wykonane pomyślnie!");
  } catch (error) {
    console.error("❌ Błąd podczas wykonywania migracji:", error);
    process.exit(1);
  }
}

// Uruchom migrację
runMigrations();

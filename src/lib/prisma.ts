// Singleton Prisma Client z ulepszoną obsługą połączeń
import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

// Dodanie obsługi błędów połączenia
const createPrismaClient = () => {
  // W środowisku produkcyjnym nie logujemy informacji o URL bazy danych
  // Usunięto logowanie URL bazy danych ze względów bezpieczeństwa

  const client = new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
    errorFormat: "pretty",
  });
  // Dodanie prostego middleware do logowania błędów w środowisku produkcyjnym
  // W środowisku produkcyjnym logujemy tylko błędy, nie czas wykonania zapytań
  client.$use(async (params, next) => {
    const before = Date.now();
    try {
      const result = await next(params);
      return result;
    } catch (error) {
      const after = Date.now();
      console.error(
        `Query ${params.model}.${params.action} failed after ${
          after - before
        }ms:`,
        error
      );
      throw error;
    }
  });

  return client;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

// Dodajemy logger dla fazy zamknięcia - bez użycia hooków beforeExit
if (process.env.NODE_ENV === "development") {
  // W środowisku produkcyjnym wyłączamy niepotrzebne logowanie
  process.on("beforeExit", () => {
    // Usunięto logowanie zamknięcia klienta
  });
}

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

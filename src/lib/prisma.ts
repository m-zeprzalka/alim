// Singleton Prisma Client z ulepszoną obsługą połączeń
import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

// Dodanie obsługi błędów połączenia
const createPrismaClient = () => {
  // Log database URL prefix for debugging (masking most of the URL for security)
  const databaseUrl = process.env.DATABASE_URL || "";
  const dbUrlPrefix = databaseUrl.substring(0, 20);
  console.log(
    `Initializing Prisma with database URL prefix: ${dbUrlPrefix}...`
  );

  const client = new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
    errorFormat: "pretty",
  });

  // Dodanie prostego middleware do logowania czasu zapytań i obsługi błędów
  client.$use(async (params, next) => {
    const before = Date.now();
    try {
      const result = await next(params);
      const after = Date.now();
      console.log(
        `Query ${params.model}.${params.action} took ${after - before}ms`
      );
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
  // Using better method to log shutdown
  process.on("beforeExit", () => {
    console.log("Prisma Client is shutting down");
  });
}

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

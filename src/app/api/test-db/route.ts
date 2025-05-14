// Narzędzie do testowania połączenia z bazą danych
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Sprawdź połączenie z bazą danych
    const result = await prisma.$queryRaw`SELECT NOW() as current_time`;

    // Zwróć informację o sukcesie z bieżącym czasem serwera
    return NextResponse.json({
      status: "success",
      message: "Połączenie z bazą danych działa poprawnie",
      databaseServerTime: result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Błąd połączenia z bazą danych:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Wystąpił błąd podczas łączenia z bazą danych",
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

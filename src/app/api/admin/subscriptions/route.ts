// Admin API do sprawdzenia stanu bazy danych
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { checkAdminRateLimit } from "@/lib/form-validation";
import { adminApiKeySchema } from "@/lib/schemas/admin-api-schema";

// Używamy silnego klucza API z zmiennych środowiskowych
const API_KEY = process.env.ADMIN_API_KEY;
if (!API_KEY) {
  console.error("ADMIN_API_KEY nie jest ustawiony w zmiennych środowiskowych!");
}

export async function GET(request: NextRequest) {
  try {
    // Get IP for rate limiting
    const ip = request.headers.get("x-forwarded-for") || "anonymous";

    // Apply rate limiting for admin API
    if (!checkAdminRateLimit(ip, 20, 60000)) {
      return NextResponse.json(
        {
          error:
            "Zbyt wiele żądań do API administratora. Spróbuj ponownie za kilka minut.",
        },
        { status: 429 }
      );
    }

    // Sprawdzenie klucza API z walidacją przez Zod
    const apiKey = request.headers.get("x-api-key") || "";

    try {
      adminApiKeySchema.parse({ apiKey });
    } catch (validationError) {
      return NextResponse.json(
        {
          error: "Nieprawidłowy klucz API lub brak autoryzacji",
          details:
            process.env.NODE_ENV === "development"
              ? validationError
              : undefined,
        },
        { status: 401 }
      );
    }

    // Pobieranie wszystkich subskrypcji
    const subscriptions = await prisma.emailSubscription.findMany({
      orderBy: { createdAt: "desc" },
    });

    // Statystyki
    const totalCount = subscriptions.length;
    const pendingCount = subscriptions.filter(
      (s) => s.status === "pending"
    ).length;
    const verifiedCount = subscriptions.filter(
      (s) => s.status === "verified"
    ).length;

    return NextResponse.json({
      totalSubscriptions: totalCount,
      pendingSubscriptions: pendingCount,
      verifiedSubscriptions: verifiedCount,
      subscriptions: subscriptions.map((sub) => ({
        id: sub.id,
        email: sub.email,
        status: sub.status,
        createdAt: sub.createdAt,
        verifiedAt: sub.verifiedAt,
      })),
    });
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    return NextResponse.json(
      { error: "Wystąpił błąd podczas pobierania danych" },
      { status: 500 }
    );
  }
}

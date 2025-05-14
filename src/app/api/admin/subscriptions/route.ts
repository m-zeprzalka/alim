// Admin API do sprawdzenia stanu bazy danych
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// Proste zabezpieczenie - w produkcji należałoby to zamienić na uwierzytelnianie
const API_KEY = process.env.ADMIN_API_KEY || "tajny_klucz_admin";

export async function GET(request: NextRequest) {
  try {
    // Sprawdzenie klucza API
    const apiKey = request.headers.get("x-api-key");
    if (apiKey !== API_KEY) {
      return NextResponse.json({ error: "Brak autoryzacji" }, { status: 401 });
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

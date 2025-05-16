import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// Set security headers for API responses
const securityHeaders = {
  "Content-Security-Policy": "default-src 'self'",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
};

export async function GET(request: NextRequest) {
  try {
    // W prawdziwej implementacji tutaj powinna być weryfikacja uprawnień administratora    // Używamy raw query do odczytu danych z JSON, ponieważ Prisma nie zna jeszcze naszych nowych kolumn
    const formSubmissionData = await prisma.$queryRaw`
      SELECT 
        "id",
        "rodzajSaduSad",
        "apelacjaSad",
        "sadOkregowyId",
        "rokDecyzjiSad",
        "watekWiny",
        "formData"
      FROM "FormSubmission"
    `;

    // Przygotuj statystyki
    const submissions = formSubmissionData as any[];
    const total = submissions.length;

    // Grupowanie statystyk
    const bySadType: Record<string, number> = {};
    const byApelacja: Record<string, number> = {};
    const byYear: Record<string, number> = {};
    const byWatek: Record<string, number> = {};
    submissions.forEach((submission) => {
      // Rodzaj sądu
      const sadType = submission.rodzajsadusad || "nieznany";
      bySadType[sadType] = (bySadType[sadType] || 0) + 1;

      // Apelacja
      const apelacja = submission.apelacjasad || "nieznana";
      byApelacja[apelacja] = (byApelacja[apelacja] || 0) + 1;

      // Rok
      const year = submission.rokdecyzjisad || "nieznany";
      byYear[year] = (byYear[year] || 0) + 1;

      // Wątek winy
      const watek = submission.watekviny || "nieznany";
      byWatek[watek] = (byWatek[watek] || 0) + 1;
    });

    // Przygotuj szczegółowe dane dla każdego rekordu
    const detailedData = submissions.map((submission) => ({
      id: submission.id,
      rodzajSadu: submission.rodzajsadusad,
      apelacja: submission.apelacjasad,
      sadOkregowy: submission.sadokregowyid,
      rokDecyzji: submission.rokdecyzjisad,
      watekWiny: submission.watekviny,
      formData: submission.formdata,
    }));

    return NextResponse.json(
      {
        total,
        bySadType,
        byApelacja,
        byYear,
        byWatek,
        detailedData,
      },
      {
        status: 200,
        headers: securityHeaders,
      }
    );
  } catch (error) {
    console.error("Error fetching court statistics:", error);

    return NextResponse.json(
      {
        error: "Wystąpił błąd podczas pobierania statystyk sądowych.",
      },
      {
        status: 500,
        headers: securityHeaders,
      }
    );
  }
}

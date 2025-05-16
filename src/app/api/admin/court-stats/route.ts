// filepath: c:\ALIMATRIX\alimatrix\src\app\api\admin\court-stats\route.ts
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
    // W prawdziwej implementacji tutaj powinna by� weryfikacja uprawnie� administratora

    // Pobierz wszystkie zg�oszenia formularzy
    const formSubmissionData = await prisma.$queryRaw`
      SELECT 
        fs."id",
        fs."emailSubscriptionId",
        fs."submittedAt",
        fs."processedAt",
        fs."status",
        fs."reportUrl",
        fs."rodzajSaduSad",
        fs."apelacjaSad",
        fs."sadOkregowyId",
        fs."rokDecyzjiSad",
        fs."watekWiny",
        fs."formData",
        es."email",
        es."createdAt" as "subscriptionCreatedAt",
        es."acceptedTerms",
        es."acceptedContact",
        es."status" as "subscriptionStatus"
      FROM "FormSubmission" fs
      JOIN "EmailSubscription" es ON fs."emailSubscriptionId" = es."id"
    `;

    // Przygotuj statystyki
    const submissions = formSubmissionData as any[];
    const total = submissions.length;

    // Grupowanie statystyk
    const bySadType: Record<string, number> = {};
    const byApelacja: Record<string, number> = {};
    const byYear: Record<string, number> = {};
    const byWatek: Record<string, number> = {};
    const byStatus: Record<string, number> = {};
    const byEmailStatus: Record<string, number> = {};
    const byMonth: Record<string, number> = {};

    submissions.forEach((submission) => {
      // Rodzaj s�du
      const sadType = submission.rodzajsadusad || "nieznany";
      bySadType[sadType] = (bySadType[sadType] || 0) + 1;

      // Apelacja
      const apelacja = submission.apelacjasad || "nieznana";
      byApelacja[apelacja] = (byApelacja[apelacja] || 0) + 1;

      // Rok
      const year = submission.rokdecyzjisad || "nieznany";
      byYear[year] = (byYear[year] || 0) + 1;

      // W�tek winy
      const watek = submission.watekviny || "nieznany";
      byWatek[watek] = (byWatek[watek] || 0) + 1;

      // Status zg�oszenia
      const status = submission.status || "nieznany";
      byStatus[status] = (byStatus[status] || 0) + 1;

      // Status email
      const emailStatus = submission.subscriptionstatus || "nieznany";
      byEmailStatus[emailStatus] = (byEmailStatus[emailStatus] || 0) + 1;

      // Miesi�c zg�oszenia
      if (submission.submittedat) {
        const date = new Date(submission.submittedat);
        const monthYear = `${date.getFullYear()}-${(date.getMonth() + 1)
          .toString()
          .padStart(2, "0")}`;
        byMonth[monthYear] = (byMonth[monthYear] || 0) + 1;
      }
    });

    // Przygotuj szczeg�owe dane dla ka�dego rekordu
    const detailedData = submissions.map((submission) => {
      // Format daty dla lepszej czytelno�ci
      const formatDate = (dateStr: string) => {
        if (!dateStr) return null;
        const date = new Date(dateStr);
        return date.toLocaleString("pl-PL");
      };

      return {
        id: submission.id,
        email: submission.email,
        submittedAt: formatDate(submission.submittedat),
        processedAt: formatDate(submission.processedat),
        status: submission.status,
        reportUrl: submission.reporturl,
        rodzajSadu: submission.rodzajsadusad,
        apelacja: submission.apelacjasad,
        sadOkregowy: submission.sadokregowyid,
        rokDecyzji: submission.rokdecyzjisad,
        watekWiny: submission.watekviny,
        emailStatus: submission.subscriptionstatus,
        acceptedTerms: submission.acceptedterms,
        acceptedContact: submission.acceptedcontact,
        formData: submission.formdata,
      };
    });

    return NextResponse.json(
      {
        total,
        bySadType,
        byApelacja,
        byYear,
        byWatek,
        byStatus,
        byEmailStatus,
        byMonth,
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
        error: "Wyst�pi� b��d podczas pobierania statystyk s�dowych.",
      },
      {
        status: 500,
        headers: securityHeaders,
      }
    );
  }
}

// Endpoint do generowania pliku Excel z subskrypcjami
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import * as ExcelJS from "exceljs";

// Proste zabezpieczenie - w produkcji należałoby to zamienić na uwierzytelnianie
const API_KEY = process.env.ADMIN_API_KEY || "tajny_klucz_admin_2025";

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

    // Tworzenie workbooka Excel
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "AliMatrix Admin";
    workbook.lastModifiedBy = "AliMatrix System";
    workbook.created = new Date();
    workbook.modified = new Date();

    // Dodanie arkusza
    const worksheet = workbook.addWorksheet("Subskrypcje");

    // Dodanie nagłówków
    worksheet.columns = [
      { header: "ID", key: "id", width: 40 },
      { header: "Email", key: "email", width: 30 },
      { header: "Status", key: "status", width: 15 },
      { header: "Data utworzenia", key: "createdAt", width: 20 },
      { header: "Data weryfikacji", key: "verifiedAt", width: 20 },
      { header: "Akceptacja regulaminu", key: "acceptedTerms", width: 20 },
    ];

    // Stylizacja nagłówków
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFE0E0E0" },
    };

    // Dodanie danych
    subscriptions.forEach((sub) => {
      worksheet.addRow({
        id: sub.id,
        email: sub.email,
        status: sub.status,
        createdAt: sub.createdAt,
        verifiedAt: sub.verifiedAt,
        acceptedTerms: sub.acceptedTerms ? "Tak" : "Nie",
      });
    });

    // Generowanie bufora
    const buffer = await workbook.xlsx.writeBuffer();

    // Ustawienie nagłówków odpowiedzi
    const response = new NextResponse(buffer);
    response.headers.set(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    response.headers.set(
      "Content-Disposition",
      "attachment; filename=subskrypcje.xlsx"
    );

    return response;
  } catch (error) {
    console.error("Error generating Excel:", error);
    return NextResponse.json(
      { error: "Wystąpił błąd podczas generowania pliku Excel" },
      { status: 500 }
    );
  }
}

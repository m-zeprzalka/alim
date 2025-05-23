// Route handler for form submissions
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import {
  formSubmissionSchema,
  sanitizeEmail,
  sanitizeFormData,
  checkRateLimit,
} from "@/lib/form-validation";

export async function POST(request: NextRequest) {
  try {
    // Get IP for rate limiting
    const ip = request.headers.get("x-forwarded-for") || "anonymous";

    // Apply rate limiting
    if (!checkRateLimit(ip, 5, 60000)) {
      return NextResponse.json(
        { error: "Zbyt wiele żądań. Spróbuj ponownie za kilka minut." },
        { status: 429 }
      );
    } // Parse the request body
    const body = await request.json();

    // Mapowanie pól do oczekiwanego formatu, jeśli przychodzą z alternatywnej ścieżki
    if (body.email && !body.contactEmail) {
      body.contactEmail = body.email;
      delete body.email;
    }

    if (
      body.acceptedTerms !== undefined &&
      body.zgodaPrzetwarzanie === undefined
    ) {
      body.zgodaPrzetwarzanie = body.acceptedTerms;
      body.zgodaKontakt = body.acceptedTerms; // zakładamy, że w uproszczonym formularzu jedna zgoda pokrywa obie
      delete body.acceptedTerms;
    } // Sanitize the data
    const sanitizedBody = sanitizeFormData(body);
    const { contactEmail, zgodaPrzetwarzanie, zgodaKontakt, ...formData } =
      sanitizedBody; // Validate input

    if (!contactEmail) {
      console.error("Email validation failed in subscribe:", {
        contactEmail,
        body: sanitizedBody,
      });
      return NextResponse.json(
        { error: "Email jest wymagany" },
        { status: 400 }
      );
    }

    if (!zgodaPrzetwarzanie || !zgodaKontakt) {
      return NextResponse.json(
        { error: "Wymagane są obie zgody" },
        { status: 400 }
      );
    }

    // Proper email sanitization
    const cleanEmail = sanitizeEmail(contactEmail);

    // Validate with Zod schema
    try {
      formSubmissionSchema.parse({
        contactEmail: cleanEmail,
        zgodaPrzetwarzanie,
        zgodaKontakt,
        submissionDate:
          sanitizedBody.submissionDate || new Date().toISOString(),
      });
    } catch (validationError) {
      console.error("Validation error:", validationError);
      return NextResponse.json(
        { error: "Nieprawidłowe dane formularza" },
        { status: 400 }
      );
    } // Zapisywanie danych kontaktowych i analitycznych oddzielnie
    // Najpierw zapisujemy dane kontaktowe
    const contactSubmission = await prisma.emailSubscription.create({
      data: {
        email: cleanEmail,
        acceptedTerms: zgodaPrzetwarzanie === true,
      },
    }); // Następnie zapisujemy dane formularza, z referencją do danych kontaktowych
    const formDataObj = { ...formData };
    const formSubmission = (await prisma.$queryRaw`
      INSERT INTO "FormSubmission" ("id", "emailSubscriptionId", "formData", "status")
      VALUES (gen_random_uuid(), ${contactSubmission.id}, ${JSON.stringify(
      formDataObj
    )}::jsonb, 'pending')
      RETURNING "id"
    `) as { id: string }[]; // Return success without exposing sensitive data
    return NextResponse.json(
      {
        success: true,
        message: "Formularz zapisany pomyślnie",
        submissionId: formSubmission[0]?.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing form submission:", error);
    return NextResponse.json(
      {
        error:
          "Wystąpił błąd podczas przetwarzania formularza. Spróbuj ponownie.",
      },
      { status: 500 }
    );
  }
}

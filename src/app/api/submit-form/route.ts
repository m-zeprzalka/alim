// Route handler for form submissions
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import {
  formSubmissionSchema,
  sanitizeEmail,
  sanitizeFormData,
  checkRateLimit,
} from "@/lib/form-validation";
import { verifyCSRFToken, consumeCSRFToken } from "@/lib/csrf";

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
    }

    // Check for CSRF token in headers
    const csrfToken = request.headers.get("X-CSRF-Token");
    if (!csrfToken) {
      return NextResponse.json(
        {
          error:
            "Brak tokenu bezpieczeństwa. Odśwież stronę i spróbuj ponownie.",
        },
        { status: 403 }
      );
    }

    // Parse the request body
    const body = await request.json();
    console.log("Received body in submit-form:", JSON.stringify(body));

    // Sanitize the data
    const sanitizedBody = sanitizeFormData(body);
    console.log(
      "Sanitized body in submit-form:",
      JSON.stringify(sanitizedBody)
    );

    const { contactEmail, zgodaPrzetwarzanie, zgodaKontakt, ...formData } =
      sanitizedBody;

    console.log("Email from request in submit-form:", contactEmail); // Basic validation
    if (!contactEmail || typeof contactEmail !== "string") {
      console.error("Email validation failed in submit-form:", {
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
    } // Save the email subscription first
    const subscription = await prisma.emailSubscription.create({
      data: {
        email: cleanEmail,
        acceptedTerms: zgodaPrzetwarzanie === true,
      },
    }); // Then save the form submission with reference to the email subscription
    const formDataObj = { ...formData };
    const submission = (await prisma.$queryRaw`
      INSERT INTO "FormSubmission" ("id", "emailSubscriptionId", "formData", "status")
      VALUES (gen_random_uuid(), ${subscription.id}, ${JSON.stringify(
      formDataObj
    )}::jsonb, 'pending')
      RETURNING "id"
    `) as { id: string }[]; // Return success response
    return NextResponse.json(
      {
        success: true,
        message: "Formularz zapisany pomyślnie",
        id: submission[0]?.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing form submission:", error);

    // Check for duplicate email error
    if (
      error instanceof Error &&
      error.message.includes("Unique constraint failed")
    ) {
      return NextResponse.json(
        { error: "Ten adres email jest już zarejestrowany." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        error:
          "Wystąpił błąd podczas przetwarzania formularza. Spróbuj ponownie.",
      },
      { status: 500 }
    );
  }
}

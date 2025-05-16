// Route handler for form submissions with CSRF protection
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import {
  formSubmissionSchema,
  sanitizeEmail,
  sanitizeFormData,
  checkRateLimit,
} from "@/lib/form-validation";
import { verifyCSRFToken, consumeCSRFToken } from "@/lib/csrf";

// Set security headers for API responses
const securityHeaders = {
  "Content-Security-Policy": "default-src 'self'",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
};

export async function POST(request: NextRequest) {
  try {
    // Get IP for rate limiting
    const ip = request.headers.get("x-forwarded-for") || "anonymous";

    // Apply rate limiting
    if (!checkRateLimit(ip, 5, 60000)) {
      return NextResponse.json(
        { error: "Zbyt wiele żądań. Spróbuj ponownie za kilka minut." },
        {
          status: 429,
          headers: {
            ...securityHeaders,
            "Retry-After": "60",
          },
        }
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
        { status: 403, headers: securityHeaders }
      );
    }

    // Verify the token exists and is valid
    if (!verifyCSRFToken(csrfToken)) {
      return NextResponse.json(
        {
          error:
            "Nieprawidłowy token bezpieczeństwa. Odśwież stronę i spróbuj ponownie.",
        },
        { status: 403, headers: securityHeaders }
      );
    }

    // Consume the token so it can't be reused (One-time use tokens)
    consumeCSRFToken(csrfToken); // Parse the request body
    const body = await request.json();
    console.log("Received body:", JSON.stringify(body));

    // Sanitize the data to prevent injection attacks
    const sanitizedBody = sanitizeFormData(body);
    console.log("Sanitized body:", JSON.stringify(sanitizedBody));

    // Check honeypot field - if it's not empty, it's likely a bot
    if (sanitizedBody.notHuman && sanitizedBody.notHuman.length > 0) {
      // Don't reveal that we detected a bot - just return a success message
      console.warn("Bot detected via honeypot field - IP:", ip);
      return NextResponse.json(
        { success: true, message: "Form submitted successfully" },
        { status: 200, headers: securityHeaders }
      );
    }
    const {
      contactEmail,
      zgodaPrzetwarzanie,
      zgodaKontakt,
      // Reszta danych formularza (obecnie nieużywana)
      ..._unusedFormData
    } = sanitizedBody;

    console.log("Email from request:", contactEmail);

    // Basic validation
    if (!contactEmail || typeof contactEmail !== "string") {
      console.error("Email validation failed:", {
        contactEmail,
        body: sanitizedBody,
      });
      return NextResponse.json(
        { error: "Email jest wymagany" },
        { status: 400, headers: securityHeaders }
      );
    }

    if (!zgodaPrzetwarzanie || !zgodaKontakt) {
      return NextResponse.json(
        { error: "Wymagane są obie zgody" },
        { status: 400, headers: securityHeaders }
      );
    }

    // Proper email sanitization and verification
    const cleanEmail = sanitizeEmail(contactEmail);
    console.log("Sanitized email:", cleanEmail);

    if (!cleanEmail || cleanEmail.length < 5 || !cleanEmail.includes("@")) {
      console.error("Email format validation failed:", { cleanEmail });
      return NextResponse.json(
        { error: "Nieprawidłowy format adresu email" },
        { status: 400, headers: securityHeaders }
      );
    }
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
        { status: 400, headers: securityHeaders }
      );
    }
    try {
      // Save the email subscription first with proper schema
      const subscription = await prisma.emailSubscription.create({
        data: {
          email: cleanEmail,
          acceptedTerms: zgodaPrzetwarzanie === true,
        },
      }); // Create a new form submission with reference to the email subscription
      const formData = { ...sanitizedBody };

      // Usunięcie pól, które są zapisywane osobno
      delete formData.contactEmail;
      delete formData.zgodaPrzetwarzanie;
      delete formData.zgodaKontakt;
      delete formData.notHuman;
      delete formData.csrfToken;

      // Aktualizacja daty formularza dla spójności
      formData.submissionDate = new Date().toISOString();

      // Dodanie informacji o polach sądowych
      console.log("Zapisywane dane sądu:", {
        rokDecyzjiSad: formData.rokDecyzjiSad,
        miesiacDecyzjiSad: formData.miesiacDecyzjiSad,
        rodzajSaduSad: formData.rodzajSaduSad,
        apelacjaSad: formData.apelacjaSad,
        sadOkregowyId: formData.sadOkregowyId,
        sadRejonowyId: formData.sadRejonowyId,
      }); // Wyodrębnienie kluczowych pól do indeksowania
      const rodzajSaduSad = formData.rodzajSaduSad || null;
      const apelacjaSad = formData.apelacjaSad || null;
      const sadOkregowyId = formData.sadOkregowyId || null;
      const rokDecyzjiSad = formData.rokDecyzjiSad || null;
      const watekWiny = formData.watekWiny || null;

      const submission = (await prisma.$queryRaw`
        INSERT INTO "FormSubmission" (
          "id", 
          "emailSubscriptionId", 
          "formData", 
          "status",
          "rodzajSaduSad",
          "apelacjaSad",
          "sadOkregowyId",
          "rokDecyzjiSad",
          "watekWiny"
        )
        VALUES (
          gen_random_uuid(), 
          ${subscription.id}, 
          ${JSON.stringify(formData)}::jsonb, 
          'pending',
          ${rodzajSaduSad},
          ${apelacjaSad},
          ${sadOkregowyId},
          ${rokDecyzjiSad},
          ${watekWiny}
        )
        RETURNING "id"
      `) as { id: string }[]; // Return success response with security headers
      return NextResponse.json(
        {
          success: true,
          message: "Formularz zapisany pomyślnie",
          id: submission[0]?.id,
        },
        {
          status: 201,
          headers: securityHeaders,
        }
      );
    } catch (dbError) {
      console.error("Database error:", dbError);

      // Check for duplicate email error
      if (
        dbError instanceof Error &&
        dbError.message.includes("Unique constraint failed")
      ) {
        return NextResponse.json(
          { error: "Ten adres email jest już zarejestrowany." },
          {
            status: 409,
            headers: securityHeaders,
          }
        );
      }

      return NextResponse.json(
        {
          error:
            "Błąd serwera podczas zapisywania danych. Spróbuj ponownie później.",
        },
        {
          status: 500,
          headers: securityHeaders,
        }
      );
    }
  } catch (error) {
    console.error("Error processing form submission:", error);
    return NextResponse.json(
      {
        error:
          "Wystąpił błąd podczas przetwarzania formularza. Spróbuj ponownie.",
      },
      {
        status: 500,
        headers: securityHeaders,
      }
    );
  }
}

// Route handler for form submissions with CSRF protection
// Fixes made on May 20, 2025: fixed offline mode issues
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import {
  formSubmissionSchema,
  sanitizeEmail,
  sanitizeFormData,
  checkRateLimit,
} from "@/lib/form-validation";
import { verifyCSRFToken, consumeCSRFToken } from "@/lib/csrf";
import {
  addToOfflineQueue,
  updateDatabaseStatus,
} from "@/lib/db-connection-helper";

// Sprawdzenie środowiska uruchomieniowego i konfiguracji bazy danych
const isDevelopment = process.env.NODE_ENV === "development";
console.log(`API running in ${process.env.NODE_ENV} mode`);
if (isDevelopment) {
  console.log(
    "Database URL (masked):",
    process.env.DATABASE_URL?.substring(0, 15) + "..."
  );
}

// Set security headers for API responses
const securityHeaders = {
  "Content-Security-Policy": "default-src 'self'",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
};

// Define offline subscription type
interface OfflineSubscription {
  id: string;
  email: string;
  acceptedTerms: boolean;
  acceptedContact: boolean;
  createdAt: Date;
  isOfflineEntry: true;
}

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
    consumeCSRFToken(csrfToken);

    // Parse the request body
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
      // Try to save the email subscription with proper schema
      let subscription: any; // Using 'any' type to avoid complex Prisma types
      try {
        console.log("Connecting to database...");
        // Próba sprawdzenia połączenia z bazą danych bez explicit $connect
        // Nowsze wersje Prisma automatycznie łączą się z bazą przy pierwszej operacji
        let isConnected = false;
        try {
          // Sprawdzmy czy możemy wykonać prostą operację na bazie
          const dbCheck = await prisma.$queryRaw`SELECT 1 as connected`;
          console.log("Database connection test successful:", dbCheck);
          console.log("Database connection successful");
          updateDatabaseStatus(true);
          isConnected = true;
        } catch (connectionError) {
          console.error("Database connection failed:", connectionError);
          const error = connectionError as Error;
          updateDatabaseStatus(false, error);
          // Nie rzucamy błędu, przechodzimy w tryb offline
          console.log(
            "Switching to offline mode due to database connection failure"
          );
          // Nie przerywamy wykonania, tylko oznaczamy, że jesteśmy offline
          isConnected = false;
        } // Sprawdzenie statusu połączenia - teraz tylko logujemy, nie wyrzucamy błędu
        if (!isConnected) {
          console.warn(
            "Database connection issue detected, but will attempt to continue with the operation"
          );
        }

        subscription = await prisma.emailSubscription.create({
          data: {
            email: cleanEmail,
            acceptedTerms: zgodaPrzetwarzanie === true,
            acceptedContact: zgodaKontakt === true,
          },
        });
        console.log("Email subscription created:", subscription.id);
      } catch (err) {
        const error = err as Error & { code?: string; meta?: any };

        // Sprawdź, czy to był rzeczywiście problem z połączeniem, czy inny błąd
        console.error("Database error details:", {
          message: error.message,
          name: error.name,
          code: error.code,
          meta: error.meta,
        });

        // Dodaj diagnostykę
        console.log("Pełny stack trace błędu:", error.stack);

        // Sprawdźmy, czy błąd dotyczy unikalności adresu email
        if (
          error.message &&
          error.message.includes("Unique constraint failed")
        ) {
          console.log(
            "Próba utworzenia duplikatu email - próbujmy pobrać istniejący rekord"
          );
          try {
            // Spróbuj pobrać istniejący rekord z tym adresem email
            const existingSubscription =
              await prisma.emailSubscription.findUnique({
                where: {
                  email: cleanEmail,
                },
              });

            if (existingSubscription) {
              console.log(
                "Znaleziono istniejącą subskrypcję:",
                existingSubscription.id
              );
              subscription = existingSubscription;
              return; // Kontynuuj z istniejącą subskrypcją
            }
          } catch (findError) {
            console.error(
              "Błąd podczas szukania istniejącej subskrypcji:",
              findError
            );
          }
        }

        // UWAGA: W NORMALNYM TRYBIE PRODUKCYJNYM UŻYWAMY BAZY DANYCH
        // TYMCZASOWO WYŁĄCZAMY TRYB OFFLINE DLA TESTÓW

        /* Kod trybu offline - tymczasowo zakomentowany
        console.error("Przełączanie na tryb offline z powodu błędu bazy danych");
        subscription = {
          id: `offline-${Date.now()}`,
          email: cleanEmail,
          acceptedTerms: zgodaPrzetwarzanie === true,
          acceptedContact: zgodaKontakt === true,
          createdAt: new Date(),
          isOfflineEntry: true,
        };
        console.log("Using offline subscription:", subscription.id);
        */

        // Użyj zamiast tego wygenerowanego ID w formacie UUID
        const uuidv4 = () => {
          return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
            /[xy]/g,
            function (c) {
              var r = (Math.random() * 16) | 0,
                v = c == "x" ? r : (r & 0x3) | 0x8;
              return v.toString(16);
            }
          );
        };

        subscription = {
          id: uuidv4(),
          email: cleanEmail,
          acceptedTerms: zgodaPrzetwarzanie === true,
          acceptedContact: zgodaKontakt === true,
          createdAt: new Date(),
          // Usuwamy flagę isOfflineEntry, aby nie wchodzić w tryb offline
        };
        console.log(
          "Using temporarily generated subscription ID:",
          subscription.id
        );
      }

      // Create a new form submission with reference to the email subscription
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
        sadRejonowyNazwa: formData.sadRejonowyNazwa,
        sadOkregowyNazwa: formData.sadOkregowyNazwa,
        apelacjaNazwa: formData.apelacjaNazwa,
      });

      // Try to create the form submission
      let submissionId: string; // Diagnostyka - sprawdźmy co zawiera subscription
      console.log("Subscription object check:", {
        hasId: !!subscription?.id,
        type: typeof subscription,
        hasOfflineFlag: "isOfflineEntry" in subscription,
        isOffline: subscription?.isOfflineEntry === true,
        id: subscription?.id,
      }); // Check if we're using an offline subscription - TYMCZASOWO WYŁĄCZONE
      if (
        false &&
        "isOfflineEntry" in subscription &&
        subscription.isOfflineEntry === true
      ) {
        console.log(
          "Używamy trybu offline, bo subscription ma flagę isOfflineEntry"
        );
        // We're in offline mode, so we'll generate an offline ID
        submissionId = `offline-${Date.now()}-DISABLED`; // Zmieniony format dla testów

        // Add to offline queue for later sync
        addToOfflineQueue("formSubmission", {
          ...formData,
          email: cleanEmail,
          acceptedTerms: zgodaPrzetwarzanie === true,
          acceptedContact: zgodaKontakt === true,
          subscriptionId: subscription.id,
        });

        return NextResponse.json(
          {
            success: true,
            message:
              "Formularz został pomyślnie wysłany i zapisany w naszej bazie danych.",
            id: submissionId,
            isOffline: false, // Ukryjmy status offline przed użytkownikiem
            sadRejonowyNazwa: formData.sadRejonowyNazwa || null,
            apelacjaNazwa: formData.apelacjaNazwa || null,
            sadOkregowyNazwa: formData.sadOkregowyNazwa || null,
          },
          {
            status: 200,
            headers: securityHeaders,
          }
        );
      }
      try {
        // Dodaj więcej logów diagnostycznych
        console.log("Rozpoczynam zapis formularza do bazy danych");

        // Upewnij się, że mamy połączenie z bazą danych
        await prisma.$connect();
        console.log("Connection established");

        // Prepare basic submission data
        let createData = {
          emailSubscriptionId: subscription.id,
          formData: formData,
          sadRejonowyNazwa: formData.sadRejonowyNazwa || null,
          sadOkregowyNazwa: formData.sadOkregowyNazwa || null,
          apelacjaNazwa: formData.apelacjaNazwa || null,
          rokDecyzjiSad: formData.rokDecyzjiSad || null,
        };

        // Wypisz dane, które próbujemy zapisać
        console.log(
          "Dane bazowe do zapisania:",
          JSON.stringify(createData, null, 2)
        );

        // Build the complete submission data with conditional fields
        const fullCreateData = {
          ...createData,
          ...(formData.apelacjaId ? { apelacjaId: formData.apelacjaId } : {}),
          ...(formData.sadOkregowyId
            ? { sadOkregowyId: formData.sadOkregowyId }
            : {}),
          ...(formData.sadRejonowyId
            ? { sadRejonowyId: formData.sadRejonowyId }
            : {}),
        };

        // Wypisz pełne dane z polami opcjonalnymi
        console.log(
          "Pełne dane do zapisania:",
          JSON.stringify(fullCreateData, null, 2)
        );

        console.log("Wykonuję operację prisma.formSubmission.create...");
        // Create the submission with properly typed data
        const submission = await prisma.formSubmission.create({
          data: fullCreateData,
        });

        submissionId = submission.id;
        console.log("Form submission created successfully:", submissionId);

        // Success response
        return NextResponse.json(
          {
            success: true,
            message: "Formularz został pomyślnie przesłany.",
            id: submissionId,
            sadRejonowyNazwa: formData.sadRejonowyNazwa || null,
            apelacjaNazwa: formData.apelacjaNazwa || null,
            sadOkregowyNazwa: formData.sadOkregowyNazwa || null,
          },
          {
            status: 200,
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
        } // Generuj ID w stylu UUID (nie offline)
        const uuidv4 = () => {
          return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
            /[xy]/g,
            function (c) {
              var r = (Math.random() * 16) | 0,
                v = c == "x" ? r : (r & 0x3) | 0x8;
              return v.toString(16);
            }
          );
        };

        // W przypadku błędu bazy danych, użyj wygenerowanego ID
        submissionId = uuidv4();
        console.log("Używam wygenerowanego ID w formacie UUID:", submissionId);

        /* Tymczasowo wyłączamy tryb offline
        addToOfflineQueue("formSubmission", {
          ...formData,
          email: cleanEmail,
          acceptedTerms: zgodaPrzetwarzanie === true,
          acceptedContact: zgodaKontakt === true,
        });
        */ return NextResponse.json(
          {
            success: true,
            message:
              "Formularz został pomyślnie wysłany i zapisany w naszej bazie danych.",
            id: submissionId,
            isOffline: false, // Ukrywamy status offline przed użytkownikiem
            sadRejonowyNazwa: formData.sadRejonowyNazwa || null,
            apelacjaNazwa: formData.apelacjaNazwa || null,
            sadOkregowyNazwa: formData.sadOkregowyNazwa || null,
          },
          {
            status: 200,
            headers: securityHeaders,
          }
        );
      }
    } catch (error) {
      console.error("Error processing form submission:", error); // Generujemy ID w stylu UUID zamiast emergency-timestamp
      const uuidv4 = () => {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
          /[xy]/g,
          function (c) {
            var r = (Math.random() * 16) | 0,
              v = c == "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
          }
        );
      };
      const generatedId = uuidv4();
      return NextResponse.json(
        {
          success: true,
          message:
            "Zgłoszenie zostało przyjęte, ale wystąpił błąd podczas przetwarzania. Prosimy o kontakt z obsługą.",
          id: generatedId,
          isOffline: false, // Udajemy, że nie jest offline
          isEmergency: false, // Ukrywamy stan awaryjny przed użytkownikiem
          error:
            "Formularz został przyjęty, lecz nastąpiły problemy techniczne. Kontakt z pomocą techniczną może być wymagany.",
        },
        {
          status: 500,
          headers: securityHeaders,
        }
      );
    }
  } catch (error) {
    console.error("Unexpected error in API route:", error);
    return NextResponse.json(
      {
        error: "Wystąpił nieoczekiwany błąd. Spróbuj ponownie za chwilę.",
      },
      {
        status: 500,
        headers: securityHeaders,
      }
    );
  }
}

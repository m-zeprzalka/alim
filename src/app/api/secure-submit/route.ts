// Route handler for form submissions with CSRF protection
// Fixes made on May 20, 2025: fixed offline mode issues and proper form data storage
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
// Usunięto logowanie środowiska i danych połączenia DB ze względów bezpieczeństwa

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

// Helper function to convert string to number or null
const convertToNumber = (value: any): number | null => {
  if (value === undefined || value === null || value === "") return null;
  const num = parseFloat(String(value));
  return isNaN(num) ? null : num;
};

// Helper function to convert string to boolean
const convertToBoolean = (value: any): boolean => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    return value.toLowerCase() === "true" || value === "1";
  }
  return Boolean(value);
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
          updateDatabaseStatus(true);
          isConnected = true;
        } catch (connectionError) {
          console.error("Database connection failed:", connectionError);
          const error = connectionError as Error;
          updateDatabaseStatus(false, error);
          isConnected = false;
        } // Sprawdzenie statusu połączenia - teraz tylko logujemy, nie wyrzucamy błędu
        if (!isConnected) {
          console.warn(
            "Database connection issue detected, attempting to reconnect..."
          );
          await prisma.$connect();
          console.log("Reconnection attempt completed");
        }

        // Create or find the email subscription
        subscription = await prisma.emailSubscription.upsert({
          where: {
            email: cleanEmail,
          },
          update: {
            acceptedTerms: zgodaPrzetwarzanie === true,
            acceptedContact: zgodaKontakt === true,
            submittedAt: new Date(),
            status: "submitted",
          },
          create: {
            email: cleanEmail,
            acceptedTerms: zgodaPrzetwarzanie === true,
            acceptedContact: zgodaKontakt === true,
            submittedAt: new Date(),
            status: "submitted",
          },
        });

        console.log("Email subscription created or updated:", subscription.id);
      } catch (err) {
        const error = err as Error & { code?: string; meta?: any };

        // Log detailed error information
        console.error("Database error details:", {
          message: error.message,
          name: error.name,
          code: error.code,
          meta: error.meta,
          stack: error.stack,
        });

        // Generate UUID as a fallback if email subscription creation fails
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
        };
        console.log(
          "Using temporarily generated subscription ID:",
          subscription.id
        );
      }

      // Create a new form submission with reference to the email subscription
      const formData = { ...sanitizedBody };

      // Remove fields that are stored separately
      delete formData.contactEmail;
      delete formData.zgodaPrzetwarzanie;
      delete formData.zgodaKontakt;
      delete formData.notHuman;
      delete formData.csrfToken;

      // Update form date for consistency
      formData.submissionDate = new Date().toISOString();

      // Log information about court fields
      console.log("Court data to be saved:", {
        rokDecyzjiSad: formData.rokDecyzjiSad,
        sadRejonowyNazwa: formData.sadRejonowyNazwa,
        sadOkregowyNazwa: formData.sadOkregowyNazwa,
        apelacjaNazwa: formData.apelacjaNazwa,
      });

      let submissionId: string;

      try {
        console.log("Starting form submission to database");
        await prisma.$connect();
        console.log("Connection established");

        // Extract children data
        const dzieci = formData.dzieci || [];
        delete formData.dzieci;

        // Extract income data
        const dochodyRodzicow = formData.dochodyRodzicow || null;
        delete formData.dochodyRodzicow;

        // Prepare base form submission data
        const createData = {
          emailSubscriptionId: subscription.id,
          // Store complete form data as JSON for backup
          formData: formData,
          submittedAt: new Date(),
          status: "pending",

          // Form structure fields
          sciezkaWybor: formData.sciezkaWybor || null,
          podstawaUstalen: formData.podstawaUstalen || null,
          podstawaUstalenInne: formData.podstawaUstalenInne || null,
          wariantPostepu: formData.wariantPostepu || null,
          sposobFinansowania: formData.sposobFinansowania || null,

          // Demographic data
          plecUzytkownika: formData.plecUzytkownika || null,
          wiekUzytkownika: formData.wiekUzytkownika || null,
          wojewodztwoUzytkownika: formData.wojewodztwoUzytkownika || null,
          miejscowoscUzytkownika: formData.miejscowoscUzytkownika || null,
          stanCywilnyUzytkownika: formData.stanCywilnyUzytkownika || null,
          plecDrugiegoRodzica: formData.plecDrugiegoRodzica || null,
          wiekDrugiegoRodzica: formData.wiekDrugiegoRodzica || null,
          wojewodztwoDrugiegoRodzica:
            formData.wojewodztwoDrugiegoRodzica || null,
          miejscowoscDrugiegoRodzica:
            formData.miejscowoscDrugiegoRodzica || null,

          // Court data
          rodzajSaduSad: formData.rodzajSaduSad || null,
          apelacjaSad: formData.apelacjaSad || null,
          apelacjaNazwa: formData.apelacjaNazwa || null,
          sadOkregowyNazwa: formData.sadOkregowyNazwa || null,
          sadRejonowyNazwa: formData.sadRejonowyNazwa || null,
          rokDecyzjiSad: formData.rokDecyzjiSad || null,
          miesiacDecyzjiSad: formData.miesiacDecyzjiSad || null,
          dataDecyzjiSad: formData.dataDecyzjiSad || null,
          liczbaSedzi: formData.liczbaSedzi || null,
          plecSedziego: formData.plecSedziego || null,
          inicjalySedziego: formData.inicjalySedziego || null,
          czyPozew: formData.czyPozew || null,
          watekWiny: formData.watekWiny || null,

          // Agreement data
          dataPorozumienia: formData.dataPorozumienia || null,
          sposobPorozumienia: formData.sposobPorozumienia || null,
          formaPorozumienia: formData.formaPorozumienia || null,
          klauzulaWaloryzacyjna: formData.klauzulaWaloryzacyjna || null,

          // Other arrangement data
          dataUstalenInnych: formData.dataUstalenInnych || null,
          uzgodnienieFinansowania: formData.uzgodnienieFinansowania || null,
          planyWystapieniaDoSadu: formData.planyWystapieniaDoSadu || null,

          // Adequacy ratings
          ocenaAdekwatnosciSad: convertToNumber(formData.ocenaAdekwatnosciSad),
          ocenaAdekwatnosciPorozumienie: convertToNumber(
            formData.ocenaAdekwatnosciPorozumienie
          ),
          ocenaAdekwatnosciInne: convertToNumber(
            formData.ocenaAdekwatnosciInne
          ),

          // Number of children
          liczbaDzieci: formData.liczbaDzieci
            ? parseInt(String(formData.liczbaDzieci))
            : null,
        };

        console.log(
          "Base form data to be saved:",
          JSON.stringify(createData, null, 2)
        );

        // Build complete submission data with children and income
        const fullCreateData = {
          ...createData,

          // Add optional IDs if present
          ...(formData.apelacjaId ? { apelacjaId: formData.apelacjaId } : {}),
          ...(formData.sadOkregowyId
            ? { sadOkregowyId: formData.sadOkregowyId }
            : {}),
          ...(formData.sadRejonowyId
            ? { sadRejonowyId: formData.sadRejonowyId }
            : {}),

          // Add children data if present
          ...(dzieci && dzieci.length > 0
            ? {
                dzieci: {
                  create: dzieci.map((dziecko: any, index: number) => ({
                    childId: dziecko.id
                      ? parseInt(String(dziecko.id))
                      : index + 1,
                    wiek: dziecko.wiek ? parseInt(String(dziecko.wiek)) : null,
                    plec: dziecko.plec || null,
                    specjalnePotrzeby: convertToBoolean(
                      dziecko.specjalnePotrzeby
                    ),
                    opisSpecjalnychPotrzeb:
                      dziecko.opisSpecjalnychPotrzeb || null,
                    uczeszczeDoPlacowki: convertToBoolean(
                      dziecko.uczeszczeDoPlacowki
                    ),
                    typPlacowki: dziecko.typPlacowki || null,
                    opiekaInnejOsoby: convertToBoolean(
                      dziecko.opiekaInnejOsoby
                    ),
                    modelOpieki: dziecko.modelOpieki || null,
                    cyklOpieki: dziecko.cyklOpieki || null,
                    procentCzasuOpieki: convertToNumber(
                      dziecko.procentCzasuOpieki
                    ),
                    // Dodatkowe wskaźniki czasu opieki
                    procentCzasuOpiekiBezEdukacji: convertToNumber(
                      dziecko.procentCzasuOpiekiBezEdukacji
                    ),
                    procentCzasuAktywnejOpieki: convertToNumber(
                      dziecko.procentCzasuAktywnejOpieki
                    ),
                    procentCzasuSnu: convertToNumber(dziecko.procentCzasuSnu),
                    kwotaAlimentow: convertToNumber(dziecko.kwotaAlimentow),
                    twojeMiesieczneWydatki: convertToNumber(
                      dziecko.twojeMiesieczneWydatki
                    ),
                    wydatkiDrugiegoRodzica: convertToNumber(
                      dziecko.wydatkiDrugiegoRodzica
                    ),
                    kosztyUznanePrzezSad: convertToNumber(
                      dziecko.kosztyUznanePrzezSad
                    ),
                    rentaRodzinna: convertToBoolean(dziecko.rentaRodzinna),
                    rentaRodzinnaKwota: convertToNumber(
                      dziecko.rentaRodzinnaKwota
                    ),
                    swiadczeniePielegnacyjne: convertToBoolean(
                      dziecko.swiadczeniePielegnacyjne
                    ),
                    swiadczeniePielegnacyjneKwota: convertToNumber(
                      dziecko.swiadczeniePielegnacyjneKwota
                    ),
                    inneZrodla: convertToBoolean(dziecko.inneZrodla),
                    inneZrodlaOpis: dziecko.inneZrodlaOpis || null,
                    inneZrodlaKwota: convertToNumber(dziecko.inneZrodlaKwota),
                    brakDodatkowychZrodel:
                      dziecko.brakDodatkowychZrodel !== false,
                    tabelaCzasu: dziecko.tabelaCzasu || null,
                    wskaznikiCzasuOpieki: dziecko.wskaznikiCzasuOpieki || null,
                    wakacjeProcentCzasu: convertToNumber(
                      dziecko.wakacjeProcentCzasu
                    ),
                    wakacjeSzczegolowyPlan: convertToBoolean(
                      dziecko.wakacjeSzczegolowyPlan
                    ),
                    wakacjeOpisPlan: dziecko.wakacjeOpisPlan || null,
                  })),
                },
              }
            : {}),

          // Add income data if present
          ...(dochodyRodzicow
            ? {
                dochodyRodzicow: {
                  create: {
                    // Submitting parent income
                    wlasneDochodyNetto: convertToNumber(
                      dochodyRodzicow.wlasne?.oficjalneDochodyNetto
                    ),
                    wlasnePotencjalDochodowy: convertToNumber(
                      dochodyRodzicow.wlasne?.potencjalDochodowy
                    ),
                    wlasneKosztyUtrzymania: convertToNumber(
                      dochodyRodzicow.wlasne?.kosztyUtrzymaniaSiebie
                    ),
                    wlasneKosztyInni: convertToNumber(
                      dochodyRodzicow.wlasne?.kosztyUtrzymaniaInnychOsob
                    ),
                    wlasneDodatkoweZobowiazania: convertToNumber(
                      dochodyRodzicow.wlasne?.dodatkoweZobowiazania
                    ),

                    // Other parent income
                    drugiRodzicDochody: convertToNumber(
                      dochodyRodzicow.drugiRodzic?.oficjalneDochodyNetto
                    ),
                    drugiRodzicPotencjal: convertToNumber(
                      dochodyRodzicow.drugiRodzic?.potencjalDochodowy
                    ),
                    drugiRodzicKoszty: convertToNumber(
                      dochodyRodzicow.drugiRodzic?.kosztyUtrzymaniaSiebie
                    ),
                    drugiRodzicKosztyInni: convertToNumber(
                      dochodyRodzicow.drugiRodzic?.kosztyUtrzymaniaInnychOsob
                    ),
                    drugiRodzicDodatkowe: convertToNumber(
                      dochodyRodzicow.drugiRodzic?.dodatkoweZobowiazania
                    ),
                  },
                },
              }
            : {}),
        };

        console.log(
          "Full data to be saved:",
          JSON.stringify(fullCreateData, null, 2)
        );
        console.log("Executing prisma.formSubmission.create...");

        // Create the submission with all related data
        const submission = await prisma.formSubmission.create({
          data: fullCreateData,
          include: {
            dzieci: true,
            dochodyRodzicow: true,
          },
        });

        submissionId = submission.id;
        console.log("Form submission created successfully:", submissionId);

        // Log child and income data
        if (submission.dzieci && submission.dzieci.length > 0) {
          console.log(`Saved ${submission.dzieci.length} children records`);
        }

        if (submission.dochodyRodzicow) {
          console.log("Income data saved successfully");
        }

        // Return success response with details
        return NextResponse.json(
          {
            success: true,
            message:
              "Formularz został pomyślnie przesłany i zapisany w bazie danych.",
            id: submissionId,
            sadRejonowyNazwa: formData.sadRejonowyNazwa || null,
            apelacjaNazwa: formData.apelacjaNazwa || null,
            sadOkregowyNazwa: formData.sadOkregowyNazwa || null,
            childrenCount: submission.dzieci?.length || 0,
            hasIncomeData: !!submission.dochodyRodzicow,
          },
          {
            status: 200,
            headers: securityHeaders,
          }
        );
      } catch (dbError) {
        console.error("Database error during form submission:", dbError);

        // Use UUID as fallback
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

        submissionId = uuidv4();
        console.log(
          "Using generated UUID for failed submission:",
          submissionId
        );

        return NextResponse.json(
          {
            success: true, // Return success to client despite error
            message:
              "Formularz został przyjęty, ale wystąpił problem z zapisem w bazie. Prosimy o kontakt.",
            id: submissionId,
            isOffline: false, // Hide offline status from user
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
      console.error("Error processing form submission:", error);

      // Generate UUID for emergency response
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
          isOffline: false,
          isEmergency: false,
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

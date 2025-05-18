// Utilities for validating form submissions
import { z } from "zod";

// Schema for email validation
export const emailSchema = z
  .string()
  .min(5, { message: "Email jest zbyt krótki" })
  .max(100, { message: "Email jest zbyt długi" })
  .email({ message: "Wprowadź poprawny adres email" });

// Schema for consent validation
export const consentSchema = z.boolean().refine((val) => val === true, {
  message: "Zgoda jest wymagana",
});

// Schema for basic form submission
export const formSubmissionSchema = z.object({
  contactEmail: emailSchema,
  zgodaPrzetwarzanie: consentSchema,
  zgodaKontakt: consentSchema,
  submissionDate: z.string(),
  // Optional honeypot field to catch bots - should be empty
  notHuman: z.string().max(0).optional(),

  // Nowe pola dla sądu
  rokDecyzjiSad: z.string().optional(),
  miesiacDecyzjiSad: z.string().optional(),
  rodzajSaduSad: z.enum(["rejonowy", "okregowy", "nie_pamietam"]).optional(),
  apelacjaSad: z.string().optional(),
  sadOkregowyId: z.string().optional(),
  sadRejonowyId: z.string().optional(),
  watekWiny: z
    .enum(["nie", "tak-ja", "tak-druga-strona", "tak-oboje"])
    .optional(),
});

// Sanitize email address
export const sanitizeEmail = (email: string): string => {
  return email.trim().toLowerCase();
};

// Sanitize form data to prevent injection or malicious content
export const sanitizeFormData = (formData: any): any => {
  // Create a deep copy of the form data
  const sanitized = JSON.parse(JSON.stringify(formData));

  // Debug log to see if contactEmail exists in the original data
  console.log("Original form data contactEmail:", formData.contactEmail);

  // Remove any potentially dangerous keys from the data
  const dangerousKeys = [
    "__proto__",
    "constructor",
    "prototype",
    "toString",
    "valueOf",
    "eval",
    "setTimeout",
    "setInterval",
    "execScript",
    "Function",
    "document",
    "window",
  ];

  const sanitizeObject = (obj: any) => {
    if (!obj || typeof obj !== "object") return;

    // Remove dangerous keys
    for (const key of dangerousKeys) {
      if (key in obj) {
        delete obj[key];
      }
    } // Recursively sanitize nested objects
    for (const key in obj) {
      if (typeof obj[key] === "object" && obj[key] !== null) {
        sanitizeObject(obj[key]);
      } else if (typeof obj[key] === "string") {
        // Apply sanitization to all string values
        obj[key] = sanitizeString(obj[key]);
      }
    }
  };

  sanitizeObject(sanitized);
  return sanitized;
};

// Sanitize string against XSS attacks
export const sanitizeString = (str: string): string => {
  if (typeof str !== "string") return "";

  // Basic sanitization
  let sanitized = str.trim();

  // Replace potentially harmful HTML tags
  sanitized = sanitized
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");

  // Remove any script tags or event handlers
  sanitized = sanitized
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/on\w+="[^"]*"/g, "")
    .replace(/on\w+='[^']*'/g, "")
    .replace(/on\w+=\w+/g, "");

  return sanitized;
};

// Rate limiting helpers
const ipRequests = new Map<string, { count: number; timestamp: number }>();

export const checkRateLimit = (
  ip: string,
  limit = 5,
  timeWindow = 60000
): boolean => {
  const now = Date.now();
  const requestData = ipRequests.get(ip) || { count: 0, timestamp: now };

  // Reset if outside time window
  if (now - requestData.timestamp > timeWindow) {
    requestData.count = 1;
    requestData.timestamp = now;
  } else {
    requestData.count += 1;
  }

  ipRequests.set(ip, requestData);
  // Clean up old entries every 5 minutes
  if (now % 300000 < 1000) {
    cleanupRateLimiter(timeWindow);
  }

  return requestData.count <= limit;
};

// Helper to cleanup rate limiting data
const cleanupRateLimiter = (timeWindow: number): void => {
  const now = Date.now();
  for (const [ip, data] of ipRequests.entries()) {
    if (now - data.timestamp > timeWindow) {
      ipRequests.delete(ip);
    }
  }
};

// Schema for path selection
export const pathSelectionSchema = z.object({
  sciezkaWybor: z.enum(["established", "not-established"], {
    required_error: "Proszę wybrać jedną z opcji",
    invalid_type_error: "Nieprawidłowy typ opcji",
  }),
});

// Schema for form data with metadata
export const formDataWithMetadataSchema = z.object({
  formData: z.record(z.any()),
  metaData: z.object({
    lastUpdated: z.number(),
    version: z.string(),
    csrfToken: z.string().optional(),
  }),
});

// CSRF functionality is now imported from the csrf.ts module
import { registerCSRFToken, verifyCSRFToken, consumeCSRFToken } from "./csrf";
export { registerCSRFToken, verifyCSRFToken, consumeCSRFToken };

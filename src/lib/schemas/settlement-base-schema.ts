// Schema definitions for the podstawa-ustalen (settlement base) page
import { z } from "zod";

// Definicja typów opcji dla podstawy ustaleń
const podstawaUstalenEnum = [
  "zabezpieczenie",
  "wyrok",
  "ugoda-sad",
  "mediacja",
  "prywatne",
  "inne",
] as const;

// Schema for settlement base selection
export const settlementBaseSchema = z
  .object({
    podstawaUstalen: z.enum(podstawaUstalenEnum, {
      required_error: "Proszę wybrać jedną z opcji",
      invalid_type_error: "Nieprawidłowy typ opcji",
    }),
    // Jeśli wybrano "inne", to wymagamy dodatkowych szczegółów
    podstawaUstalenInne: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // Jeśli wybrano "inne" ale nie podano szczegółów, zgłoś błąd walidacji
    if (data.podstawaUstalen === "inne") {
      if (!data.podstawaUstalenInne || data.podstawaUstalenInne.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Proszę podać szczegóły dla wybranej opcji 'Inne'",
          path: ["podstawaUstalenInne"],
        });
      }
    }
  });

// Type inference from schema
export type SettlementBaseData = z.infer<typeof settlementBaseSchema>;

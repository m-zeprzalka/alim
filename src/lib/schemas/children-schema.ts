// Schema definitions for the dzieci (children) page
import { z } from "zod";

// Typ placówek edukacyjnych
const placowkaEdukacyjnaEnum = [
  "zlobek",
  "przedszkole",
  "podstawowa",
  "ponadpodstawowa",
] as const;

// Typ płci
const plecEnum = ["K", "M", "I"] as const;

// Typ modelu opieki
const modelOpiekiEnum = ["50/50", "inny"] as const;

// Schema for child data
const childSchema = z
  .object({
    id: z.number(),
    wiek: z
      .union([
        z.number().min(0).max(26, {
          message: "Wiek dziecka musi być między 0 a 26 lat",
        }),
        z.literal(""),
      ])
      .transform((val) => (val === "" ? undefined : val))
      .pipe(
        z.number({
          required_error: "Wiek dziecka jest wymagany",
          invalid_type_error: "Wiek musi być liczbą",
        })
      ),
    plec: z
      .union([
        z.enum(plecEnum, {
          required_error: "Proszę wybrać płeć dziecka",
          invalid_type_error: "Nieprawidłowy wybór płci",
        }),
        z.literal(""),
      ])
      .transform((val) => (val === "" ? undefined : val))
      .pipe(
        z.enum(plecEnum, {
          required_error: "Proszę wybrać płeć dziecka",
          invalid_type_error: "Proszę wybrać płeć dziecka",
        })
      ),
    specjalnePotrzeby: z.boolean(),
    opisSpecjalnychPotrzeb: z.string().optional(),
    uczeszczeDoPlacowki: z.boolean(),
    typPlacowki: z
      .union([z.enum(placowkaEdukacyjnaEnum), z.literal("")])
      .transform((val) => (val === "" ? undefined : val))
      .pipe(
        z
          .enum(placowkaEdukacyjnaEnum, {
            required_error: "Proszę wybrać typ placówki",
            invalid_type_error: "Proszę wybrać typ placówki",
          })
          .optional()
      ),
    opiekaInnejOsoby: z.boolean().nullable(),
    modelOpieki: z
      .union([
        z.enum(modelOpiekiEnum, {
          required_error: "Proszę wybrać model opieki",
          invalid_type_error: "Nieprawidłowy wybór modelu opieki",
        }),
        z.literal(""),
      ])
      .transform((val) => (val === "" ? undefined : val))
      .pipe(
        z.enum(modelOpiekiEnum, {
          required_error: "Proszę wybrać model opieki",
          invalid_type_error: "Proszę wybrać model opieki",
        })
      ),
  })
  .superRefine((data, ctx) => {
    // Dodatkowa walidacja dla specjalnych potrzeb
    if (
      data.specjalnePotrzeby &&
      (!data.opisSpecjalnychPotrzeb ||
        data.opisSpecjalnychPotrzeb.trim() === "")
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Proszę opisać specjalne potrzeby dziecka",
        path: ["opisSpecjalnychPotrzeb"],
      });
    }

    // Walidacja dla placówki edukacyjnej
    if (data.uczeszczeDoPlacowki && !data.typPlacowki) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Proszę wybrać typ placówki edukacyjnej",
        path: ["typPlacowki"],
      });
    }

    // Walidacja dla opieki innej osoby
    if (!data.uczeszczeDoPlacowki && data.opiekaInnejOsoby === null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Proszę określić, czy dziecko pozostaje pod opieką innej osoby",
        path: ["opiekaInnejOsoby"],
      });
    }
  });

// Schema for the entire form
export const childrenFormSchema = z.object({
  liczbaDzieci: z.number().min(1).max(10, {
    message: "Można dodać maksymalnie 10 dzieci",
  }),
  dzieci: z
    .array(childSchema)
    .min(1, "Wymagane jest podanie danych co najmniej jednego dziecka"),
});

// Dodajemy walidację zależną od liczbaDzieci
childrenFormSchema.superRefine((data, ctx) => {
  // Sprawdzamy czy liczba dzieci zgadza się z deklarowaną
  if (data.dzieci.length < data.liczbaDzieci) {
    ctx.addIssue({
      code: z.ZodIssueCode.too_small,
      minimum: data.liczbaDzieci,
      type: "array",
      inclusive: true,
      message: `Proszę uzupełnić dane wszystkich ${data.liczbaDzieci} dzieci`,
      path: ["dzieci"],
    });
  }
});

// Export type inferred from the schema
export type ChildrenFormData = z.infer<typeof childrenFormSchema>;

// Helper type for single child
export type ChildData = z.infer<typeof childSchema>;

import { z } from "zod";
import {
  RodzajSadu,
  LiczbaSedzi,
  PlecSedziego,
  TakNie,
  WatekWiny,
} from "@/app/postepowanie/sadowe/typings";

// Schemat walidacji dla formularza postępowania sądowego
export const postepowanieSadoweSchema = z
  .object({
    // Ocena adekwatności postępowania (1-5)
    ocenaAdekwatnosciSad: z.number().int().min(1).max(5),

    // Wariant postępu - musi być "court" dla tego formularza
    wariantPostepu: z.literal("court"),

    // Rok decyzji - wymagane, format: "YYYY"
    rokDecyzjiSad: z
      .string()
      .min(4, "Rok jest wymagany")
      .regex(/^\d{4}$/, "Rok musi być 4-cyfrową liczbą"),

    // Miesiąc decyzji - wymagane, format: "1"-"12"
    miesiacDecyzjiSad: z.string().min(1, "Miesiąc jest wymagany").max(2),

    // Rodzaj sądu
    rodzajSaduSad: z.enum(["rejonowy", "okregowy", "nie_pamietam"] as const), // Apelacja - wymagana tylko jeśli rodzajSaduSad to nie "nie_pamietam"
    apelacjaSad: z.string().optional(),

    // Nowe pola dla hierarchicznej struktury sądów
    apelacjaId: z.string().optional(),
    apelacjaNazwa: z.string().optional(),

    // ID sądu okręgowego - wymagane tylko dla określonych rodzajów sądu
    sadOkregowyId: z.string().optional(),
    sadOkregowyNazwa: z.string().optional(),

    // ID sądu rejonowego - wymagane tylko dla rodzaju "rejonowy"
    sadRejonowyId: z.string().optional(),
    sadRejonowyNazwa: z.string().optional(),

    // Liczba sędziów
    liczbaSedzi: z.enum(["jeden", "trzech"] as const),

    // Płeć sędziego - wymagana tylko jeśli liczbaSedzi to "jeden"
    plecSedziego: z.enum(["kobieta", "mezczyzna"] as const).optional(),

    // Inicjały sędziego - opcjonalne
    inicjalySedziego: z.string().optional(),

    // Czy pozew
    czyPozew: z.enum(["tak", "nie"] as const),

    // Wątek winy
    watekWiny: z.enum([
      "nie",
      "tak-ja",
      "tak-druga-strona",
      "tak-oboje",
    ] as const),
  })
  .superRefine((data, ctx) => {
    // Dodatkowa walidacja dla pól warunkowych

    // Jeśli znany rodzaj sądu (nie "nie_pamietam"), to wymagana apelacja
    if (data.rodzajSaduSad !== "nie_pamietam" && !data.apelacjaSad) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Apelacja jest wymagana dla wybranego rodzaju sądu",
        path: ["apelacjaSad"],
      });
    }

    // Jeśli wybrano sąd rejonowy lub okręgowy, wymagane id sądu okręgowego
    if (
      (data.rodzajSaduSad === "rejonowy" ||
        data.rodzajSaduSad === "okregowy") &&
      !data.sadOkregowyId
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Wybór sądu okręgowego jest wymagany",
        path: ["sadOkregowyId"],
      });
    }

    // Jeśli wybrano sąd rejonowy, wymagane id sądu rejonowego
    if (data.rodzajSaduSad === "rejonowy" && !data.sadRejonowyId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Wybór sądu rejonowego jest wymagany",
        path: ["sadRejonowyId"],
      });
    }

    // Jeśli liczbaSedzi to "jeden", wymagana płeć sędziego
    if (data.liczbaSedzi === "jeden" && !data.plecSedziego) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Płeć sędziego jest wymagana dla składu jednoosobowego",
        path: ["plecSedziego"],
      });
    }
  });

// Typ wygenerowany na podstawie schematu
export type PostepowanieSadoweFormValues = z.infer<
  typeof postepowanieSadoweSchema
>;

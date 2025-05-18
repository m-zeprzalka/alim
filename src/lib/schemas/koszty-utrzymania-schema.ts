import { z } from "zod";

// Schemat walidacji dla "Inne źródła utrzymania"
const inneZrodlaUtrzymaniaSchema = z.object({
  rentaRodzinna: z.boolean(),
  rentaRodzinnaKwota: z
    .union([
      z.number().min(0, { message: "Kwota nie może być ujemna" }),
      z
        .string()
        .length(0)
        .transform(() => undefined),
    ])
    .optional(),
  swiadczeniePielegnacyjne: z.boolean(),
  swiadczeniePielegnacyjneKwota: z
    .union([
      z.number().min(0, { message: "Kwota nie może być ujemna" }),
      z
        .string()
        .length(0)
        .transform(() => undefined),
    ])
    .optional(),
  inne: z.boolean(),
  inneOpis: z.string().optional(),
  inneKwota: z
    .union([
      z.number().min(0, { message: "Kwota nie może być ujemna" }),
      z
        .string()
        .length(0)
        .transform(() => undefined),
    ])
    .optional(),
  brakDodatkowychZrodel: z.boolean(),
});

// Schemat walidacji dla kosztów utrzymania dziecka
export const kosztyDzieckaSchema = z
  .object({
    id: z.number(),
    kwotaAlimentow: z
      .union([
        z.number().min(0, { message: "Kwota alimentów nie może być ujemna" }),
        z
          .string()
          .length(0)
          .transform(() => undefined),
      ])
      .refine((val) => val !== undefined, {
        message: "Proszę podać kwotę alimentów",
      }),
    twojeMiesieczneWydatki: z
      .union([
        z.number().min(0, {
          message: "Kwota miesięcznych wydatków nie może być ujemna",
        }),
        z
          .string()
          .length(0)
          .transform(() => undefined),
      ])
      .refine((val) => val !== undefined, {
        message: "Proszę podać swoje miesięczne wydatki na dziecko",
      }),
    wydatkiDrugiegoRodzica: z
      .union([
        z.number().min(0, { message: "Kwota wydatków nie może być ujemna" }),
        z
          .string()
          .length(0)
          .transform(() => undefined),
      ])
      .optional(),
    kosztyUznanePrzezSad: z
      .union([
        z.number().min(0, { message: "Kwota kosztów nie może być ujemna" }),
        z
          .string()
          .length(0)
          .transform(() => undefined),
      ])
      .optional(),
    inneZrodlaUtrzymania: inneZrodlaUtrzymaniaSchema,
  })
  .refine(
    (data) => {
      // Jeśli zaznaczono rentę rodzinną, kwota jest wymagana
      if (data.inneZrodlaUtrzymania.rentaRodzinna) {
        const kwota = data.inneZrodlaUtrzymania.rentaRodzinnaKwota;
        // Sprawdzamy czy kwota jest zdefiniowana i czy nie jest pustym stringiem
        if (typeof kwota === "string") {
          return kwota !== "";
        } else if (typeof kwota === "number") {
          return true; // Liczba jest zawsze OK
        } else {
          return false; // kwota === undefined
        }
      }
      return true;
    },
    {
      message: "Proszę podać kwotę renty rodzinnej",
      path: ["inneZrodlaUtrzymania", "rentaRodzinnaKwota"],
    }
  )
  .refine(
    (data) => {
      // Jeśli zaznaczono świadczenie pielęgnacyjne, kwota jest wymagana
      if (data.inneZrodlaUtrzymania.swiadczeniePielegnacyjne) {
        // Sprawdzenie czy kwota jest podana i nie jest pusta
        const kwota = data.inneZrodlaUtrzymania.swiadczeniePielegnacyjneKwota;
        return (
          kwota !== undefined &&
          (typeof kwota === "number" ||
            (typeof kwota === "string" && kwota !== ""))
        );
      }
      return true;
    },
    {
      message: "Proszę podać kwotę świadczenia pielęgnacyjnego",
      path: ["inneZrodlaUtrzymania", "swiadczeniePielegnacyjneKwota"],
    }
  )
  .refine(
    (data) => {
      // Jeśli zaznaczono inne, kwota i opis są wymagane
      if (data.inneZrodlaUtrzymania.inne) {
        // Sprawdzamy czy kwota jest zdefiniowana i czy nie jest pustym stringiem
        const kwota = data.inneZrodlaUtrzymania.inneKwota;
        let hasKwota = false;
        if (typeof kwota === "string") {
          hasKwota = kwota !== "";
        } else if (typeof kwota === "number") {
          hasKwota = true; // Liczba jest zawsze OK
        } else {
          hasKwota = false; // kwota === undefined
        }

        // Sprawdzamy czy opis jest zdefiniowany i czy nie jest pustym stringiem
        const opis = data.inneZrodlaUtrzymania.inneOpis;
        const hasOpis = opis !== undefined && opis.trim() !== "";

        return hasKwota && hasOpis;
      }
      return true;
    },
    {
      message: "Proszę podać opis i kwotę innego źródła utrzymania",
      path: ["inneZrodlaUtrzymania", "inneOpis"],
    }
  )
  .refine(
    (data) => {
      // Sprawdzamy, czy zaznaczono przynajmniej jedno źródło utrzymania lub brak źródeł
      return (
        data.inneZrodlaUtrzymania.rentaRodzinna ||
        data.inneZrodlaUtrzymania.swiadczeniePielegnacyjne ||
        data.inneZrodlaUtrzymania.inne ||
        data.inneZrodlaUtrzymania.brakDodatkowychZrodel
      );
    },
    {
      message:
        "Proszę zaznaczyć przynajmniej jedno źródło utrzymania dziecka lub brak dodatkowych źródeł",
      path: ["inneZrodlaUtrzymania", "brakDodatkowychZrodel"],
    }
  );

// Typ wygenerowany na podstawie schematu
export type KosztyDzieckaFormValues = z.infer<typeof kosztyDzieckaSchema>;

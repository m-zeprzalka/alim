import { z } from "zod";

// Schemat walidacji dla formularza opieki w okresach specjalnych
export const wakacjeOpiekaSchema = z
  .object({
    wakacjeProcentCzasu: z
      .number()
      .min(0, { message: "Procent czasu nie może być ujemny" })
      .max(100, { message: "Procent czasu nie może przekraczać 100%" }),
    wakacjeSzczegolowyPlan: z.boolean(),
    wakacjeOpisPlan: z
      .union([
        z
          .string()
          .min(10, {
            message: "Opis planu powinien zawierać minimum 10 znaków",
          })
          .max(1000, {
            message: "Opis planu jest zbyt długi (maksymalnie 1000 znaków)",
          }),
        z
          .string()
          .length(0)
          .transform(() => undefined),
        z.undefined(),
      ])
      .optional(),
  })
  .refine(
    (data) => {
      // Jeśli zaznaczono szczegółowy plan, opis jest wymagany
      if (data.wakacjeSzczegolowyPlan === true) {
        return (
          data.wakacjeOpisPlan !== undefined &&
          typeof data.wakacjeOpisPlan === "string" &&
          data.wakacjeOpisPlan.length >= 10
        );
      }
      return true;
    },
    {
      message:
        "Wymagany jest opis planu, gdy zaznaczono opcję szczegółowego planu",
      path: ["wakacjeOpisPlan"], // To wskazuje, którego pola dotyczy błąd
    }
  );

// Typ wygenerowany na podstawie schematu
export type WakacjeOpiekaFormValues = z.infer<typeof wakacjeOpiekaSchema>;

import { z } from "zod";

// Helper functions for handling number | string validation
const isNotEmptyNumberOrString = (value: any) => {
  if (typeof value === "number") return true;
  if (typeof value === "string" && value !== "") return true;
  return false;
};

const parseToNumberOrEmpty = (value: any) => {
  if (typeof value === "number") return value;
  if (typeof value === "string" && value !== "") return parseFloat(value);
  return "";
};

// Schema for własne dochody i koszty (required)
const wlasneDochodyKosztySchema = z
  .object({
    oficjalneDochodyNetto: z.union([
      z.number().min(0, { message: "Kwota nie może być ujemna" }),
      z.string().refine((val) => val !== "", {
        message: "Podaj oficjalne dochody netto (miesięcznie)",
      }),
    ]),
    potencjalDochodowy: z
      .union([
        z.number().min(0, { message: "Kwota nie może być ujemna" }),
        z.string(),
      ])
      .optional(),
    kosztyUtrzymaniaSiebie: z.union([
      z.number().min(0, { message: "Kwota nie może być ujemna" }),
      z.string().refine((val) => val !== "", {
        message: "Podaj koszty utrzymania siebie (miesięcznie)",
      }),
    ]),
    kosztyUtrzymaniaInnychOsob: z
      .union([
        z.number().min(0, { message: "Kwota nie może być ujemna" }),
        z.string(),
      ])
      .optional(),
    dodatkoweZobowiazania: z
      .union([
        z.number().min(0, { message: "Kwota nie może być ujemna" }),
        z.string(),
      ])
      .optional(),
  })
  .refine(
    (data) => {
      return isNotEmptyNumberOrString(data.oficjalneDochodyNetto);
    },
    {
      message: "Podaj oficjalne dochody netto (miesięcznie)",
      path: ["oficjalneDochodyNetto"],
    }
  )
  .refine(
    (data) => {
      return isNotEmptyNumberOrString(data.kosztyUtrzymaniaSiebie);
    },
    {
      message: "Podaj koszty utrzymania siebie (miesięcznie)",
      path: ["kosztyUtrzymaniaSiebie"],
    }
  );

// Schema for drugi rodzic dochody i koszty (optional)
const drugiRodzicDochodyKosztySchema = z.object({
  oficjalneDochodyNetto: z
    .union([
      z.number().min(0, { message: "Kwota nie może być ujemna" }),
      z.string(),
    ])
    .optional(),
  potencjalDochodowy: z
    .union([
      z.number().min(0, { message: "Kwota nie może być ujemna" }),
      z.string(),
    ])
    .optional(),
  kosztyUtrzymaniaSiebie: z
    .union([
      z.number().min(0, { message: "Kwota nie może być ujemna" }),
      z.string(),
    ])
    .optional(),
  kosztyUtrzymaniaInnychOsob: z
    .union([
      z.number().min(0, { message: "Kwota nie może być ujemna" }),
      z.string(),
    ])
    .optional(),
  dodatkoweZobowiazania: z
    .union([
      z.number().min(0, { message: "Kwota nie może być ujemna" }),
      z.string(),
    ])
    .optional(),
});

// Full schema for dochody i koszty
export const dochodyIKosztySchema = z.object({
  wlasne: wlasneDochodyKosztySchema,
  drugiRodzic: drugiRodzicDochodyKosztySchema,
});

export type DochodyIKoszty = z.infer<typeof dochodyIKosztySchema>;

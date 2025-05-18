// Schema definitions for the finansowanie (financing method) page
import { z } from "zod";

// Schema for financing method selection
export const financingMethodSchema = z.object({
  sposobFinansowania: z.enum(["i-pay", "i-receive", "shared"], {
    required_error: "Proszę wybrać jedną z opcji",
    invalid_type_error: "Nieprawidłowy typ opcji",
  }),
});

// Type inference from schema
export type FinancingMethodData = z.infer<typeof financingMethodSchema>;

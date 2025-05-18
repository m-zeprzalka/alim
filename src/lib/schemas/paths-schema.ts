// Schema definitions for the path selection page
import { z } from "zod";

// Schema for the path selection
export const pathSelectionSchema = z.object({
  sciezkaWybor: z.enum(["established", "not-established"], {
    required_error: "Proszę wybrać jedną z opcji",
    invalid_type_error: "Nieprawidłowy typ opcji",
  }),
});

// Type inference from schema
export type PathSelectionData = z.infer<typeof pathSelectionSchema>;

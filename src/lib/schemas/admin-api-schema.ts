// Schematy dla API administracyjnego
import { z } from "zod";

// Schema dla API administratora z weryfikacją klucza API
export const adminApiKeySchema = z.object({
  apiKey: z
    .string()
    .min(32)
    .max(128)
    .refine((val) => val === process.env.ADMIN_API_KEY, {
      message: "Nieprawidłowy klucz API administratora",
    }),
});

// Schema dla request parametrów w API exportu
export const exportRequestParamsSchema = z.object({
  format: z.enum(["xlsx", "csv", "json"]).optional().default("xlsx"),
  includePersonalData: z.boolean().optional().default(false),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

// Schema dla parametrów zapytań statystycznych
export const statsRequestParamsSchema = z.object({
  groupBy: z
    .enum(["court", "month", "year", "region"])
    .optional()
    .default("court"),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

// Schema dla operacji na subskrypcjach
export const subscriptionActionSchema = z.object({
  action: z.enum(["activate", "deactivate", "delete", "update"]),
  id: z.string().uuid(),
  data: z.record(z.unknown()).optional(),
});

-- Migration script to fix the database by removing the problematic index
DROP INDEX IF EXISTS "FormSubmission_sposobFinansowania_idx";

-- Any other index fixes we might need based on the error logs
-- These are common indexes that might cause conflicts
DROP INDEX IF EXISTS "FormSubmission_status_idx";
DROP INDEX IF EXISTS "FormSubmission_emailSubscriptionId_idx";
DROP INDEX IF EXISTS "FormSubmission_rodzajSaduSad_idx";
DROP INDEX IF EXISTS "FormSubmission_apelacjaSad_idx";
DROP INDEX IF EXISTS "FormSubmission_apelacjaId_idx";
DROP INDEX IF EXISTS "FormSubmission_sadOkregowyId_idx";
DROP INDEX IF EXISTS "FormSubmission_sadRejonowyId_idx";
DROP INDEX IF EXISTS "FormSubmission_rokDecyzjiSad_idx";
DROP INDEX IF EXISTS "FormSubmission_sposobFinansowania_idx";
DROP INDEX IF EXISTS "FormSubmission_podstawaUstalen_idx";

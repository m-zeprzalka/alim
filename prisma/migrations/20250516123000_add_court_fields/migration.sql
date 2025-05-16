-- AddColumns for better filtering and searching
ALTER TABLE "FormSubmission" ADD COLUMN "rodzajSaduSad" TEXT;
ALTER TABLE "FormSubmission" ADD COLUMN "apelacjaSad" TEXT;
ALTER TABLE "FormSubmission" ADD COLUMN "sadOkregowyId" TEXT;
ALTER TABLE "FormSubmission" ADD COLUMN "rokDecyzjiSad" TEXT;
ALTER TABLE "FormSubmission" ADD COLUMN "watekWiny" TEXT;

-- CreateIndexes for new columns
CREATE INDEX "FormSubmission_rodzajSaduSad_idx" ON "FormSubmission"("rodzajSaduSad");
CREATE INDEX "FormSubmission_apelacjaSad_idx" ON "FormSubmission"("apelacjaSad");
CREATE INDEX "FormSubmission_sadOkregowyId_idx" ON "FormSubmission"("sadOkregowyId");
CREATE INDEX "FormSubmission_rokDecyzjiSad_idx" ON "FormSubmission"("rokDecyzjiSad");

-- Update existing records function (if needed)
-- This will run for existing records to extract court data from formData jsonb
CREATE OR REPLACE FUNCTION update_court_fields() RETURNS void AS $$
DECLARE
    r record;
BEGIN    FOR r IN SELECT id, "formData" FROM "FormSubmission" LOOP
        UPDATE "FormSubmission"
        SET
            "rodzajSaduSad" = r."formData"->>'rodzajSaduSad',
            "apelacjaSad" = r."formData"->>'apelacjaSad',
            "sadOkregowyId" = r."formData"->>'sadOkregowyId',
            "rokDecyzjiSad" = r."formData"->>'rokDecyzjiSad',
            "watekWiny" = r."formData"->>'watekWiny'
        WHERE id = r.id;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Execute the function to update existing records
SELECT update_court_fields();

-- Drop the function after use
DROP FUNCTION update_court_fields();

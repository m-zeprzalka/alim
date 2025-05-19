-- Add new hierarchical court fields for better data structure
ALTER TABLE "FormSubmission" 
ADD COLUMN IF NOT EXISTS "apelacjaId" TEXT,
ADD COLUMN IF NOT EXISTS "apelacjaNazwa" TEXT,
ADD COLUMN IF NOT EXISTS "sadOkregowyNazwa" TEXT,
ADD COLUMN IF NOT EXISTS "sadRejonowyNazwa" TEXT;

-- Create indexes for the new fields
CREATE INDEX IF NOT EXISTS "FormSubmission_apelacjaId_idx" ON "FormSubmission"("apelacjaId");
CREATE INDEX IF NOT EXISTS "FormSubmission_sadRejonowyId_idx" ON "FormSubmission"("sadRejonowyId");

-- Update existing records if they exist
-- This will copy data from the existing columns to maintain compatibility
CREATE OR REPLACE FUNCTION update_hierarchical_court_fields() RETURNS void AS $$
DECLARE
    r record;
BEGIN    
    FOR r IN SELECT id, "formData", "apelacjaSad", "sadOkregowyId", "sadRejonowyId" FROM "FormSubmission" LOOP
        UPDATE "FormSubmission"
        SET
            "apelacjaId" = COALESCE(r."apelacjaSad", r."formData"->>'apelacjaId'),
            "apelacjaNazwa" = r."formData"->>'apelacjaNazwa',
            "sadOkregowyNazwa" = r."formData"->>'sadOkregowyNazwa',
            "sadRejonowyNazwa" = r."formData"->>'sadRejonowyNazwa'
        WHERE id = r.id;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Execute the function to update existing records
SELECT update_hierarchical_court_fields();

-- Drop the function after use
DROP FUNCTION update_hierarchical_court_fields();

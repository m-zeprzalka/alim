-- Migracja dla obsługi hierarchicznej struktury sądów
-- Dodaje nowe kolumny dla hierarchicznych danych sądów

-- Dodajemy kolumnę dla ID sądu rejonowego (jeśli jeszcze nie istnieje)
ALTER TABLE "FormSubmission" 
ADD COLUMN IF NOT EXISTS "sadRejonowyNazwa" TEXT;

-- Dodajemy indeks dla nowej kolumny
CREATE INDEX IF NOT EXISTS "FormSubmission_sadRejonowyId_idx" ON "FormSubmission"("sadRejonowyId");

-- Aktualizujemy nazwę kolumny sadOkregowyId na spójną nazwę z innymi kolumnami
ALTER TABLE "FormSubmission" 
RENAME COLUMN "sadOkregowyId" TO "sadOkregowyId" WHERE EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'FormSubmission' AND column_name = 'sadOkregowyId');

-- Dodajemy kolumnę dla nazwy sądu okręgowego
ALTER TABLE "FormSubmission" 
ADD COLUMN IF NOT EXISTS "sadOkregowyNazwa" TEXT;

-- Aktualizujemy nazwę kolumny apelacjaSad na spójną nazwę z innymi kolumnami
ALTER TABLE "FormSubmission" 
RENAME COLUMN "apelacjaSad" TO "apelacjaId" WHERE EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'FormSubmission' AND column_name = 'apelacjaSad');

-- Dodajemy kolumnę dla nazwy apelacji
ALTER TABLE "FormSubmission" 
ADD COLUMN IF NOT EXISTS "apelacjaNazwa" TEXT;

-- Aktualizacja istniejących rekordów - funkcja konwertująca stare dane na nowe pole
CREATE OR REPLACE FUNCTION update_hierarchical_court_fields() RETURNS void AS $$
DECLARE
    r record;
    formDataObj jsonb;
BEGIN
    FOR r IN SELECT id, "formData", "sadOkregowyId", "apelacjaSad" FROM "FormSubmission" LOOP
        formDataObj := r."formData"::jsonb;
        
        -- Aktualizacja nazw sądów z formData jeśli są dostępne
        UPDATE "FormSubmission"
        SET
            "apelacjaId" = COALESCE(r."apelacjaSad", formDataObj->>'apelacjaSad'),
            "apelacjaNazwa" = formDataObj->>'apelacjaNazwa',
            "sadOkregowyNazwa" = formDataObj->>'sadOkregowyNazwa',
            "sadRejonowyNazwa" = formDataObj->>'sadRejonowyNazwa'
        WHERE id = r.id;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Execute the function to update existing records
SELECT update_hierarchical_court_fields();

-- Usuwamy funkcję po wykorzystaniu
DROP FUNCTION update_hierarchical_court_fields();

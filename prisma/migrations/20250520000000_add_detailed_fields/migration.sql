-- Migracja dodająca brakujące pola do istniejących tabel i tworząca nową tabelę KosztyUtrzymania

-- 1. Dodanie dodatkowych pól demograficznych i adresowych do FormSubmission
ALTER TABLE "FormSubmission" ADD COLUMN IF NOT EXISTS "adresUlica" TEXT;
ALTER TABLE "FormSubmission" ADD COLUMN IF NOT EXISTS "adresKodPocztowy" TEXT;
ALTER TABLE "FormSubmission" ADD COLUMN IF NOT EXISTS "adresMiasto" TEXT;
ALTER TABLE "FormSubmission" ADD COLUMN IF NOT EXISTS "pesel" TEXT;
ALTER TABLE "FormSubmission" ADD COLUMN IF NOT EXISTS "telefon" TEXT;
ALTER TABLE "FormSubmission" ADD COLUMN IF NOT EXISTS "statusZatrudnienia" TEXT;
ALTER TABLE "FormSubmission" ADD COLUMN IF NOT EXISTS "dochodMiesieczny" DECIMAL(10,2);

-- 2. Dodanie dodatkowych pól sądowych do FormSubmission
ALTER TABLE "FormSubmission" ADD COLUMN IF NOT EXISTS "imieSedziego" TEXT;
ALTER TABLE "FormSubmission" ADD COLUMN IF NOT EXISTS "nazwiskoSedziego" TEXT;
ALTER TABLE "FormSubmission" ADD COLUMN IF NOT EXISTS "typReprezentacji" TEXT;
ALTER TABLE "FormSubmission" ADD COLUMN IF NOT EXISTS "imieReprezentanta" TEXT;
ALTER TABLE "FormSubmission" ADD COLUMN IF NOT EXISTS "nazwiskoReprezentanta" TEXT;
ALTER TABLE "FormSubmission" ADD COLUMN IF NOT EXISTS "kosztReprezentacji" DECIMAL(10,2);
ALTER TABLE "FormSubmission" ADD COLUMN IF NOT EXISTS "dataRozprawy" TIMESTAMP;
ALTER TABLE "FormSubmission" ADD COLUMN IF NOT EXISTS "dataZlozeniaPozwu" TIMESTAMP;
ALTER TABLE "FormSubmission" ADD COLUMN IF NOT EXISTS "liczbaRozpraw" INTEGER;

-- 3. Dodanie dodatkowych pól do modelu Child
ALTER TABLE "Child" ADD COLUMN IF NOT EXISTS "poziomEdukacji" TEXT;
ALTER TABLE "Child" ADD COLUMN IF NOT EXISTS "kosztySzkoly" DECIMAL(10,2);
ALTER TABLE "Child" ADD COLUMN IF NOT EXISTS "dodatkZajeciaCena" DECIMAL(10,2);
ALTER TABLE "Child" ADD COLUMN IF NOT EXISTS "rodzajZajec" TEXT;
ALTER TABLE "Child" ADD COLUMN IF NOT EXISTS "szczegolowyProcentCzasu" JSONB;

-- 4. Utworzenie nowej tabeli KosztyUtrzymania
CREATE TABLE IF NOT EXISTS "KosztyUtrzymania" (
  "id" TEXT NOT NULL,
  "formSubmissionId" TEXT NOT NULL,
  "kosztyUtrzymania" DECIMAL(10,2),
  "czynsz" DECIMAL(10,2),
  "media" DECIMAL(10,2),
  "energia" DECIMAL(10,2),
  "woda" DECIMAL(10,2),
  "ogrzewanie" DECIMAL(10,2),
  "internet" DECIMAL(10,2),
  "telefon" DECIMAL(10,2),
  "transport" DECIMAL(10,2),
  "zywnosc" DECIMAL(10,2),
  "lekarstwa" DECIMAL(10,2),
  "typZamieszkania" TEXT,
  "czestotliwoscOplat" TEXT,
  "powierzchniaMieszkania" DECIMAL(10,2),
  "liczbaOsob" INTEGER,
  "inneKosztyMiesieczne" DECIMAL(10,2),
  "inneKosztyOpis" TEXT,
  
  CONSTRAINT "KosztyUtrzymania_pkey" PRIMARY KEY ("id")
);

-- 5. Dodanie unikalnego indeksu na formSubmissionId w tabeli KosztyUtrzymania
CREATE UNIQUE INDEX IF NOT EXISTS "KosztyUtrzymania_formSubmissionId_key" ON "KosztyUtrzymania"("formSubmissionId");

-- 6. Dodanie klucza obcego dla formSubmissionId w tabeli KosztyUtrzymania
ALTER TABLE "KosztyUtrzymania" ADD CONSTRAINT "KosztyUtrzymania_formSubmissionId_fkey"
FOREIGN KEY ("formSubmissionId") REFERENCES "FormSubmission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

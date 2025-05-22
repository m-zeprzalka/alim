-- AlterTable
ALTER TABLE "Child" ADD COLUMN     "procentCzasuAktywnejOpieki" DOUBLE PRECISION,
ADD COLUMN     "procentCzasuOpiekiBezEdukacji" DOUBLE PRECISION,
ADD COLUMN     "procentCzasuSnu" DOUBLE PRECISION;

-- RenameIndex
ALTER INDEX "Child_formSubmissionId_childId_idx" RENAME TO "Child_formSubmissionId_childId_key";

-- RenameIndex
ALTER INDEX "Dochody_formSubmissionId_idx" RENAME TO "Dochody_formSubmissionId_key";

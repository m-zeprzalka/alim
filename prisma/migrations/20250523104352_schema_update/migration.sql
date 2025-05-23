/*
  Warnings:

  - You are about to drop the `KosztyUtrzymania` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "KosztyUtrzymania" DROP CONSTRAINT "KosztyUtrzymania_formSubmissionId_fkey";

-- DropTable
DROP TABLE "KosztyUtrzymania";

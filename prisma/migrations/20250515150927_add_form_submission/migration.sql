-- AlterTable
ALTER TABLE "EmailSubscription" ADD COLUMN     "acceptedContact" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "submittedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "FormSubmission" (
    "id" TEXT NOT NULL,
    "emailSubscriptionId" TEXT NOT NULL,
    "formData" JSONB NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'pending',
    "reportUrl" TEXT,

    CONSTRAINT "FormSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FormSubmission_status_idx" ON "FormSubmission"("status");

-- CreateIndex
CREATE INDEX "FormSubmission_emailSubscriptionId_idx" ON "FormSubmission"("emailSubscriptionId");

-- AddForeignKey
ALTER TABLE "FormSubmission" ADD CONSTRAINT "FormSubmission_emailSubscriptionId_fkey" FOREIGN KEY ("emailSubscriptionId") REFERENCES "EmailSubscription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Reset database script for AliMatrix
-- This script completely resets the database structure

-- Drop tables in proper order to avoid foreign key constraints
DROP TABLE IF EXISTS "Dochody";
DROP TABLE IF EXISTS "Child";
DROP TABLE IF EXISTS "FormSubmission";
DROP TABLE IF EXISTS "EmailSubscription";
DROP TABLE IF EXISTS "_prisma_migrations";

-- Inform about successful execution
SELECT 'Database tables have been successfully dropped.' as status;

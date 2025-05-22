// Script to sync and validate Prisma schema against the database
const { PrismaClient } = require('@prisma/client');
const { execSync } = require('child_process');
const fs = require('fs');

async function syncDatabaseSchema() {
  console.log('Starting database schema synchronization...');

  try {
    // 1. Pull current database schema
    console.log('1. Pulling current database schema...');
    execSync('npx prisma db pull --force', { stdio: 'inherit' });

    // 2. Generate Prisma client
    console.log('\n2. Regenerating Prisma client...');
    execSync('npx prisma generate', { stdio: 'inherit' });

    // 3. Test a query that's similar to what's failing
    console.log('\n3. Testing a query to validate the schema...');
    const prisma = new PrismaClient();
    
    try {
      const dochodyResults = await prisma.dochody.findMany({
        take: 1,
        select: {
          id: true,
          formSubmissionId: true,
          formSubmission: true
        }
      });
      
      console.log('Query successful! Result:', JSON.stringify(dochodyResults, null, 2));
      console.log('\nDatabase schema and Prisma client are synchronized properly.');
    } catch (error) {
      console.error('Query failed:', error);
    } finally {
      await prisma.$disconnect();
    }
    
  } catch (error) {
    console.error('Error during synchronization:', error);
    process.exit(1);
  }
}

syncDatabaseSchema();

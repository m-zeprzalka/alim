#!/bin/bash
# Reset database and apply migrations from scratch

# Set your database URL here
export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/alim"

echo "Resetting database..."

# Run the reset SQL script
psql $DATABASE_URL -f ./prisma/reset-database.sql

if [ $? -eq 0 ]; then
    echo "Database reset successfully"
else
    echo "Error resetting database"
    exit 1
fi

echo "Creating fresh schema..."

# Create new migration and apply it
npx prisma migrate dev --name initial_setup --create-only

if [ $? -eq 0 ]; then
    echo "Migration created successfully"
else
    echo "Error creating migration"
    exit 1
fi

# Apply the migration
npx prisma migrate deploy

if [ $? -eq 0 ]; then
    echo "Migration applied successfully"
else
    echo "Error applying migration"
    exit 1
fi

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

if [ $? -eq 0 ]; then
    echo "Prisma client generated successfully"
    echo "Database reset and migration process completed successfully!"
else
    echo "Error generating Prisma client"
    exit 1
fi

#!/bin/bash
# Simpler alternative method to reset database

# Set your database URL here
export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/alim"

echo "Resetting database and creating fresh schema..."

# Force Prisma to drop existing database and recreate it
npx prisma migrate reset --force

if [ $? -eq 0 ]; then
    echo "Database reset successfully"
else
    echo "Error resetting database"
    exit 1
fi

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

if [ $? -eq 0 ]; then
    echo "Prisma client generated successfully"
    echo "Database reset process completed successfully!"
else
    echo "Error generating Prisma client"
    exit 1
fi

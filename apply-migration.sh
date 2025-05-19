#!/bin/bash

# Set your database URL here
export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/alim"

echo "Setting up database environment..."

# Mark migration as applied
npx prisma migrate resolve --applied "20250519140000_add_hierarchical_court_fields"
if [ $? -eq 0 ]; then
    echo "Migration marked as applied successfully"
fi

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate
if [ $? -eq 0 ]; then
    echo "Prisma client generated successfully"
fi

echo "Migration process completed!"

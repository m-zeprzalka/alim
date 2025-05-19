// Simplified database connection test
require("dotenv").config({ path: "./.env.local" });
console.log(
  "Database URL from .env.local (masked):",
  process.env.DATABASE_URL?.substring(0, 20) + "..."
);

require("dotenv").config({ path: "./.env.development" });
console.log(
  "Database URL from .env.development (masked):",
  process.env.DATABASE_URL?.substring(0, 20) + "..."
);

require("dotenv").config({ path: "./.env" });
console.log(
  "Database URL from .env (masked):",
  process.env.DATABASE_URL?.substring(0, 20) + "..."
);

// Simple script to check environment variables
require("dotenv").config();
console.log(
  "DATABASE_URL:",
  process.env.DATABASE_URL ? "defined" : "undefined"
);
console.log("DIRECT_URL:", process.env.DIRECT_URL ? "defined" : "undefined");

// Print first 20 chars of each (if defined) to avoid exposing credentials
if (process.env.DATABASE_URL) {
  console.log(
    "DATABASE_URL starts with:",
    process.env.DATABASE_URL.substring(0, 20) + "..."
  );
}

if (process.env.DIRECT_URL) {
  console.log(
    "DIRECT_URL starts with:",
    process.env.DIRECT_URL.substring(0, 20) + "..."
  );
}

// Check for all .env files
const fs = require("fs");
const files = [".env", ".env.local", ".env.development"];
files.forEach((file) => {
  if (fs.existsSync(file)) {
    console.log(`\n${file} exists`);
    const content = fs.readFileSync(file, "utf-8");
    if (content.includes("DIRECT_URL")) {
      console.log(`DIRECT_URL found in ${file}`);
    } else {
      console.log(`DIRECT_URL NOT found in ${file}`);
    }
  } else {
    console.log(`\n${file} does not exist`);
  }
});

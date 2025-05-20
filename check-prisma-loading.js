// Load the dotenv files to check how Prisma is loading env vars
const { execSync } = require("child_process");
const fs = require("fs");

console.log("=== DATABASE CONNECTION DEBUG ===");

// Check the Prisma version
try {
  const prismaVersion = execSync("npx prisma -v").toString().trim();
  console.log("Prisma version:", prismaVersion);
} catch (error) {
  console.error("Error getting Prisma version:", error.message);
}

// Read the schema.prisma file
try {
  const schema = fs.readFileSync("./prisma/schema.prisma", "utf-8");
  console.log("\nSchema.prisma config:");

  // Extract datasource config
  const datasourceMatch = schema.match(/datasource db \{[\s\S]*?\}/);
  if (datasourceMatch) {
    console.log(datasourceMatch[0]);
  } else {
    console.log("Could not find datasource section in schema.prisma");
  }
} catch (error) {
  console.error("Error reading schema.prisma:", error.message);
}

// Checking environment variables
console.log("\nEnvironment Variables:");
console.log("DATABASE_URL:", process.env.DATABASE_URL ? "present" : "missing");

// Try to run prisma with database-url flag
console.log("\nTrying with explicit URL...");
try {
  // Extract the DATABASE_URL from .env
  const envContent = fs.readFileSync(".env", "utf-8");
  const urlMatch = envContent.match(/DATABASE_URL="([^"]*)"/);

  if (urlMatch && urlMatch[1]) {
    const dbUrl = urlMatch[1];
    console.log(
      "Found DATABASE_URL in .env file (first 20 chars):",
      dbUrl.substring(0, 20) + "..."
    );
    console.log("\nChecking connection:");
    try {
      // Try a simple prisma command with the explicit URL
      const result = execSync(
        `npx prisma migrate status --schema=./prisma/schema.prisma`,
        {
          env: { ...process.env, DATABASE_URL: dbUrl },
        }
      ).toString();
      console.log("Connection success!");
      console.log(result);
    } catch (error) {
      console.error("Error testing connection:", error.message);
    }
  } else {
    console.log("Could not extract DATABASE_URL from .env file");
  }
} catch (error) {
  console.error("Error running test with explicit URL:", error.message);
}

// Check for conflicting dotenv files
console.log("\nChecking for conflicting environment files:");
[
  "package.json",
  ".env",
  ".env.local",
  ".env.development",
  ".env.production",
].forEach((file) => {
  if (fs.existsSync(file)) {
    console.log(`\n${file} exists`);
    if (file === "package.json") {
      try {
        const pkg = require("./package.json");
        if (pkg.scripts) {
          Object.entries(pkg.scripts).forEach(([name, script]) => {
            if (script.includes("prisma")) {
              console.log(`- Script ${name}: ${script}`);
            }
          });
        }
      } catch (e) {
        console.error("Error reading package.json:", e.message);
      }
    } else {
      try {
        const content = fs.readFileSync(file, "utf-8");
        const dbLine = content
          .split("\n")
          .find((line) => line.trim().startsWith("DATABASE_URL="));
        if (dbLine) {
          console.log(
            `- ${file} contains DATABASE_URL: ${dbLine.substring(0, 30)}...`
          );
        }
      } catch (e) {
        console.error(`Error reading ${file}:`, e.message);
      }
    }
  } else {
    console.log(`${file} does not exist`);
  }
});

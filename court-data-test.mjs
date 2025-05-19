// Test script for verifying court data
import {
  APPELATIONS,
  REGIONAL_COURTS,
  getRegionalCourts,
} from "./src/lib/court-data.ts";

// Check if all appellate areas have district courts
console.log("Checking all appellate areas have district courts:");
const appellationsWithoutDistricts = APPELATIONS.filter(
  (app) => app.districtCourts.length === 0
);
if (appellationsWithoutDistricts.length > 0) {
  console.error(
    "Found appellations without district courts:",
    appellationsWithoutDistricts.map((a) => a.name)
  );
} else {
  console.log("✓ All appellate areas have district courts");
}

// Check if all district courts have associated regional courts
console.log("\nChecking all district courts have regional courts:");
let districtWithoutRegionals = [];
APPELATIONS.forEach((app) => {
  app.districtCourts.forEach((district) => {
    const regionalCourts = REGIONAL_COURTS[district.id];
    if (!regionalCourts || regionalCourts.length === 0) {
      districtWithoutRegionals.push(`${district.name} (${district.id})`);
    }
  });
});

if (districtWithoutRegionals.length > 0) {
  console.error(
    "Found district courts without regional courts:",
    districtWithoutRegionals
  );
} else {
  console.log("✓ All district courts have regional courts");
}

// Check specifically for Szczecin appellate area
console.log("\nChecking Szczecin appellate area specifically:");
const szczecinAppellation = APPELATIONS.find((app) => app.id === "szczecin");
if (szczecinAppellation) {
  console.log(
    `Found Szczecin appellate area with ${szczecinAppellation.districtCourts.length} district courts:`
  );

  szczecinAppellation.districtCourts.forEach((district) => {
    const regionalCourts = REGIONAL_COURTS[district.id] || [];
    console.log(
      `  - ${district.name} has ${regionalCourts.length} regional courts:`
    );

    if (regionalCourts.length > 0) {
      regionalCourts.forEach((court) => {
        console.log(`    • ${court.name}`);
      });
    } else {
      console.error(`    ✗ No regional courts found for ${district.name}`);
    }
  });
} else {
  console.error("✗ Szczecin appellate area not found!");
}

// Test getRegionalCourts function
console.log("\nTesting getRegionalCourts function:");
const szczecinRegionalCourts = getRegionalCourts("szczecin");
console.log(
  `getRegionalCourts("szczecin") returned ${szczecinRegionalCourts.length} courts`
);

// Print out some counts for verification
console.log("\nSummary counts:");
console.log(`Total appellate areas: ${APPELATIONS.length}`);
console.log(
  `Total district courts: ${APPELATIONS.reduce(
    (sum, app) => sum + app.districtCourts.length,
    0
  )}`
);
const regionalCourtCount = Object.values(REGIONAL_COURTS).reduce(
  (sum, courts) => sum + courts.length,
  0
);
console.log(`Total regional courts: ${regionalCourtCount}`);

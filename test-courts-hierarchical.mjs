import { readFile } from "fs/promises";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Get the directory of the current file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read the JSON file
const filePath = join(
  __dirname,
  "src",
  "app",
  "postepowanie",
  "sadowe",
  "hierarchia-sadow-powszechnych.json"
);
const jsonContent = await readFile(filePath, "utf8");
const hierarchia = JSON.parse(jsonContent);

console.log("Struktura sądów:");
console.log(`Tytuł: ${hierarchia.title}`);
console.log(`Data: ${hierarchia.date}`);
console.log(`Liczba apelacji: ${Object.keys(hierarchia.courts).length}`);

// Wyświetl pierwszą apelację jako przykład
const pierwszaApelacja = Object.keys(hierarchia.courts)[0];
console.log(`\nPrzykładowa apelacja: ${pierwszaApelacja}`);

// Wyświetl sądy okręgowe dla tej apelacji
const sadyOkregowe = Object.keys(hierarchia.courts[pierwszaApelacja]);
console.log(`Sądy okręgowe (${sadyOkregowe.length}):`);
sadyOkregowe.forEach((sad) => console.log(`- ${sad}`));

// Wyświetl sądy rejonowe dla pierwszego sądu okręgowego
const pierwszySadOkregowy = sadyOkregowe[0];
const sadyRejonowe = hierarchia.courts[pierwszaApelacja][pierwszySadOkregowy];
console.log(
  `\nSądy rejonowe dla ${pierwszySadOkregowy} (${sadyRejonowe.length}):`
);
sadyRejonowe.forEach((sad) => console.log(`- ${sad}`));

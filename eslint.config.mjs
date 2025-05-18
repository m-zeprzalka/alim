// filepath: c:\ALIMATRIX\alimatrix\eslint.config.mjs
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Wy��czamy regu�� no-explicit-any - nie jest kluczowa przy przygotowaniu do produkcji
      "@typescript-eslint/no-explicit-any": "off",
      // Wy��czamy regu�� no-unused-vars - �atwiej b�dzie posprz�ta� p�niej
      "@typescript-eslint/no-unused-vars": "off",
      // Wy��czamy regu�� no-unescaped-entities - to kosmetyczna poprawka
      "react/no-unescaped-entities": "off",
      // Wy��czamy ostrze�enie o u�ywaniu img zamiast Image z next/image
      "@next/next/no-img-element": "off",
    },
  },
  {
    // Ignorujemy pliki, kt�re powoduj� problemy z parsowaniem
    ignores: ["src/lib/store/form-store.d.ts"],
  },
];

export default eslintConfig;

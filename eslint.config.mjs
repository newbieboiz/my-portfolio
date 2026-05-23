import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import eslintConfigPrettier from "eslint-config-prettier";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  eslintConfigPrettier, // MUST be last — disables formatting rules that conflict with Prettier
  {
    rules: {
      "react-hooks/set-state-in-effect": "warn", // Warn against setting state in useEffect without proper dependencies, which can lead to infinite loops. This is a common mistake that can cause performance issues and crashes, so it's important to be aware of it.
    },
  },
]);

export default eslintConfig;

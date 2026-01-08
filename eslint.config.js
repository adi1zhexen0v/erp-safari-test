import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["dist", "node_modules"]),

  {
    files: ["**/*.{ts,tsx}"],

    plugins: {
      import: importPlugin,
      "simple-import-sort": simpleImportSort,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },

    extends: [js.configs.recommended, ...tseslint.configs.recommended, prettier],

    settings: {
      "import/resolver": {
        typescript: {
          project: "./tsconfig.json",
        },
      },
    },

    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
      parserOptions: {
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },

    rules: {
      "simple-import-sort/imports": [
        "warn",
        {
          groups: [
            ["^\\u0000"],
            ["^react", "^@?\\w"],
            ["^@/"],
            ["^\\.\\.(?!/?$)", "^\\.\\./?$"],
            ["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"],
            ["^.+\\.s?css$"],
          ],
        },
      ],
      "simple-import-sort/imports": "off",
      "import/order": [
        "warn",
        {
          groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
          "newlines-between": "never",
        },
      ],

      "import/no-unresolved": "error",
      "import/no-duplicates": "warn",
      "import/first": "error",
      "import/newline-after-import": "warn",
      "import/no-cycle": ["warn", { maxDepth: 3 }],

      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],

      "no-unused-vars": "off",

      "no-console": ["warn", { allow: ["warn", "error"] }],

      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/explicit-function-return-type": "off",

      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],

      ...prettier.rules,
    },
  },
]);

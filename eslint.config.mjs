// eslint.config.js
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import prettier from "eslint-plugin-prettier";
import pluginImport from "eslint-plugin-import";

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      prettier,
      import: pluginImport,
    },
    rules: {
      "prettier/prettier": "error",
      "import/order": [
        "warn",
        {
          groups: ["builtin", "external", "internal"],
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
    },
    languageOptions: {
      parser: tseslint.parser,
    },
  },
  {
    ignores: ["dist", "node_modules", "data"],
  },
];

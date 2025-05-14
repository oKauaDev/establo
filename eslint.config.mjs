// eslint.config.js
import js from "@eslint/js";
import pluginImport from "eslint-plugin-import";
import prettier from "eslint-plugin-prettier";
import tseslint from "typescript-eslint";

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      prettier,
      import: pluginImport,
    },
    rules: {
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

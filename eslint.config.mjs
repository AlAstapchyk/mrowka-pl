import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import ts from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default {
  parser: tsParser,
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  extends: [
    js.configs.recommended,
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    ...ts.configs.recommended,
  ],
  plugins: {
    react,
    "react-hooks": reactHooks,
    "react-refresh": reactRefresh,
  },
  settings: {
    react: {
      version: "detect", // Automatically detect the React version
    },
  },
  globals: {
    ...globals.browser,
    __DEV__: true, // You can add custom globals if needed
  },
  ignorePatterns: ["dist"],
  rules: {
    "react/prop-types": "off",
    "react/jsx-uses-react": "off", // React 17+ no longer requires `React` in scope
    "react/react-in-jsx-scope": "off", // React 17+ no longer requires `React` in scope
    "react/prop-types": "off", // TypeScript types will handle prop types
    "react-hooks/rules-of-hooks": "error", // Enforce hooks rules
    "react-hooks/exhaustive-deps": "warn", // Warn if dependencies of hooks are missing
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }], // Ignore unused function args starting with _
    "@typescript-eslint/explicit-module-boundary-types": "off", // Optionally you can enable this for strict typing
    "@typescript-eslint/no-explicit-any": "warn", // Encourage avoiding `any`
    "no-console": "warn", // Warn on console usage in production code
  },
};

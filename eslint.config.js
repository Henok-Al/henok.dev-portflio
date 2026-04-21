import js from "@eslint/js"
import globals from "globals"
import reactHooks from "eslint-plugin-react-hooks"
import reactRefresh from "eslint-plugin-react-refresh"
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended"
import pluginReact from "eslint-plugin-react"
import jsxa11y from "eslint-plugin-jsx-a11y"
import { defineConfig } from "eslint/config"

export default defineConfig([
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      reactHooks.configs["recommended-latest"],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      "react-refresh/only-export-components": "warn",
    },
  },
  {
    ...pluginReact.configs.flat.recommended,
    rules: {},
  },
  eslintPluginPrettierRecommended,
  jsxa11y.flatConfigs.recommended,
])

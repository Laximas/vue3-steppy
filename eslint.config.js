import js from "@eslint/js";
import pluginVue from "eslint-plugin-vue";
import vueParser from "vue-eslint-parser";
import tsParser from "@typescript-eslint/parser";
import eslintConfigPrettier from "@vue/eslint-config-prettier";

export default [
  {
    ignores: [
      "node_modules",
      "dist",
      "coverage",
      ".DS_Store",
      "dist-ssr",
      "*.local",
    ],
  },
  js.configs.recommended,
  ...pluginVue.configs["flat/essential"],
  eslintConfigPrettier,
  {
    files: ["**/*.{js,jsx,cjs,mjs,vue,ts,tsx}"],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        extraFileExtensions: [".vue"],
        ecmaFeatures: {
          jsx: true,
        },
      },
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        __dirname: "readonly",
      },
    },
  },
];

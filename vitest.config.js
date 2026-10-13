import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import { playwright } from "@vitest/browser-playwright";

// Standalone on purpose: vite.config.js sets `base` and `build.lib`, neither of
// which is wanted when running tests.
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    include: ["tests/**/*.spec.js"],
    css: true, // SFC styles must apply for layout/cursor assertions
    browser: {
      enabled: true,
      provider: playwright(),
      headless: true,
      instances: [{ browser: "chromium" }],
      viewport: { width: 1024, height: 768 },
    },
  },
});

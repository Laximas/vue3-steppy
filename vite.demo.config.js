import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";

// Builds the demo app (src/App.vue) into dist-demo for GitHub Pages.
// The library build (vite.config.js) writes to dist and is what gets published.
export default defineConfig({
  base: "/vue3-steppy/",
  plugins: [vue(), cssInjectedByJsPlugin()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    outDir: "dist-demo",
    emptyOutDir: true,
  },
});

import { fileURLToPath, URL } from "node:url";

import { resolve } from "node:path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";

export default defineConfig({
  base: "/vue3-steppy/",
  plugins: [vue(), cssInjectedByJsPlugin()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    lib: {
      // eslint-disable-next-line no-undef
      entry: resolve(__dirname, "lib/main.js"),
      name: "vue3-steppy",
      fileName: "vue3-steppy",
    },
    rollupOptions: {
      external: ["vue"],
      output: {
        globals: {
          vue: "Vue",
        },
      },
    },
  },
});

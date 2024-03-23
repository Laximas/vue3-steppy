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
      entry: resolve(__dirname, "lib/main.js"),
      name: "vue3-steppy",
      fileName: (format) => `vue3-steppy.${format}.js`
    },
    rollupOptions: {
      external: ["vue"],
      output: [
        {
          format: "umd",
          name: "Vue3Steppy",
          globals: {
            vue: "Vue"
          },
        },
        {
          format: "es",
        },
        {
          format: "cjs",
          exports: "auto"
        }
      ]
    }
  },
});

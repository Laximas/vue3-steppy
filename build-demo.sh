#!/bin/bash
# Build demo HTML for GitHub Pages deployment
# This builds the Vue app as a static HTML demo

rm -rf dist-demo

# Create temporary vite config for demo build
cat > vite.demo.config.js << 'EOF'
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
    outDir: "dist-demo",
    emptyOutDir: true,
  },
});
EOF

# Build with demo config
npx vite build -c vite.demo.config.js

# Move demo build to dist
rm -rf dist
mv dist-demo dist

# Clean up
rm vite.demo.config.js


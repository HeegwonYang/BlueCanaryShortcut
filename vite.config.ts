import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        background: "./src/background.ts",
        popup: "./src/popup/popup.ts",
        content_script: "./src/content_script.ts"
      },
      output: {
        entryFileNames: `[name].js`,
      },
    },
  },
});
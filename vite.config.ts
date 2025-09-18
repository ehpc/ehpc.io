import { defineConfig } from "vite";
import wasm from "vite-plugin-wasm";

export default defineConfig({
  plugins: [
    wasm(),
  ],
  build: {
    rollupOptions: {
      output: {
        assetFileNames: "assets/[name].[hash:12][extname]",
        chunkFileNames: "assets/[name].[hash:12].js",
        entryFileNames: "assets/[name].[hash:12].js",
        hashCharacters: "base36",
      },
    },
  },
});

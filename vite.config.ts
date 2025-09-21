import { defineConfig } from "vite";
import wasm from "vite-plugin-wasm";
import pkg from "./package.json";

process.env.VITE_APP_VERSION = pkg.version;

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

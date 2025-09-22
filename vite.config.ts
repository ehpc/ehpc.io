import fs from "node:fs";
import { defineConfig } from "vite";
import wasm from "vite-plugin-wasm";
import pkg from "./package.json";

process.env.VITE_APP_VERSION = pkg.version;
const isDevWithCerts = fs.existsSync("./localhost+3.pem") && fs.existsSync("./localhost+3-key.pem");

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
  server: {
    allowedHosts: [
      "www.localhost.com", // browserstack local
    ],
    host: isDevWithCerts,
    port: 5173,
    https: isDevWithCerts
      ? {
        key: fs.readFileSync("./localhost+3-key.pem"),
        cert: fs.readFileSync("./localhost+3.pem"),
      }
      : undefined,
  },
});

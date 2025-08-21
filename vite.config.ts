import { defineConfig } from "vite";

export default defineConfig({
  build: {
    minify: false,
    modulePreload: {
      polyfill: false,
    },
  },
});

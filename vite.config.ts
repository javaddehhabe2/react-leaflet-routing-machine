import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

import path from "path-browserify";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  // root: "./src",
  // publicDir: "./public",
  plugins: [react()],
  
  server: {
    port: 3000, // or any port you like
  },
  resolve: {
    alias: {

      "@Container": path.resolve(__dirname, "src/Components/Container"),
      "@Map": path.resolve(__dirname, "src/Components/Map"),
      "@Store": path.resolve(__dirname, "src/Store"),
      "@Class": path.resolve(__dirname, "src/Classes"),
      "@LocalStorage": path.resolve(__dirname, "src/Storage"),
      "@Utility": path.resolve(__dirname, "src/Utils"),
      "@": path.resolve(__dirname, "src"),
    },
  },
});

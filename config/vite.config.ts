import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Get the project root directory
const projectRoot = path.resolve(__dirname, '..');

export default defineConfig({
  root: path.resolve(projectRoot, 'src'),
  plugins: [react()],
  css: {
    postcss: path.resolve(__dirname, "./postcss.config.js"),
  },
  resolve: {
    alias: {
      "@": path.resolve(projectRoot, "./src"),
    },
  },
  build: {
    outDir: path.resolve(projectRoot, 'dist'),
    emptyOutDir: true
  }
});

import path from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@emotion/styled": path.resolve(__dirname, "node_modules/@emotion/styled"),
      "@emotion/react": path.resolve(__dirname, "node_modules/@emotion/react"),
    },
  },
  optimizeDeps: {
    include: ["@emotion/react", "@emotion/styled", "@mui/material"],
  },
});

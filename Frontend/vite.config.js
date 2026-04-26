import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,          // 🔥 IMPORTANT
    port: 5173,
    strictPort: true,
    proxy: {
      "/auth": {
        target: "http://localhost:4000",
        changeOrigin: true,
      },
    },
  },
});
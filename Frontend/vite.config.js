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
      "/profile": {
        target: "http://localhost:4000",
        changeOrigin: true,
      },
      "/alumni": {
        target: "http://localhost:4000",
        changeOrigin: true,
      },
      "/admin": {
        target: "http://localhost:4000",
        changeOrigin: true,
      },
      "/event": {
        target: "http://localhost:4000",
        changeOrigin: true,
      },
      "/jobs": {
        target: "http://localhost:4000",
        changeOrigin: true,
      },
      "/bulk": {
        target: "http://localhost:4000",
        changeOrigin: true,
      },
      "/announcements": {
        target: "http://localhost:4000",
        changeOrigin: true,
      },
      "/recognition": {
        target: "http://localhost:4000",
        changeOrigin: true,
      },
      "/connections": {
        target: "http://localhost:4000",
        changeOrigin: true,
      },
      "/mentorship": {
        target: "http://localhost:4000",
        changeOrigin: true,
      },
      "/referrals": {
        target: "http://localhost:4000",
        changeOrigin: true,
      },
      "/community": {
        target: "http://localhost:4000",
        changeOrigin: true,
      },
      "/contributions": {
        target: "http://localhost:4000",
        changeOrigin: true,
      },
    },
  },
});

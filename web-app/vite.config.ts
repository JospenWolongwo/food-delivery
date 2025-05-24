import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables based on mode
  const env = loadEnv(mode, process.cwd(), "");
  const isProd = mode === "production";

  const server = !isProd
    ? {
        port: 5173,
        proxy: {
          "/api": {
            target: env.VITE_API_URL || "http://localhost:3000",
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, ""), // Remove /api prefix
          },
        },
      }
    : {};

  return {
    plugins: [react()],
    server,
    define: {
      "import.meta.env.VITE_API_URL": JSON.stringify(
        env.VITE_API_URL || "http://localhost:3000"
      ),
    },
    // Customize build process
    build: {
      // Ignore TypeScript errors during build
      typescript: {
        ignoreBuildErrors: true,
      },
      // Optimize chunk size
      chunkSizeWarningLimit: 1600,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ["react", "react-dom", "react-router-dom"],
            redux: ["@reduxjs/toolkit", "react-redux"],
            ui: ["gsap", "framer-motion", "react-spring"],
          },
        },
      },
    },
    // Optimize for production
    optimizeDeps: {
      include: ["react", "react-dom", "react-router-dom", "@reduxjs/toolkit"],
    },
  };
});

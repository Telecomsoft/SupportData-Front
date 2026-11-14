import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import svgr from 'vite-plugin-svgr';
import fs from 'fs';
import path from 'path';

const packageJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'package.json'), 'utf-8'));

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  optimizeDeps: {
    include: ['react-multi-date-picker','jalali-moment'],
  },
  server: {
    host: "0.0.0.0",
    // In production the API is on the same origin as the app (config.ts: endpointMode = productionEndpoint).
    // The dev server does the same: /api and the uploaded files go to the backend, so no CORS setup is needed.
    // Another backend: VITE_BACKEND_URL=http://host:port npm run dev
    proxy: {
      '/api': { target: process.env.VITE_BACKEND_URL ?? 'http://localhost:5276', changeOrigin: true },
      '/SupportFiles': { target: process.env.VITE_BACKEND_URL ?? 'http://localhost:5276', changeOrigin: true },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          mui: ['@mui/material', '@mui/icons-material'],
        }
      }
    }
  },
  plugins: [
    TanStackRouterVite(),
    react(),
    svgr({
      svgrOptions: {
        exportType: "default",
        ref: true,
        svgo: false,
        titleProp: true,
      },
      include: "**/*.svg",
    }),
    tsconfigPaths()
  ],
  define: {
    'process.env': {
      PACKAGE_NAME: JSON.stringify(packageJson.name),
      PACKAGE_VERSION: JSON.stringify(packageJson.version),
    },
  },
});

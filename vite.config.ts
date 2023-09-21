import reactRefresh from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import svgrPlugin from "vite-plugin-svgr";

export default defineConfig({
  build: {
    outDir: "build"
  },
  define: {
    "process.env": {}
  },
  server: {
    open: "/app",
    proxy: {
      "/api": {
        target: "http://localhost:3000/hidro/api",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "")
      }
    }
  },
  plugins: [
    reactRefresh(),
    svgrPlugin({
      svgrOptions: {
        icon: true
      }
    })
  ]
});

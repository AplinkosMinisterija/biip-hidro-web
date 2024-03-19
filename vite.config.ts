import reactRefresh from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import svgrPlugin from "vite-plugin-svgr";

export default () => {
  const env = loadEnv('all', process.cwd());

  return defineConfig({
    build: {
      outDir: "build"
    },
    define: {
      "process.env": {}
    },
    server: {
      open: env.VITE_APP_PATH,
      proxy: {
        "/api": {
          target: env.VITE_PROXY_URL,
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
}

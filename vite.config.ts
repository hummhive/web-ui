import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";

export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ["react", "react-dom"],
    alias: {
      crypto: "crypto-browserify",
    },
  },
  optimizeDeps: {
    include: ["lucide-react"],
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: "globalThis",
      },
      // Enable esbuild polyfill plugins
      plugins: [
        NodeGlobalsPolyfillPlugin({
          process: true,
          buffer: true,
        }),
      ],
    },
  },
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    open: true,
  },
  build: {
    sourcemap: true,
    chunkSizeWarningLimit: 1000,
    cssCodeSplit: true,
    minify: "esbuild",
  },
  // test: {
  //   globals: true,
  //   environment: "jsdom",
  //   setupFiles: [path.resolve(__dirname, "./tests/vitest.setup.ts")],
  //   include: ["tests/**/*.test.{ts,tsx}"],
  //   typecheck: {
  //     tsconfig: "./tsconfig.test.json",
  //   },
  // },
});

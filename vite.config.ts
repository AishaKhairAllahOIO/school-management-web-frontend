import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
//import tsconfigPaths from "vite-tsconfig-paths";

//export default defineConfig({plugins: [react(), tailwindcss(), tsconfigPaths()] });

import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    tsconfigPaths: true,
  },
});

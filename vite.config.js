import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Repo is served from https://alpfand.github.io/ALPFA-Office-Hours/
// If you move to a custom domain, change base to "/".
export default defineConfig({
  base: "/ALPFA-Office-Hours/",
  plugins: [react()],
});

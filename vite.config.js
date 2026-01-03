import { defineConfig } from "vite";

export default defineConfig(({ command }) => ({
  // Use relative asset paths when building so GitHub Pages can serve the app
  // from a subpath (e.g. https://<user>.github.io/<repo>/).
  base: command === "build" ? "./" : "/",
  root: "src",
  publicDir: "../public",
  build: {
    outDir: "../dist"
  }
}));

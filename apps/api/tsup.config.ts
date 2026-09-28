import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/app.ts"],
  format: ["cjs"],
  outDir: "dist",
  noExternal: [/.*/], 
  splitting: false,
  clean: true,
});
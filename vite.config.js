import { resolve } from "path";
import { defineConfig } from "vite";
import wasm from "vite-plugin-wasm";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/main.ts"),
      fileName: "spacells",
      formats: ["es"],
    },
  },
  plugins: [wasm(), dts({ rollupTypes: true })],
});

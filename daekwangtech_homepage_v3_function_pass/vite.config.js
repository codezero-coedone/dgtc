import { fileURLToPath } from "node:url";
import { cp } from "node:fs/promises";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const page = (file) => fileURLToPath(new URL(file, import.meta.url));
const assetDir = page("./assets");
const distAssetDir = page("./dist/assets");

function copyPublicAssets() {
  return {
    name: "copy-public-assets",
    closeBundle: async () => {
      await cp(assetDir, distAssetDir, { recursive: true });
    },
  };
}

export default defineConfig({
  plugins: [react(), copyPublicAssets()],
  build: {
    rollupOptions: {
      input: {
        index: page("./index.html"),
      },
    },
  },
});

import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const page = (file) => fileURLToPath(new URL(file, import.meta.url));

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        index: page("./index.html"),
        technology: page("./technology.html"),
        products: page("./products.html"),
        process: page("./process.html"),
        quality: page("./quality.html"),
        facility: page("./facility.html"),
        company: page("./company.html"),
        notFound: page("./404.html"),
      },
    },
  },
});

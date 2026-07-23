import { defineConfig } from "vite";
import htmlInject from "vite-plugin-html-inject";
import fg from "fast-glob";
import path from "node:path";

const inputs = Object.fromEntries(
  fg.sync(["**/*.html", "!dist/**", "!node_modules/**"]).map(file => [
    path.relative(".", file).replace(/\.html$/, ""),
    path.resolve(file)
  ])
);

export default defineConfig({
  plugins: [
    htmlInject()
  ],

  build: {
    rollupOptions: {
      input: inputs
    }
  }
});

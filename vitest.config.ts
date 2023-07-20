import { fileURLToPath } from "node:url";
import { mergeConfig } from "vite";
import { configDefaults, defineConfig } from "vitest/config";
import viteConfig from "./vite.config";
import path from "path";

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: "jsdom",
      exclude: [...configDefaults.exclude, "e2e/*"],
      root: fileURLToPath(new URL("./", import.meta.url)),
      setupFiles: [path.resolve("src", "tests", "setup.ts")],
      globals: true,
      deps: {
        inline: ["vuetify"],
      },
      transformMode: {
        web: [/\.[jt]sx$/],
      },
    },
  }),
);

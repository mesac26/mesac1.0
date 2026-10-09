import { defineConfig, type Plugin } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { nitro } from "nitro/vite";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

interface RollupWarningLike {
  code?: string;
  message?: string;
  [key: string]: unknown;
}

type RollupWarnHandler = (warning: RollupWarningLike) => void;

export default defineConfig(({ command }) => ({
  plugins: [
    tailwindcss(),
    tsConfigPaths({ projects: ["./tsconfig.json"] }),
    tanstackStart({
      server: { entry: "server" },
    }),
    command === "build"
      ? (nitro({
          preset: "cloudflare-module",
          output: {
            dir: ".output",
            serverDir: ".output/server",
            publicDir: ".output/public",
          },
          cloudflare: {
            nodeCompat: true,
            deployConfig: true,
          },
          hooks: {
            "rollup:before"(
              _nitro: unknown,
              config: { onwarn?: (warning: RollupWarningLike, warn: RollupWarnHandler) => void },
            ) {
              const originalOnwarn = config.onwarn;
              config.onwarn = (warning: RollupWarningLike, warn: RollupWarnHandler) => {
                if (
                  warning?.code === "MODULE_LEVEL_DIRECTIVE" ||
                  warning?.message?.includes("MODULE_LEVEL_DIRECTIVE") ||
                  warning?.message?.includes("use client")
                ) {
                  return;
                }
                if (originalOnwarn) {
                  originalOnwarn(warning, warn);
                } else if (warn) {
                  warn(warning);
                }
              };
            },
          },
        }) as unknown as Plugin)
      : null,
    viteReact(),
  ].filter(Boolean) as Plugin[],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "@tanstack/react-query",
      "@tanstack/query-core",
    ],
  },
  server: {
    host: "0.0.0.0",
    port: 3000,
    strictPort: true,
  },
  build: {
    rollupOptions: {
      onwarn(warning, defaultHandler) {
        if (
          warning.code === "MODULE_LEVEL_DIRECTIVE" ||
          warning.message?.includes("MODULE_LEVEL_DIRECTIVE") ||
          warning.message?.includes("use client")
        ) {
          return;
        }
        defaultHandler(warning);
      },
    },
  },
}));

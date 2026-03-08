import { nestJsConfig } from "@repo/eslint-config/nest-js";
import { nextJsConfig } from "@repo/eslint-config/next-js";
import { libraryConfig } from "@repo/eslint-config/library";

function scopeConfigs(configs, files) {
  return configs.map((config) => ({
    ...config,
    files,
  }));
}

export default [
  {
    ignores: [
      "**/dist/**",
      "**/node_modules/**",
      "**/.next/**",
      "**/.turbo/**",
      "**/coverage/**",
    ],
  },
  ...scopeConfigs(nestJsConfig, [
    "apps/api/**/*.ts",
    "packages/ai/**/*.ts",
    "packages/db/**/*.ts",
    "packages/queue/**/*.ts",
    "packages/types/**/*.ts",
  ]),
  ...scopeConfigs(nextJsConfig, ["apps/web/**/*.{js,jsx,ts,tsx}"]),
  ...scopeConfigs(libraryConfig, [
    "packages/crypto/**/*.ts",
    "packages/jest-config/**/*.ts",
  ]),
];

import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["**/*.{ts,tsx,mts}"],
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@next/next/no-async-client-component": "error",
      "react-hooks/exhaustive-deps": "error",
    },
  },
  {
    files: ["packages/**/*.{ts,tsx,mts}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/features/**"],
              message:
                "HR-IMP-01: packages 레이어는 features 레이어를 import 할 수 없습니다.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["features/common/**/*.{ts,tsx,mts}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "@/features/*",
                "@/features/*/**",
                "!@/features/common",
                "!@/features/common/**",
              ],
              message:
                "HR-IMP-02: features/common 레이어는 common 외 다른 features 레이어를 import 할 수 없습니다.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["**/hooks/queries.{ts,tsx,mts}"],
    rules: {
      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: "variable",
          modifiers: ["const", "exported"],
          format: ["camelCase"],
          custom: {
            regex: "^use[A-Z].*Query$",
            match: true,
          },
        },
      ],
    },
  },
  {
    files: ["**/hooks/mutations.{ts,tsx,mts}"],
    rules: {
      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: "variable",
          modifiers: ["const", "exported"],
          format: ["camelCase"],
          custom: {
            regex: "^use[A-Z].*Mutation$",
            match: true,
          },
        },
      ],
    },
  },
  {
    files: ["features/**/store/**/*.{ts,tsx,mts}"],
    rules: {
      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: "variable",
          modifiers: ["const", "exported"],
          format: ["camelCase"],
          custom: {
            regex: "^use(Set[A-Z].*|[A-Z].*Value)$",
            match: true,
          },
        },
      ],
    },
  },
  {
    files: ["app/**/page.{ts,tsx,mts}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/features/**/service", "@/features/**/service.ts"],
              message:
                "HR-IMP-03: app 레이어에서는 feature service import를 금지합니다. 필요한 경우 EX-01 예외 승인을 받으세요.",
            },
          ],
        },
      ],
      "no-restricted-syntax": [
        "error",
        {
          selector: "Program > ExpressionStatement[directive='use client']",
          message:
            "HR-REACT-04: `app/*/page.tsx`에는 `use client`를 붙이지 않습니다. 클라이언트 경계는 feature component로 내리세요.",
        },
      ],
    },
  },
  {
    files: ["**/service.{ts,tsx,mts}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "@tanstack/react-query",
              message:
                "HR-RQ-02: service.ts는 순수 API 레이어여야 하며 React Query를 import할 수 없습니다.",
            },
          ],
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "public/mockServiceWorker.js",
  ]),
]);

export default eslintConfig;

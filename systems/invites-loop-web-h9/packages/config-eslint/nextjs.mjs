import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export const createNextJsConfig = ({ ignores = [], rules = {} } = {}) => {
  return defineConfig([
    ...nextVitals,
    ...nextTs,
    {
      rules,
    },
    globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts", ...ignores]),
  ]);
};

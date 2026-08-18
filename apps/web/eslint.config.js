// eslint.config.js – flat config for Next.js 14
import next from "@next/eslint-plugin-next";

export default [
  {
    ignores: [".next/**", "node_modules/**", ".turbo/**", "dist/**"]
  },
  next.configs.recommended,
];

import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    setupFiles: ["test/setup.ts"],
    // Include all .test.tsx files
    include: ["**/*.test.{ts,tsx}"],
  },
});

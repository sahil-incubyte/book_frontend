import type { Config } from "jest";
import nextJest from "next/jest.js";

// next/jest wires up the SWC transform, CSS/font/image mocking, and .env loading.
const createJestConfig = nextJest({
  dir: "./",
});

const config: Config = {
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  // Match the "@/*" path alias from tsconfig.json.
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
};

// Exported as a function call so next/jest can load the (async) Next.js config.
export default createJestConfig(config);

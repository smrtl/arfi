import nextJest from "next/jest.js";

const createJestConfig = nextJest({ dir: "./" });

export default createJestConfig({
  injectGlobals: false,

  testMatch: ["**/*.[jt]s"],
  roots: ["tests"],

  moduleNameMapper: {
    "^@/components/(.*)$": "<rootDir>/components/$1",
    "^@/pages/(.*)$": "<rootDir>/pages/$1",
    "^@/lib/(.*)$": "<rootDir>/lib/$1",
  },
});

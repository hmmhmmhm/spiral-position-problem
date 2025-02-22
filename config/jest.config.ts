import type { Config } from "@jest/types";

/**
 * Jest configuration object.
 *
 * - `preset`: Specifies the preset configuration, here using "ts-jest" to handle TypeScript files.
 * - `testEnvironment`: Defines the environment in which tests will be run, set to "node".
 * - `roots`: An array that defines the root directories for Jest to scan for tests and modules.
 * - `transform`: Maps regular expressions to transformer configurations, using "ts-jest" to process TypeScript files.
 * - `transformIgnorePatterns`: An array of regex patterns that are matched against all source file paths,
 *   matched files will be ignored by the transform step.
 * - `testRegex`: A regex pattern string used to find test files.
 * - `moduleFileExtensions`: Extensions that Jest will recognize and process.
 * - `moduleNameMapper`: A map from regular expressions to module names or to arrays of module names
 *   that allow stub out resources with a single module.
 */
const config: Config.InitialOptions = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        useESM: true,
      },
    ],
  },
  transformIgnorePatterns: ["node_modules/(?!(mugunghwa)/)"],
  testRegex: ".*\\.test\\.tsx?$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
};

export default config;

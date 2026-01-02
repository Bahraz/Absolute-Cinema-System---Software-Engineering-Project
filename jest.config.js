/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",

  testMatch: ["**/tests/**/*.test.ts"],
  
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.test.json",
    },
  },

  moduleNameMapper: {
    "^@routes/(.*)$": "<rootDir>/src/routes/$1",
    "^@controllers/(.*)$": "<rootDir>/src/controllers/$1",
    "^@models/(.*)$": "<rootDir>/src/models/$1",
    "^@config/(.*)$": "<rootDir>/src/config/$1",
    "^@services/(.*)$": "<rootDir>/src/services/$1",
    "^@repositories/(.*)$": "<rootDir>/src/repositories/$1",
    "^@middlewares/(.*)$": "<rootDir>/src/middleware/$1",
    "^@utils/(.*)$": "<rootDir>/src/utils/$1",
  },

  clearMocks: true,
  verbose: true,
};

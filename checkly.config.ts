import { defineConfig } from "checkly";

export default defineConfig({
  projectName: "Yummy",
  logicalId: "yummy-next",
  repoUrl: "https://github.com/yummy-recipes/yummy-next",
  checks: {
    frequency: 10,
    locations: ["eu-west-1"],
    tags: ["production"],
    checkMatch: "__checks__/**/*.check.ts",
    browserChecks: {
      testMatch: "__checks__/**/*.spec.ts",
    },
  },
  cli: {
    runLocation: "eu-west-1",
  },
});

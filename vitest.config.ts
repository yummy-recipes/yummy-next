import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Checkly's Playwright-based checks live under __checks__ and are run by
    // the Checkly CLI, not Vitest. Playwright's test() cannot be called
    // outside its own runner, so this directory must stay out of Vitest's
    // default *.spec.ts matching.
    exclude: ["**/node_modules/**", "__checks__/**"],
  },
});

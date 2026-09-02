import { BrowserCheck } from "checkly/constructs";

new BrowserCheck("homepage-loads", {
  name: "Homepage loads",
  code: {
    entrypoint: "./homepage.spec.ts",
  },
});

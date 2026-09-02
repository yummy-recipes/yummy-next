import { BrowserCheck, CheckGroupV2, Frequency } from "checkly/constructs";

const yummyGroup = new CheckGroupV2("yummy-group", {
  name: "Yummy",
  locations: ["eu-west-1"],
  tags: ["production"],
});

new BrowserCheck("homepage-loads", {
  name: "Homepage loads",
  frequency: Frequency.EVERY_12H,
  group: yummyGroup,
  code: {
    entrypoint: "./homepage.spec.ts",
  },
});

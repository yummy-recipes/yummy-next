import { defineMain } from "@storybook/nextjs/node";

export default defineMain({
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],

  addons: [
    "@storybook/addon-links",
    "@storybook/addon-onboarding",
    "@chromatic-com/storybook",
    "@storybook/addon-docs",
  ],

  framework: {
    name: "@storybook/nextjs",
    options: {
      builder: {
        useSWC: true,
      },
      nextConfigPath: "../next.config.js",
    },
  },

  features: {
    experimentalRSC: true,
  },

  docs: {},

  typescript: {
    reactDocgen: "react-docgen-typescript",
  },
});

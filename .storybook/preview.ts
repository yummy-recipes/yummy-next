import addonDocs from "@storybook/addon-docs";
import addonLinks from "@storybook/addon-links";
import { definePreview } from "@storybook/nextjs";

// import { withThemeByClassName } from "@storybook/addon-styling";

import "../src/app/globals.css";

export default definePreview({
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },

  addons: [addonLinks(), addonDocs()],

  decorators: [
    // Adds theme switching support.
    // NOTE: requires setting "darkMode" to "class" in your tailwind config
    // withThemeByClassName({
    //   themes: {
    //     light: "light",
    //     dark: "dark",
    //   },
    //   defaultTheme: "light",
    // }),
  ],
});

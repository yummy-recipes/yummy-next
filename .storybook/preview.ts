import type { Preview } from "@storybook/nextjs";

// import { withThemeByClassName } from "@storybook/addon-styling";

import "../src/app/globals.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },

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

  // Enable experimental features for CSF next format
  experimental_indexingApi: true,
};

export default preview;

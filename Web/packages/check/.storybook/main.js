const path = require("path");

const toPath = (_path) => path.join(process.cwd(), _path);

module.exports = {
  core: {
    builder: "webpack5",
  },
  stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: ["@storybook/addon-links", "@storybook/addon-essentials"],
  webpackFinal: async (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@emotion/core": toPath("node_modules/@emotion/react"),
      "emotion-theming": toPath("node_modules/@emotion/react"),
    };
    return config;
  },
};

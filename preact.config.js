const path = require("path");
const webpack = require("webpack");
const Dotenv = require("dotenv-webpack");

export default {
  webpack(config, env, helpers, options) {
    config.resolve.alias.src = path.resolve(__dirname, "src/");
    config.resolve.alias["@test-src"] = path.resolve(__dirname, "src/");

    config.plugins.push(
      new Dotenv({ silent: true, systemvars: true, ignoreStub: true }),
    );

    if (process.env.PROD) {
      config.devtool = false;
    }

    if (config.performance) {
      config.performance.hints = false;
    }
  },
};

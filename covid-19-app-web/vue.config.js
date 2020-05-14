const CompressionPlugin = require("compression-webpack-plugin");

module.exports = {
  configureWebpack: {
    plugins: [new CompressionPlugin()],
    resolve: {
      alias: {
        moment: "moment/src/moment"
      }
    }
  },
  pluginOptions: {
    webpackBundleAnalyzer: {
      openAnalyzer: false
    }
  }
};

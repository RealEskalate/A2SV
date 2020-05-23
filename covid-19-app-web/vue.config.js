const CompressionPlugin = require("compression-webpack-plugin");

module.exports = {
  chainWebpack(config) {
    config.plugins.delete('prefetch');
    config.plugin('CompressionPlugin').use(CompressionPlugin);
  },
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

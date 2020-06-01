const CompressionPlugin = require("compression-webpack-plugin");

module.exports = {
  runtimeCompiler: true,

  chainWebpack(config) {
    config.plugins.delete("prefetch");
    config.plugin("CompressionPlugin").use(CompressionPlugin);
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
    },
    i18n: {
      locale: "en",
      fallbackLocale: "en",
      localeDir: "locales",
      enableInSFC: true
    }
  }
};

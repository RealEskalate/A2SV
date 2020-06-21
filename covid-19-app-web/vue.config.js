const CompressionPlugin = require("compression-webpack-plugin");
const webpack = require("webpack");

const path = require("path");
const PrerenderSpaPlugin = require("prerender-spa-plugin");

const productionPlugins = [
  new PrerenderSpaPlugin({
    staticDir: path.join(__dirname, "dist"),
    routes: [
      "/",
      "/en",
      "/en/about",
      "/en/news",
      "/en/map",
      "/en/information",
      "/am",
      "/am/about",
      "/am/news",
      "/am/map",
      "/am/information",
      "/ao",
      "/ao/about",
      "/ao/news",
      "/ao/map",
      "/ao/information"
    ],
    renderer: new PrerenderSpaPlugin.PuppeteerRenderer({
      // We need to inject a value so we're able to
      // detect if the page is currently pre-rendered.
      inject: {},
      // Our view component is rendered after the API
      // request has fetched all the necessary data,
      // so we create a snapshot of the page after the
      // `data-view` attribute exists in the DOM.
      maxConcurrentRoutes: 1
    })
  })
];

module.exports = {
  runtimeCompiler: true,

  chainWebpack(config) {
    config.plugins.delete("prefetch");
    config.plugin("CompressionPlugin").use(CompressionPlugin);
    if (process.env.NODE_ENV === "production") {
      config.plugin("prerender").use(...productionPlugins);
    }
  },
  configureWebpack: {
    plugins: [
      new CompressionPlugin(),
      new webpack.ProvidePlugin({
        mapboxgl: "mapbox-gl"
      })
    ],
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

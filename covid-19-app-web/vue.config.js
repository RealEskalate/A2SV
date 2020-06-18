const CompressionPlugin = require("compression-webpack-plugin");
const webpack = require("webpack");
const path = require("path");
const PrerenderSPAPlugin = require("prerender-spa-plugin");

module.exports = {
  runtimeCompiler: true,

  chainWebpack(config) {
    config.plugins.delete("prefetch");
    config.plugin("CompressionPlugin").use(CompressionPlugin);
  },
  configureWebpack: {
    plugins: [
      new PrerenderSPAPlugin({
        staticDir: path.join(__dirname, "dist"),
        outputDir: path.join(__dirname, "dist"),
        indexPath: path.join(__dirname, "dist", "/index.html"),
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
        postProcess: route => {
          // Defer scripts and tell Vue it's been server rendered to trigger hydration
          route.html = route.html
            .replace(/<script (.*?)>/g, "<script $1 defer>")
            .replace('id="app"', 'id="app" data-server-rendered="true"');
          return route;
        },
        renderer: new PrerenderSPAPlugin.PuppeteerRenderer({
          renderAfterTime: 5000
        })
      }),
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

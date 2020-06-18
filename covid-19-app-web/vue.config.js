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
    prerenderSpa: {
      registry: undefined,
      staticDir: path.join(__dirname, "dist"),
      outputDir: path.join(__dirname, "dist"),
      renderRoutes: [
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
      useRenderEvent: true,
      headless: true,
      onlyProduction: true,
      customRendererConfig: {
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--auto-open-devtools-for-tabs"
        ]
      },
      postProcess: route => {
        // Defer scripts and tell Vue it's been server rendered to trigger hydration
        route.html = route.html
            .replace(/<script (.*?)>/g, "<script $1 defer>")
            .replace('id="app"', 'id="app" data-server-rendered="true"');
        return route;
      }
    },
    i18n: {
      locale: "en",
      fallbackLocale: "en",
      localeDir: "locales",
      enableInSFC: true
    }
  }
};

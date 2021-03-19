const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;

module.exports = {
  chainWebpack: config => {
    config.plugin("html").tap(args => {
      args[0].title = "Daily";
      return args;
    });
  },
  transpileDependencies: ["vuetify"],
  configureWebpack: {
    plugins: [new BundleAnalyzerPlugin()],
    performance: {
      hints: false
    },
    resolve: {
      alias: {
        moment: "moment/src/moment"
      }
    }
  }
};

module.exports = {
  chainWebpack: config => {
    config.plugin("html").tap(args => {
      args[0].title = "Daily";
      return args;
    });
  },
  transpileDependencies: ["vuetify"]
};

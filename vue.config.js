module.exports = {
  publicPath: '/works/vue/table',
  css: {
    loaderOptions: {
      sass: {
        prependData: '@import "@/assets/styles/variables.scss";',
      },
    },
  },
};

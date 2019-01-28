const path = require('path');

function resolve(dir) {
  return path.join(__dirname, dir);
}
module.exports = {
  lintOnSave: true,

  chainWebpack: (config) => {
    config.resolve.alias
      .set('@', resolve('src'));
  },

  devServer: {
    proxy: 'http://jw.tt/',
  },

  css: {
    loaderOptions: {
      stylus: {
        'resolve url': true,
        import: [
          './src/theme',
        ],
      },
    },
  },

  pluginOptions: {
    'cube-ui': {
      postCompile: true,
      theme: true,
    },
  },
};

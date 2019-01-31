const path = require('path');
const HappyPack = require('happypack');
const os = require('os');

const happyThreadPool = HappyPack.ThreadPool({
  size: os.cpus().length,
});

function resolve(dir) {
  return path.join(__dirname, dir);
}
module.exports = {
  lintOnSave: true,
  configureWebpack: {
    module: {
      rules: [{
        test: /\.js$/,
        // 把对.js 的文件处理交给id为happyBabel 的HappyPack 的实例执行
        loader: 'happypack/loader?id=happyBabel',
        // 排除node_modules 目录下的文件
        exclude: /node_modules/,
      }],
    },
    plugins: [
      new HappyPack({
        // 用id来标识 happypack处理那里类文件
        id: 'happyBabel',
        // 如何处理  用法和loader 的配置一样
        loaders: [{
          loader: 'babel-loader?cacheDirectory=true',
        }],
        // 共享进程池
        threadPool: happyThreadPool,
        // 允许 HappyPack 输出日志
        verbose: true,
      }),
    ],
  },

  chainWebpack: (config) => {
    config.resolve.alias
      .set('@', resolve('src'));
  },

  devServer: {
    proxy: {
      '/api': {
        target: 'http://jw.tt',
        ws: true,
        changeOrigin: true,
      },
    },
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

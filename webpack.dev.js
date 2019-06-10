const webpack = require('webpack');
const merge = require('webpack-merge')
const common = require('./webpack.common.js')
const hotModuleReplace = new webpack.HotModuleReplacementPlugin();

module.exports = merge(common, {
 'devServer': {
    'hot': true,
    'open': true,
    'openPage': 'login',
    'host': '0.0.0.0',
    'port': 9000,
    'proxy': {
      '/api': 'http://localhost:8080',
      '*': {
        pathRewrite () {
          return './html/index.html'
        },
        'target': 'http://0.0.0.0:9000'
      }
    },
    'publicPath': 'http://0.0.0.0:9000'

  },
  'devtool': 'inline-source-map',
  'plugins': [hotModuleReplace]
})

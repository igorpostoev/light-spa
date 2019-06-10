const path = require('path');
const webpack = require('webpack');
const staticPath = path.resolve(__dirname, './static');
const src = path.resolve(__dirname, './src');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const includeBundles = new HtmlWebpackPlugin({
  'filename': path.resolve(staticPath, 'html/index.html'),
  'template': path.resolve(src, 'html/index.html')
});

const commonsChunk = new webpack.optimize.CommonsChunkPlugin({
  'filename': 'js/commons_[hash].js',
  'name': 'commons'
});
const extSass = new ExtractTextPlugin({'filename': 'css/[name]_[hash].css'});
const extCss = new ExtractTextPlugin({'filename': 'css/[name]_[hash].css'});
const cleanUp = new CleanWebpackPlugin([path.resolve(staticPath)], {
  'dry': false,
  'verbose': true
});

const compressAssets = new CompressionPlugin({
  'algorithm': 'gzip',
  'asset': '[path].gz',
  'minRatio': 0.8,
  'test': /\.js$|\.css$/,
  'threshold': 10240
});


module.exports = {
  'entry': {index: path.resolve(src, 'js/index.js')},

  'module': {
    'rules': [
      {
        'test': /\.vue$/,
        'use': 'vue-loader'
      },
      {
        'test': /\.(js|jsx)$/,
        'use': 'babel-loader'
      },
      {
        'test': /\.html$/,
        'use': 'html-loader'
      },
      {
        'test': /\.(png|svg|ico|jpg)$/,
        'use': 'file-loader?name=images/[name].[ext]'
      },
      {
        'test': /\.(eot|otf|ttf|woff2?)$/,
        'use': 'file-loader?name=fonts/[name].[ext]'
      },
      {
        'test': /\.(eot|otf|ttf|woff2?)\?/,
        'use': 'url-loader?name=images/[name].[ext]'
      },
      {
        'test': /\.(scss|sass)$/,
        'use': extSass.extract({
          'fallback': 'style-loader',
          'use': 'css-loader!sass-loader'
        })
      },
      {
        'test': /\.css$/,
        'use': extCss.extract({
          'fallback': 'style-loader',
          'use': 'css-loader'
        })
      }
    ]
  },

  'output': {
    'filename': 'js/[name]_[hash].js',
    'path': staticPath
  },

  'plugins': [
    includeBundles,
    commonsChunk,
    extSass,
    cleanUp,
    compressAssets,
    extCss
  ],

  'resolve': {'alias': {'vue': 'vue/dist/vue.js'}}
}

const merge = require('webpack-merge')
const dev = require('./webpack.dev.js')
const prod = require('./webpack.prod.js')
const ENV = process.env.NODE_ENV

if (ENV === 'development') {
  module.exports = merge(dev)
} else {
  module.exports = merge(prod)
}

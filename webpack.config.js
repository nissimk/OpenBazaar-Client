var path = require('path');
var ContextReplacementPlugin = require("webpack/lib/ContextReplacementPlugin");

module.exports = {
  entry: './js/main.js',
  module: {
    loaders: [
      { test: /\.png$/, loader: "file" },
      { test: /\.json$/, loader: "json" },
      { test: /is_js/, loader: "imports?define=>undefined" },
      { 
        test: /\.html$/, 
        loader: "underscore-template-loader", 
        query: { root: '../../', variable: 'ob' },
        include: [ path.resolve(__dirname, "js/templates") ],
      },
    ]
  },
  externals: {
    'ipc-renderer': 'ipcrenderer',
    'screen': 'screen',
    'shell': 'shell',
    'remote': 'remote',
    'fs': 'fs',
    'clipboard': 'clipboard'
  },
  output: {
    path: 'build',
    filename: 'bundle.js',
  },
  devtool: "source-map",
};

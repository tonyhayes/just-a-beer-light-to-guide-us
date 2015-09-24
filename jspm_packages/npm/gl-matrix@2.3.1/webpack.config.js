/* */ 
var fs = require("fs");
var webpack = require("webpack");
var entryFile = './src/gl-matrix.js';
var header = '';
var mainFile = fs.readFileSync(entryFile, {encoding: 'utf8'});
if (mainFile) {
  var headerIndex = mainFile.indexOf('\/\/ END HEADER');
  if (headerIndex >= 0) {
    header = mainFile.substr(0, headerIndex);
  }
}
module.exports = {
  entry: entryFile,
  output: {
    path: __dirname + '/dist',
    filename: 'gl-matrix-min.js',
    libraryTarget: 'umd'
  },
  plugins: [new webpack.optimize.UglifyJsPlugin(), new webpack.BannerPlugin(header, {raw: true})]
};

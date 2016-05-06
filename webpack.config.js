const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const NpmInstallPlugin = require('npm-install-webpack-plugin');
const TARGET = process.env.npm_lifecycle_event;

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const pkg = require('./package.json');

const PATHS = {
  app: path.join(__dirname, 'app'),
  build: path.join(__dirname, 'build')
};

process.env.BABEL_ENV = TARGET;

const common = {
  entry: {
    app: PATHS.app
  },
  // Add resolve.extensions
  // '' is needed to allow imports without an extension
  // note the .'s before the extension as it will fail to load without them
  resolve: {
    extensions: ['', '.js', '.jsx', '.json']
  },
  output: {
    path: PATHS.build,
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        // Test expects a RegExp! Notethe slashes!
        test: /\.css$/,
        loaders: ['style', 'css'],
        //Include accepts either a path or an array of paths
        include: PATHS.app

      },
      //set up JSX. This accepts js too thanks to RegExp
      {
      test: /\.(js|jsx)$/,
      //enable caching for improved performance during development
      //It uses default OS directory by default. If you need something more custom,
      //pass a path to it. ie: babel?cacheDirectory=<path>
      loaders: [
        'babel?cacheDirectory,presets[]=es2015'
    ],
      //parse only app files Without this it will go thru the entire project.
      //beside being slow this will likely result in an error
      include: PATHS.app
      }
    ]
  }
};

// Default configuration. We will return this if
// Webpack is called outside of npm.
if(TARGET === 'start' || !TARGET){
  module.exports = merge(common, {
    devtool: 'eval-source-map',
    devServer: {
      contentBase: PATHS.build,

      //enable history API fallback so HTML5 HISTORY API based
      // routing works. This is a good default that will come in handy in more
      // complicated setups.
      historyApiFallback: true,
      hot: true,
      inline: true,
      progress: true,

      //display only errors to reduce output amount
      stats: 'errors only',

      //Parse host and port from env so this is easy to customize
      host: process.env.HOST,
      port: process.env.PORT

},

plugins: [
  new webpack.HotModuleReplacementPlugin(),
  new NpmInstallPlugin({
    save: true //--save
  })
]
});
}

if(TARGET === 'build' || TARGET === 'stats') {
  module.exports = merge(common, {
    entry: {
      vendor: Object.keys(pkg.dependencies).filter(function(v) {
        return v !== 'alt-utils';
      }),
      style: PATHS.style
    },
    output: {
      path: PATHS.build,
      // Output using entry name
      filename: '[name].[chunkhash].js',
      chunkFilename: '[chunkhash].js'
    },
    module: {
      loaders: [
        // Extract CSS during build
        {
          test: /\.css$/,
          loader: ExtractTextPlugin.extract('style', 'css'),
          include: PATHS.app
        }
      ]
    },
    plugins: [
      // Output extracted CSS to a file
      new ExtractTextPlugin('[name].[chunkhash].css'),
      // Extract vendor and manifest files
      new webpack.optimize.CommonsChunkPlugin({
        names: ['vendor', 'manifest']
      }),
      // Setting DefinePlugin affects React library size!
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': '"production"'
      }),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      })
    ]
  });
}

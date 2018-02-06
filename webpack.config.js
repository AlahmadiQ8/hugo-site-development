const webpack = require('webpack')
const {
  createConfig,
  match,

  // Feature blocks
  babel,
  sass,
  extractText,
  devServer,
  file,
  postcss,
  uglify,

  // Shorthand setters
  addPlugins,
  setEnv,
  entryPoint,
  env,
  setOutput,
  sourceMaps
} = require('webpack-blocks')

const path = require('path')
const autoprefixer = require('autoprefixer')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');


module.exports = createConfig([
  entryPoint('./src/js/index.js'),
  setOutput('./build/bundle.js'),
  babel(),
  match('*.scss', { exclude: path.resolve('node_modules') }, [
    sass(),
    postcss({
      plugins: [
        autoprefixer({ browsers: ['last 2 versions'] })
      ],
    }),
    // extractText(),
    env('production', [extractText()])
  ]),
  match(['*.gif', '*.jpg', '*.jpeg', '*.png', '*.webp', '*.svg'], [
    file()
  ]),
  setEnv({
    NODE_ENV: process.env.NODE_ENV
  }),
  addPlugins([
    new HtmlWebpackPlugin({
      inject: true,
      template: './index.html'
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      Tether: 'tether',
      Popper: 'popper.js',
    }),
    new CopyWebpackPlugin([{
      from: './src/assets',
      to: path.resolve(__dirname, 'build/assets')
    }])
  ]),
  env('development', [
    devServer(),
    // devServer.proxy({
    //   '/api': { target: 'http://localhost:3000' }
    // }),
    sourceMaps()
  ]),
  env('production', [
    uglify(),
    addPlugins([
      new webpack.LoaderOptionsPlugin({ minimize: true })
    ])
  ])
])

const webpack = require('webpack');
const path = require('path');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

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
  sourceMaps,

  // helpers
  // when,
  group,
} = require('webpack-blocks');

function when(condition, configSetters) {
  if (condition) {
    return group(configSetters);
  } else {
    return () => config => config;
  }
}

module.exports = createConfig([
  entryPoint('./src/js/index.js'),
  setOutput({
    filename: 'js/[name].js',
    path: path.resolve(__dirname, 'build'),
  }),
  babel(),
  match('*.scss', { exclude: path.resolve('node_modules') }, [
    sass(),
    postcss({
      plugins: [autoprefixer({ browsers: ['last 2 versions'] })],
    }),
    when(
      process.env.npm_lifecycle_event.match(/^dev/) ||
        process.env.NODE_ENV === 'production',
      [extractText('css/main.css')]
    ),
    // env('production', [extractText()])
  ]),
  match(['*.gif', '*.jpg', '*.jpeg', '*.png', '*.webp', '*.svg'], [file()]),
  setEnv({
    NODE_ENV: process.env.NODE_ENV,
  }),
  addPlugins([
    new HtmlWebpackPlugin({
      inject: true,
      template: './index.html',
    }),
    new HtmlWebpackPlugin({
      inject: true,
      template: './single.html',
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      Tether: 'tether',
      Popper: 'popper.js',
    }),
    new CopyWebpackPlugin([
      {
        from: './src/assets',
        to: path.resolve(__dirname, 'build/assets'),
      },
    ]),
  ]),
  when(process.env.npm_lifecycle_event === 'start', [
    devServer(),
    sourceMaps(),
  ]),
  env('production', [
    uglify(),
    addPlugins([new webpack.LoaderOptionsPlugin({ minimize: true })]),
  ]),
]);

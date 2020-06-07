"use strict";

process.env.BABEL_ENV = "main";

const path = require("path");
const { dependencies } = require("../package.json");
const webpack = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MinifyPlugin = require("babel-minify-webpack-plugin");

let mainConfig = {
  entry: {
    main: path.join(__dirname, "../src/main/index.js"),
  },
  externals: [...Object.keys(dependencies || {})],
  module: {
    rules: [
      {
        test: /\.js$/,
        use: "babel-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.node$/,
        use: "node-loader",
      },
    ],
  },
  node: {
    __dirname: process.env.NODE_ENV !== "production",
    __filename: process.env.NODE_ENV !== "production",
  },
  output: {
    filename: "[name].js",
    libraryTarget: "commonjs2",
    path: path.join(__dirname, "../dist/electron"),
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new HtmlWebpackPlugin({
      inject:false,
      filename: 'loading.html',
      template: path.resolve(__dirname, '../src/loading.ejs'),
      minify: {
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        removeComments: true
      }
    }),],
  resolve: {
    alias: {
      "@": path.join(__dirname, "../src/renderer"),
    },
    extensions: [".js", ".vue", ".json", ".css", ".node"],
  },
  target: "electron-main",
};

/**
 * Adjust mainConfig for development settings
 */
if (process.env.NODE_ENV !== "production") {
  mainConfig.plugins.push(
    new webpack.DefinePlugin({
      __static: `"${path.join(__dirname, "../static").replace(/\\/g, "\\\\")}"`,
    })
  );
}

/**
 * Adjust mainConfig for production settings
 */
if (process.env.NODE_ENV === "production") {
  mainConfig.plugins.push(
    new MinifyPlugin(),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": '"production"',
    })
  );
}

module.exports = mainConfig;

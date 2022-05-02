const path = require("path");
const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const TerserPlugin = require("terser-webpack-plugin-legacy");

let distDir = path.resolve(__dirname, "dist");

module.exports = {
  entry: {
    jsx: "./src/index.tsx",
  },
  output: {
    path: distDir,
    filename: "index.js",
    publicPath: "./",
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  module: {
    rules: [
      {
        test: /webworkerscript\.js$/,
        use: { loader: "worker-loader" },
      },
      {
        test: /\.tsx?$/,
        loader: [
          "ts-loader",
        ],
      },
    ],
  },
  devServer: {
    contentBase: distDir,
    publicPath: "/",
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      COMMUNITY: false,
    }),
    new HtmlWebpackPlugin({
      template: "public/index.html",
    }),
    new CopyWebpackPlugin([
      { from: "public/index.css", to: "index.css" },
      { from: "lib/lean_js_js.js", to: "lean_js_js.js" },
      { from: "lib/lean_js_wasm.js", to: "lean_js_wasm.js" },
      { from: "lib/lean_js_wasm.wasm", to: "lean_js_wasm.wasm" },
      { from: "lib/library.info.json", to: "library.info.json" },
      { from: "lib/library.olean_map.json", to: "library.olean_map.json" },
      { from: "lib/library.zip", to: "library.zip" },
    ]),
    new TerserPlugin(),
  ],
  node: {
    child_process: "empty",
    readline: "empty",
  },
  externals: {
    // react: 'require("react")',
    // 'react-dom': 'require("react-dom")',
  },
};

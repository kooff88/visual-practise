const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');


module.exports = {
    // mode分为development/production,默认为production
    mode: 'development',
    entry: {
      path: __dirname + '/src/index.js',
    },
    output: {
        path: __dirname + "/dist",//打包后的文件存放的地方
        filename: "bundle-[hash].js"//打包后输出文件的文件名
    },
    resolve: {
        extensions: ['.js', '.jsx', '.less', '.scss', '.css'], //后缀名自动补全
    },
    module: {
        rules: [
            {
                test: /\.js|jsx$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    query: {
                        presets: ['es2015', 'stage-0','react'], 
                        // cacheDirectory: true, 
                    }
                }
            },
            {
              test: /\.css$/,
              use: ['style-loader', 'css-loader','postcss-loader']
            },
            {
                test: /\.less$/,
                use: ['style-loader', 'css-loader','postcss-loader',{
                  loader: 'less-loader',
                  options: { 
                    javascriptEnabled: true
                  }
                }],
                
            },
            {
              test: /\.(jpe?g|png|gif|svg)$/i,
              use: ['file-loader']
          }
        ]
    },
    devtool: 'cheap-module-source-map',
    devServer: {
        contentBase: path.join(__dirname, 'src'),
        historyApiFallback: true,
        compress: true,
        inline:true,
        host: 'localhost',
        port: 3000,
    },
    plugins: [
        // 基本作用就是生成html文件
        new HtmlWebpackPlugin({template: './public/index.html'}),

        //热加载插件
        new webpack.HotModuleReplacementPlugin(),

        // 这个插件使用 UglifyJS 去压缩你的JavaScript代码。除了它从 webpack 中解耦之外，
        // 它和 webpack 核心插件 (webpack.optimize.UglifyJSPlugin) 是同一个插件。
        // 这允许你控制你正在使用的 UglifyJS 的版本
        // new UglifyJsPlugin({
        //     parallel: true,
        //     cache: true,
        //     sourceMap: false
        // }),

        // webpack4得使用mini-css-extract-plugin这个插件来单独打包css 
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css"
        }),
    ],
    node: {
        fs: 'empty',
        net: 'empty',
        tls: 'empty'
    }
}
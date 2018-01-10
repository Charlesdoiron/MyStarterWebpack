const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
// const ManifestPlugin = require('webpack-manifest-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin');

const dev = process.env.NODE_ENV === "dev"

let cssLoaders = [
    { loader: 'css-loader', options: { importLoaders: 1, minimize: !dev } }
]

if (!dev) {
    cssLoaders.push({
        loader: 'postcss-loader',
        options: {
            plugins: (loader) => [
                require('autoprefixer')({
                    browsers: ['last 2 versions', 'ie > 8']
                }),
            ]
        }
    })
}
let config =   {
    entry: {
        app: ['./assets/scss/app.scss', './assets/js/app.js']
    },
    watch: dev,
    output: {
        path: path.resolve('./public/assets'),
        filename: dev ? '[name].js' : '[name].js',
        publicPath: "/assets/",
    },
    resolve: {
        alias: {
            '@css': path.resolve('./assets/css/'),
            '@': path.resolve('./assets/js/'),
            Templates: path.resolve(__dirname, 'src/templates/')
        }
    },
    devtool: dev ? "cheap-module-eval-source-map" : false,
    devServer: {
      contentBase: path.resolve('./public'),
      overlay : true
      },
    module: {
        rules: [{
                // enforce permet d'ordonner les regles, pre = avant
                enforce: 'pre',
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: ['eslint-loader']
            },
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: ['babel-loader']
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: cssLoaders
                })
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [...cssLoaders, 'sass-loader']
                })
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'file-loader'
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/,

                use: [{
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                            name: '[name].[ext]'
                        }
                    },
                    {
                        loader: 'img-loader',
                        options: {
                            enabled: !dev
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin({
            filename: dev ? '[name.css]' : '[name].css',
            disable: dev
        })
    ]
}

if (!dev) {
    config.plugins.push(new UglifyJsPlugin({
            sourceMap: false
        })),
        // config.plugins.push(new ManifestPlugin()),
        config.plugins.push(new CleanWebpackPlugin(['dist'], {
            root: path.resolve('./'),
            verbose: true,
            dry: false

        }))
}
module.exports = config
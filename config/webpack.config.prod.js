'use strict';

const path = require('path');
const paths = require('./paths');
const publicPath = paths.servedPath;


function resolve(src) {
    return path.join(__dirname, '../src', src)
}

module.exports = {
    // Don't attempt to continue if there are any errors.
    bail: true,
    // We generate sourcemaps in production. This is slow but gives good results.
    // You can exclude the *.map files from the build during deployment.
    devtool: 'source-map',
    // In production, we only want to load the polyfills and the app code.
    entry: resolve('auto-height-transition/index.js'),
    output: {
        path: paths.appBuild,
        publicPath: publicPath,
        filename: 'index.js',
         chunkFilename: '[id].js',
        libraryTarget: 'umd',
        library: 'reactFormDesign',
        umdNamedDefine: true
    },
    externals: {
        react: 'react',
        'react-dom': 'react-dom'
    },
    resolve: {
        extensions: ['.web.js', '.mjs', '.js', '.json', '.web.jsx', '.jsx'],
    },
    optimization: {
        namedChunks: true,
        splitChunks: {
            chunks: 'all',
            name: true,
        },
        runtimeChunk: false,
    },
    module: {
        strictExportPresence: true,
        rules: [{
            // "oneOf" will traverse all following loaders until one will
            // match the requirements. When no loader matches it will fall
            // back to the "file" loader at the end of the loader list.
            oneOf: [

                // Process JS with Babel.
                {
                    test: /\.(js|jsx|mjs)$/,
                    include: paths.appSrc,
                    loader: require.resolve('babel-loader'),
                    options: {

                        compact: true,
                    },
                },

                // "file" loader makes sure assets end up in the `build` folder.
                // When you `import` an asset, you get its filename.
                // This loader doesn't use a "test" so it will catch all modules
                // that fall through the other loaders.
                {
                    loader: require.resolve('file-loader'),
                    // Exclude `js` files to keep "css" loader working as it injects
                    // it's runtime that would otherwise processed through "file" loader.
                    // Also exclude `html` and `json` extensions so they get processed
                    // by webpacks internal loaders.
                    exclude: [/\.(js|jsx|mjs)$/, /\.html$/, /\.json$/],
                    options: {
                        name: '[name].[ext]',
                    },
                },
                // ** STOP ** Are you adding a new loader?
                // Make sure to add the new loader(s) before the "file" loader.
            ],
        }, ],
    },

};
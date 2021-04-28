var yamlImporter = require('node-sass-yaml-importer');

module.exports = {
  publicPath: '/charts',
  devServer: {
    disableHostCheck: true
  },
  css: {
    loaderOptions: {
      postcss: {
        plugins: [require('tailwindcss'), require('autoprefixer')],
      },
      sass: {
        implementation: require('sass'), // This line must in sass option
        sassOptions: {
          importer: [
            yamlImporter
          ],
        }
      },
      less:{
      }
    },
  },
  // chainWebpack: config => {
  //   console.log(config.module.rules)
  // }
}

var jsonImporter = require('node-sass-json-importer');

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
          importer: jsonImporter(),
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

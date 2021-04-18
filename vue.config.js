module.exports = {
  publicPath: '/charts',
  css: {
    loaderOptions: {
      postcss: {
        plugins: [require('tailwindcss'), require('autoprefixer')],
      },
      sass: {
        implementation: require('sass'), // This line must in sass option
      },
    },
  },
}

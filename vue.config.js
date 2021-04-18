module.exports = {
  publicPath: '/charts',
  css: {
    loaderOptions: {
      postcss: {
        implementation: require('postcss'),
        plugins: [require('tailwindcss'), require('autoprefixer')],
      },
      sass: {
        implementation: require('sass'), // This line must in sass option
      },
    },
  },
}

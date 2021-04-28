// const jsonfile = require('../config/style-vars.json')
const req = require('require-yml')
const yml = req('./src/config/style-vars.yml')
const get = require('lodash/get')

module.exports = {
  install: function(less, pluginManager, functions) {
      functions.add('pi', function() {
          return Math.PI;
      });
      functions.add('get-config', function(k) {
        // console.log(k.value, yml.colors,  get(yml, k.value))
        return get(yml, 'vars.' + k.value);
      });
  }
};
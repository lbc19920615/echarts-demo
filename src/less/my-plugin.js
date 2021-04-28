const jsonfile = require('../config/style-vars.json')

module.exports = {
  install: function(less, pluginManager, functions) {
      functions.add('pi', function() {
          return Math.PI;
      });
      functions.add('get-map', function(k) {
        return jsonfile[k.value];
      });
  }
};
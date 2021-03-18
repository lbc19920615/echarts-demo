/**
 * 创建serie
 * @param { string } name
 * @param { [] } data
 * @param { {} } options
 *
 * @return { {} } ret;
 */
// eslint-disable-next-line no-unused-vars
function createSerie(name, data, options = {}) {

  let ret = {
    name,
    data,
  }

  return ret;
}

/**
 * 创建bar serie
 * @param name
 * @param options
 * @constructor
 */
export function BasicSerie(name, options = {}) {
  let basicOption = {}
  if (options && options.initOption) {
    basicOption = options.initOption()
  }
  let ret = {}
  ret.init = function (type, data = []) {
    let serie = createSerie(name, data, basicOption)
    serie.type = type
    return serie
  }
  return ret
}

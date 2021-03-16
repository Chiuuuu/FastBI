/**
 * @description 是否整数
 * @param {Object} item
 * @returns
 */
function isInteger(item) {
  return item.dataType === 'BIGINT'
}

/**
 * @description 是否小数
 * @param {Object} item
 * @returns
 */
function isFloat(item) {
  return item.dataType === 'DOUBLE'
}
export class Methods {
  constructor(dmType) {
    this.dmType = dmType || 'measures'
  }
  common(arg, methodName) {
    if (this.methods.dmType === 'dimessions') {
      throw new Error(`该字段不能用于维度`)
    }
    const { type, value } = arg

    if (!['integer', 'float', 'alias', 'neg'].includes(type)) {
      throw new Error(`方法${methodName}参数：只能用数字类型, ${value}是${type}`)
    }

    if (['integer', 'float', 'neg'].includes(type) && value === true) {
      return arg
    }

    if (type === 'alias') {
      if (isInteger(value)) {
        return {
          type: 'integer',
          value: true
        }
      } else if (isFloat(value)) {
        return {
          type: 'float',
          value: true
        }
      } else {
        throw new Error(`方法${methodName}参数：只能用数字类型`)
      }
    }

    return {
      type,
      value: true
    }
  }
  MIN(arg) {
    return this.methods.common.call(this, arg, 'MIN')
  }
  MAX(arg) {
    return this.methods.common.call(this, arg, 'MAX')
  }
  // 求和聚合
  SUM(arg) {
    return this.methods.common.call(this, arg, 'SUM')
  }
}

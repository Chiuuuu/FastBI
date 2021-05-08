import { cloneWith } from "lodash"

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

/**
 * @description 是否字符串
 * @param {Object} item
 * @returns
 */
function isString(item) {
  return item.dataType === 'VARCHAR'
}
export class Methods {
  constructor(dmType) {
    this.dmType = dmType || 'measures'
  }
  // 数值类型通用校验
  numberCommon(arg, methodName) {
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

  // 字符串通用校验
  stringCommon(arg, methodName) {
    const { type, value } = arg

    if (type === 'alias') {
      if (isString(value)) {
        return {
          type: 'string',
          value: true
        }
      } else {
        throw new Error(`方法${methodName}参数：只能用字符串类型`)
      }
    } else if (type !== 'string') {
      throw new Error(`方法${methodName}参数：只能用字符串类型, ${value}是${type}`)
    }

    return {
      type,
      value: true
    }
  }

  // 逻辑运算通用校验
  logicCommon(arg, methodName) {
    console.log('arg', arg)
    const { type, value } = arg
    if (!['integer', 'float', 'alias', 'neg'].includes(type)) {
      throw new Error(`方法${methodName}参数：只能用数字类型或逻辑运算, ${value}是${type}`)
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
        throw new Error(`方法${methodName}参数：只能用数字类型或逻辑运算`)
      }
    }

    return {
      type,
      value: true
    }
  }

  MIN(arg) {
    return this.methods.numberCommon.call(this, arg, 'MIN')
  }
  MAX(arg) {
    return this.methods.numberCommon.call(this, arg, 'MAX')
  }
  // 求和聚合
  SUM(arg) {
    return this.methods.numberCommon.call(this, arg, 'SUM')
  }
  // 平均数
  AVG(arg) {
    return this.methods.numberCommon.call(this, arg, 'AVG')
  }
  // 计数
  COUNT(arg) {
    return this.methods.numberCommon.call(this, arg, 'COUNT')
  }
  // 取绝对值
  ABS(arg) {
    return this.methods.numberCommon.call(this, arg, 'ABS')
  }
  // 四舍五入
  ROUND(arg) {
    return this.methods.numberCommon.call(this, arg, 'ROUND')
  }
  // 向下取整
  INT(arg) {
    return this.methods.numberCommon.call(this, arg, 'INT')
  }
  // 字符串长度
  LEN(arg) {
    return this.methods.stringCommon.call(this, arg, 'LEN')
  }
  // 当前时间
  NOW() {
    return {
      type: 'dateLit',
      value: true
    }
  }
  // 今天日期
  TODAY() {
    return {
      type: 'dateLit',
      value: true
    }
  }
  // 逻辑与运算
  LOGICAND(arg) {
    return this.methods.logicCommon.call(this, arg, 'LOGICAND')
  }
  // 逻辑或预算
  LOGICOR(arg) {
    return this.methods.logicCommon.call(this, arg, 'LOGICOR')
  }
  // 财务运算-年金函数
  PMT(arg) {
    console.log('arg', arg)
  }
}

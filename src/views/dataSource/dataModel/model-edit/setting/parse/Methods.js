export class Methods {
  constructor() {
    this.name = null
  }
  getMethod(name) {
    this.name = name
    return this[name]
  }
  MIN(arg) {
    if (typeof arg === 'number') {
      return arg
    }

    const { type, value } = arg

    if (!['integer', 'float', 'alias', 'neg'].includes(type)) {
      throw new Error(`方法MIN参数：只能用数字类型, ${value}是${type}`)
    }

    if (type === 'alias') {
      const listMap = {
        助攻数: [1, 2, 3, 4, 5],
        进球数: [11, 2, 3, 4, 10]
      }
      let list = []
      list = list.concat(listMap[arg.name])
      return Math.min(...list)
    }

    return value
  }
  MAX(arg) {
    // 优先判断
    if (typeof arg === 'number') {
      return arg
    }

    const { type, value } = arg

    if (!['integer', 'float', 'alias', 'neg'].includes(type)) {
      throw new Error(`方法MAX参数：只能用数字类型, ${value}是${type}`)
    }

    if (type === 'alias') {
      const listMap = {
        助攻数: [1, 2, 3, 4, 5],
        进球数: [11, 2, 3, 4, 10]
      }
      let list = []
      list = list.concat(listMap[arg.name])
      return Math.max(...list)
    }

    return value
  }
  // 最小值比较
  MINIMUM(...args) {
    const list = args.map(arg => {
      if (typeof arg === 'number') {
        return arg
      }
      const { type, value } = arg
      if (!['integer', 'float', 'alias', 'neg'].includes(type)) {
        throw new Error(`方法MINIMUM参数：只能用数字类型, ${value}是${type}`)
      }
      return value
    })
    return Math.min(...list)
  }
  // 求和聚合
  SUM(arg) {
    if (typeof arg === 'number') {
      return arg
    }

    const { type, value } = arg

    if (!['integer', 'float', 'alias', 'neg'].includes(type)) {
      throw new Error(`方法SUM参数：只能用数字类型, ${value}是${type}`)
    }

    if (type === 'alias') {
      const listMap = {
        助攻数: [1, 2, 3, 4, 5],
        进球数: [11, 2, 3, 4, 10]
      }
      let list = []
      list = list.concat(listMap[arg.name])
      return list.reduce((pre, current) => {
        return pre + current
      }, 0)
    }

    return value
  }
}

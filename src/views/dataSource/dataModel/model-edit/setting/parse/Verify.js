import { isNumber } from 'lodash'
import { Methods } from './Methods'
export class Verify {
  constructor(exprs) {
    this.exprs = exprs
    this.methods = new Methods()
  }

  validate(expr) {
    const { type } = expr
    switch (type) {
      case 'string':
      case 'float':
      case 'dateLit':
      case 'integer':
      case 'boolean':
      case 'fname':
      case 'aggregator':
      case 'letRef':
      case 'special':
        return expr
      case 'alias': {
        // const matchs = value.match(
        //   /^(([)([_a-zA-Z0-9\u4E00-\u9FA5\uF900-\uFA2D]+)(]))/
        // );
        // if (matchs) {
        //   const matchStr = matchs[1].substring(1, matchs[1].length - 1);
        //   if (!alias[matchStr]) throw Error(`未知名称: ${value}`);
        //   return {
        //     type: "alias",
        //     value: alias[matchStr],
        //     name: matchStr
        //   };
        // } else {
        //   throw Error(`未知名称: ${value}`);
        // }
        return expr
      }
      case 'neg': {
        if (expr.func) {
          expr.type = 'fun'
          const res = this.validate(expr)
          console.log(res)
          return {
            type: 'neg',
            value: -res
          }
        }
        return expr
      }
      case 'prog': {
        let allRight = false
        expr.prog.forEach(expr => {
          allRight = this.validate(expr)
        })
        if (allRight && expr.prog.length > 1) throw Error(`语法错误`)
        return allRight
      }
      case 'fun': {
        const func = this.validate(expr.func)
        if (func) {
          if (!this.methods[func.value]) {
            throw new Error(`暂无${func.value}函数实现`)
          }
          const result = this.methods[func.value].apply(
            this,
            expr.args.map(arg => {
              return this.validate(arg)
            })
          )
          return expr.isNeg ? -result : result
          // return this[func].apply(null, expr.args.map((arg) => {
          //   return this.validate(arg);
          // }));

          // return expr.args.map((arg) => {
          //   return this.validate(arg);
          // });
        }
        return func
      }
      case 'binary': {
        if (expr.left.type === 'fun' && expr.left.func.type === 'aggregator') {
          if (expr.right.type !== 'fun' && expr.right.type !== 'aggregator') {
            throw Error(`聚合粒度错误: 方法 ${expr.operator} 不能应用于 已聚合,未聚合`)
          }
        } else if (expr.right.type === 'fun' && expr.right.func.type === 'aggregator') {
          if (expr.left.type !== 'fun' && expr.left.type !== 'aggregator') {
            throw Error(`聚合粒度错误: 方法 ${expr.operator} 不能应用于 未聚合,已聚合`)
          }
        }
        const re = this.evaluate(
          expr.operator,
          this.validate(expr.left),
          this.validate(expr.right)
        )
        return re
      }
      case 'if': {
        const cond = this.validate(expr.cond)
        if (cond && expr.then && !expr.else) {
          return this.validate(expr.then)
        } else {
          this.validate(expr.then)
        }
        return expr.else ? this.validate(expr.else) : false
      }
      case 'tail':
        throw new Error(`语法错误`)
      default:
        throw new Error("I don't know how to validate " + expr)
    }
  }
  evaluate(operator, left, right) {
    function num(x) {
      if (typeof x === 'number') {
        return x
      }

      if (isNumber(x.value) && typeof x.value === 'number') {
        return x.value
      } else {
        throw new Error('参数类型错误')
      }
    }

    function dtAdd(left, right) {
      if (left.type === right.type) {
        throw Error('参数类型错误: 方法 + 不能应用于 日期,日期')
      }

      const _num = left.type === 'dateLit' ? num(right) : num(left)
      const dt =
        left.type === 'dateLit'
          ? new Date(left.value).getTime()
          : new Date(right.value).getTime()
      const MILLISECOND_PER_DAY = 24 * 60 * 60 * 1000
      const total = dt + MILLISECOND_PER_DAY * _num
      return new Date(total)
    }

    function dtMul(left, right) {
      const _num = left.type === 'dateLit' ? num(right) : num(left)
      const dt =
        left.type === 'dateLit'
          ? new Date(left.value).getTime()
          : new Date(right.value).getTime()
      const MILLISECOND_PER_DAY = 24 * 60 * 60 * 1000
      const total = dt - MILLISECOND_PER_DAY * _num
      return new Date(total)
    }

    function div(x) {
      if (num(x) === 0) throw new Error('Divide by zero')
      return x.value
    }

    switch (operator) {
      case '+': {
        if (left.type === right.type && left.type === 'string') {
          return left.value + right.value
        }

        if (left.type === 'dateLit' || right.type === 'dateLit') {
          return dtAdd(left, right)
        }

        return num(left) + num(right)
      }
      case '-': {
        if (left.type === right.type && left.type === 'dateLit') {
          const MILLISECOND_PER_DAY = 24 * 60 * 60 * 1000
          const difftime =
            new Date(left.value).getTime() - new Date(right.value).getTime()
          return parseInt(difftime / MILLISECOND_PER_DAY)
        }

        if (left.type === 'dateLit' || right.type === 'dateLit') {
          return dtMul(left, right)
        }

        return num(left) - num(right)
      }
      case '*':
        return num(left) * num(right)
      case '/':
        return num(left) / div(right)
      case '%':
        return num(left) % div(right)
      case 'AND':
        /* eslint-disable */
        return left.value != false && right.value
      case 'OR':
        /* eslint-disable */
        return left.value != false ? left.value : right.value
      case '<':
        return num(left) < num(right)
      case '>':
        return num(left) > num(right)
      case '<=':
        return num(left) <= num(right)
      case '>=':
        return num(left) >= num(right)
      case '==':
        return left.value === right.value
      case '!=':
        return left.value !== right.value
    }
    throw new Error("Can't apply operator " + operator)
  }

  MINIMUM(...args) {
    console.log('minimun', args)
  }
  SUM(...args) {
    console.log('sum', args)
  }
}

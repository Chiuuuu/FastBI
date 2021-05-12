// 设置预警颜色
import { DEFAULT_COLORS } from './defaultColors'
// val:预警列表信息；typeName:图表类型标识
export default function setWarningColor(val, typeName) {
  let warningConditions = []
  val.warning.forEach((item, index) => {
    // 获取每行条件关系表达式
    let expression = ''
    switch (item.condition) {
      case 'range':
        expression = `val >= ${item.firstValue} && val < ${item.secondValue}`
        break
      case 'more':
        expression = `val > ${item.firstValue}`
        break
      case 'less':
        expression = `val < ${item.firstValue}`
        break
      case 'moreOrEqual':
        expression = `val >= ${item.firstValue}`
        break
      case 'lessOrEqual':
        expression = `val <= ${item.firstValue}`
        break
      case 'equal':
        expression = `val === ${item.firstValue}`
        break
      case 'notEqual':
        expression = `val !== ${item.firstValue}`
        break
    }
    // 记录每一行条件的颜色和关系表达式
    warningConditions.push({
      color: item.warnColor,
      fn: val => {
        return eval(expression)
      }
    })
  })
  return setColorFormatter(warningConditions, typeName)
}
function setColorFormatter(list, typeName) {
  // 符合条件变为赌赢预警颜色，其余保持原有颜色
  // 除饼图用dataIndex其他图表数据颜色用seriesIndex
  return function(params) {
    let temColor =
      typeName === 've-pie'
        ? DEFAULT_COLORS[params.dataIndex]
        : DEFAULT_COLORS[params.seriesIndex]
    // 不同图表值参数结构不同
    let data = params.data
    if (typeName === 've-pie') {
      data = data.value
    }
    if (typeName === 've-line') {
      data = data[1]
    }
    // 根据条件获取对应预警颜色，冲突以后面条件为准
    for (let item of list) {
      if (item.fn(data)) {
        temColor = item.color
      }
    }
    return temColor
  }
}

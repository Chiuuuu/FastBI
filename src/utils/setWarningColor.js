// 设置预警颜色
import { DEFAULT_COLORS } from './defaultColors'
// val:预警列表信息；typeName:图表类型标识
function judgeCondition(item, data) {
  // 获取每行条件关系表达式
  switch (item.condition) {
    case 'range':
      return data >= item.firstValue && data < item.secondValue
    case 'more':
      return data > item.firstValue
    case 'less':
      return data < item.firstValue
    case 'moreOrEqual':
      return data >= item.firstValue
    case 'lessOrEqual':
      return data <= item.firstValue
    case 'equal':
      return data === item.firstValue
    case 'notEqual':
      return data !== item.firstValue
  }
}
export default function setColorFormatter(val, typeName) {
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
    for (let item of val.warning) {
      temColor =
        item.measure === params.seriesIndex && judgeCondition(item, data)
          ? item.warnColor
          : temColor
    }
    return temColor
  }
}

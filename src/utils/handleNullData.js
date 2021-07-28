import { reject, resolve } from 'core-js/fn/promise'

// 返回空或null字段图表报错
export default function handleNullData(returnData, setting, isLabel = false, formatTableColumns) {
  let promise = new Promise(resolve => {
    let apiData = setting.api_data
    let dimensions = isLabel ? 'labelDimensions' : 'dimensions'
    let measures = isLabel ? 'labelMeasures' : 'measures'
    // 获取所有数据的key
    let keys = apiData[`${dimensions}`]
      .concat(apiData[`${measures}`])
      .map(item => item.alias)
    // 过滤null行
    returnData = returnData.filter(item => item)
    for (let rowDatas of returnData) {
      // 整行为空
      // if (rowDatas === null) {
      //   setting.isEmpty = 'dataError'
      //   continue
      // }
      // 行内存在空字段
      for (let key of keys) {
        if (typeof rowDatas[key] === 'undefined') {
          // setting.isEmpty = 'dataError'
          rowDatas[key] = '空'
          // 表格赋值null
          if (setting.chartType === 'v-tables') {
            rowDatas[key] = ''
          }
        }
        // 数据导出时, 度量需要拼接聚合方式
        if (formatTableColumns) {
          const hasFormatKey = formatTableColumns.find(item => item.alias === key)
          if (hasFormatKey) {
            rowDatas[hasFormatKey.colName] = rowDatas[key]
            delete rowDatas[key]
          }
        }
      }
    }
    resolve(returnData)
  })
  return promise
}

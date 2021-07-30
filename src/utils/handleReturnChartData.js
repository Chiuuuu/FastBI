import _ from 'lodash'

// 返回空或null字段图表报错
export default function handleReturnChartData(returnData, setting, isLabel = false, formatTableColumns) {
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
    // 去掉排序的数据
    if (apiData.options.sort && apiData.options.sort.length) {
      returnData = handleSortData(apiData, returnData)
    }
    resolve(returnData)
  })
  return promise
}

// 去掉排序的数据
function handleSortData(apiData, datas) {
  let filterArr = []
  apiData.options.sort.forEach(item => {
    filterArr.push(`sort_${item.alias}`)
  })
  datas = datas.map(item => _.omit(item, filterArr))
  return datas
}

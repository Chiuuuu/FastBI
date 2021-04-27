import { sum, summary } from '@/utils/summaryList'
import geoJson from '@/utils/guangdong.json'
// 处理大屏刷新数据
export function handleRefreshData({ chart, newData }) {
  //   if (chart.setting.chartType === 'v-map') {
  //     let measure = chart.setting.api_data.measures[0].alias
  //     let dimension = chart.setting.api_data.dimensions[0].alias
  //     let rows = chart.setting.config.series[0].data
  //     for (let row of rows) {
  //       let data = newData.find(item => item[dimension] === row.name)
  //       if (!data) {
  //         continue
  //       }
  //       row.value[2] = data[measure]
  //     }
  //     return
  //   }
  //   let source = chart.setting.api_data.source
  //   if (!source) {
  //     return
  //   }
  //   let sourceRows = source.rows
  //   if (!sourceRows) {
  //     return
  //   }
  //   if (chart.setting.type === '2') {
  //     sourceRows.forEach((row, index) => {
  //       // 按对应key重新取值
  //       if (index === 0) {
  //         row.value = newData[0][row.type]
  //       } else {
  //         row.value = newData[0][row.type] - newData[0][sourceRows[0].type]
  //       }
  //     })
  //     // 仪表盘
  //     if (
  //       chart.setting.chartType === 'v-gauge' &&
  //       chart.setting.api_data.measures[1]
  //     ) {
  //       chart.setting.config.series.max =
  //         newData[0][chart.setting.api_data.measures[1].alias]
  //     }
  //   } else if (chart.setting.chartType === 'v-multiPie') {
  //     // 嵌套饼图设置apis
  //     let rows = []
  //     let dimensionKeys = chart.setting.api_data.dimensions.map(
  //       item => item.alias
  //     )
  //     dimensionKeys.forEach(item => {
  //       // 根据当前维度分类得到的列表
  //       let list = summary(
  //         newData,
  //         item,
  //         chart.setting.api_data.measures[0].alias
  //       ) // 嵌套饼图度量只有一个，直接取第一个数
  //       rows = rows.concat(list) // 把所有维度分类出来的数组进行拼接（v-charts配置格式要求）
  //     })

  //     chart.setting.api_data.source.rows = rows
  //   } else {
  //     if (chart.setting.api_data.source) {
  //       chart.setting.api_data.source.rows = newData
  //     }
  //   }
  let apiData = chart.setting.api_data
  if (chart.setting.chartType === 'v-map') {
    let config = chart.setting.config
    let legend = []
    let datas = []
    // 重置series
    config.series = [config.series[0]]
    // 只有一个维度，唯一名称
    let alias = apiData.dimensions[0].alias
    // 一个度量对应一个series.data
    apiData.measures.forEach((measure, index) => {
      // 添加series
      if (index > 0) {
        config.series[index] = Object.assign({}, config.series[0])
      }
      config.series[index].name = measure.alias
      legend.push(measure.alias)
      let data = []
      for (let item of newData) {
        // 抓取区域坐标
        let center = getCenterCoordinate(item[alias])
        // 找不到对应坐标跳过
        if (!center) {
          continue
        }
        data.push({
          name: item[alias],
          value: center.concat(item[measure.alias]) // 链接数组，坐标和值
        })
      }
      config.series[index].data = data
      datas.push(data)
    })
    config.legend.data = legend
    apiData.data = datas
    return
  }
  if (chart.setting.chartType === 'v-text') {
    let fileList = chart.setting.api_data.measures.concat(
      chart.setting.api_data.dimensions
    )
    let config = chart.setting.config
    let str = ''
    for (let item of fileList) {
      str += newData[0][item.alias] + ' '
    }
    config.title.content = str
  }
  // 表格
  if (chart.setting.type === 3) {
    let columns = []
    let fileList = chart.setting.api_data.measures.concat(
      chart.setting.api_data.dimensions
    )
    for (let item of fileList) {
      columns.push({
        title: item.alias,
        dataIndex: item.alias,
        key: item.alias
      })
    }
    let rows = newData
    if (rows.length > 10) {
      rows.length = 10
    }
    apiData.source = {
      columns,
      rows
    }
  } else {
    // 仪表盘/环形图 只显示度量
    if (chart.setting.chartType === '2') {
      let columns = ['type', 'value'] // 维度固定
      for (let m of apiData.measures) {
        columns.push(m.alias) // 默认columns第二项起为指标
      }
      // 对返回的数据列进行求和
      let total = sum(newData, apiData.measures[0].alias)
      let rows = [
        {
          type: apiData.measures[0].alias,
          value: total
        }
      ]
      // 环形图第二度量(指针值)
      if (chart.setting.chartType === 'v-ring' && apiData.measures[1]) {
        let currentTotal = sum(newData, apiData.measures[1].alias)
        rows[0] = {
          type: apiData.measures[1].alias,
          value: currentTotal
        }
        rows.push({
          type: apiData.measures[0].alias,
          value: total - currentTotal
        })
      }
      apiData.source = {
        columns,
        rows
      }
      // 保存apidata数据
      let config = chart.setting.config
      if (chart.setting.chartType === 'v-ring') {
        config.chartTitle.text = rows[1] ? rows[1].value : rows[0].value
      }
      // 如果是仪表盘，第二个度量是目标值（进度条最大值）
      if (chart.setting.chartType === 'v-gauge' && apiData.measures[1]) {
        let goalTotal = sum(newData, apiData.measures[1].alias)
        config.series.max = goalTotal
      }
      return
    }

    let columns = []
    let rows = []
    let dimensionKeys = [] // 度量key
    for (let m of apiData.dimensions) {
      dimensionKeys.push(m.alias)
      columns.push(m.alias) // 默认columns第二项起为指标
    }

    let measureKeys = [] // 度量key
    for (let m of apiData.measures) {
      measureKeys.push(m.alias)
      columns.push(m.alias) // 默认columns第二项起为指标
    }

    // 嵌套饼图设置apis
    if (chart.setting.chartType === 'v-multiPie') {
      // name是各维度数据拼接，value是分类汇总过的数值
      columns = ['name', 'value']
      let result = newData
      let level = []
      // 一个维度是一层饼
      dimensionKeys.forEach(item => {
        // 根据当前维度分类得到的列表
        let list = summary(result, item, measureKeys[0]) // 嵌套饼图度量只有一个，直接取第一个数
        rows = rows.concat(list) // 把所有维度分类出来的数组进行拼接（v-charts配置格式要求）

        level.push(list.map(obj => obj.name)) // 按维度分层
      })

      let apis = {
        level
      }
    } else {
      newData.map((item, index) => {
        let obj = {}
        for (let item2 of dimensionKeys) {
          obj[item2] = item[item2]
        }
        obj[dimensionKeys] = item[dimensionKeys]
        for (let item2 of measureKeys) {
          obj[item2] = item[item2]
        }
        // if (obj[dimensionKeys]) {
        rows.push(obj)
        // }
      })
    }

    apiData.source = {
      columns,
      rows
    }
  }
}
function getCenterCoordinate(name) {
  let dataList = geoJson.features
  let countryside = dataList.find(item => item.properties.name === name)
  if (!countryside) {
    return null
  }
  return countryside.properties.center
}

import { sum, summary } from '@/utils/summaryList'
// 处理大屏刷新数据
export function handleRefreshData({ chart, newData }) {
  if (
    chart.setting.chartType === 'v-ring' ||
    chart.setting.chartType === 'v-gauge'
  ) {
    let key = Object.keys(newData[0])[0]
    if (
      chart.setting.chartType === 'v-gauge' &&
      chart.setting.api_data.measures[1]
    ) {
      key = Object.keys(newData[0])[1]
    }
    let total = sum(newData, key)
    let rows = [
      {
        type: key,
        value: total
      }
    ]
    chart.setting.api_data.source.rows = rows

    // 仪表盘
    if (
      chart.setting.chartType === 'v-gauge' &&
      chart.setting.api_data.measures[1]
    ) {
      let goalTotal = sum(newData, Object.keys(newData[0])[0])
      chart.setting.config.series.max = goalTotal
    }
    // 环形图第二度量(指针值)
    if (
      chart.setting.chartType === 'v-ring' &&
      chart.setting.api_data.measures[1]
    ) {
      let targetTotal = sum(newData, Object.keys(newData[0])[1])
      rows.push({
        type: chart.setting.api_data.measures[0].alias,
        value: targetTotal - total
      })
    }
  } else if (chart.setting.chartType === 'v-multiPie') {
    // 嵌套饼图设置apis
    let rows = []
    let dimensionKeys = chart.setting.api_data.dimensions.map(
      item => item.alias
    )
    dimensionKeys.forEach(item => {
      // 根据当前维度分类得到的列表
      let list = summary(newData, item, chart.setting.api_data.measures[0]) // 嵌套饼图度量只有一个，直接取第一个数
      rows = rows.concat(list) // 把所有维度分类出来的数组进行拼接（v-charts配置格式要求）
    })

    chart.setting.api_data.source.rows = rows
  } else {
    if (chart.setting.api_data.source) {
      chart.setting.api_data.source.rows = newData
    }
  }
}

import { sum, summary } from '@/utils/summaryList'
// 处理大屏刷新数据
export function handleRefreshData({ chart, newData }) {
  let sourceRows = chart.setting.api_data.source.rows
  if (chart.setting.type === '2') {
    sourceRows.forEach((row, index) => {
      // 按对应key重新取值
      if (index === 0) {
        row.value = newData[0][row.type]
      } else {
        row.value = newData[0][row.type] - newData[0][sourceRows[0].type]
      }
    })
    // 仪表盘
    if (
      chart.setting.chartType === 'v-gauge' &&
      chart.setting.api_data.measures[1]
    ) {
      chart.setting.config.series.max =
        newData[0][chart.setting.api_data.measures[1].alias]
    }
  } else if (chart.setting.chartType === 'v-multiPie') {
    // 嵌套饼图设置apis
    let rows = []
    let dimensionKeys = chart.setting.api_data.dimensions.map(
      item => item.alias
    )
    dimensionKeys.forEach(item => {
      // 根据当前维度分类得到的列表
      let list = summary(
        newData,
        item,
        chart.setting.api_data.measures[0].alias
      ) // 嵌套饼图度量只有一个，直接取第一个数
      rows = rows.concat(list) // 把所有维度分类出来的数组进行拼接（v-charts配置格式要求）
    })

    chart.setting.api_data.source.rows = rows
  } else {
    if (chart.setting.api_data.source) {
      chart.setting.api_data.source.rows = newData
    }
  }
}

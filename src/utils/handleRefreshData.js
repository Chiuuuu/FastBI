import { sum, summary } from '@/utils/summaryList'
import reverseAddressResolution from '@/utils/reverseAddressResolution'
import geoJson from '@/utils/guangdong.json'
import { message } from 'ant-design-vue'
// 处理大屏刷新数据
export function handleRefreshData({ chart, newData }) {
  let apiData = chart.setting.api_data
  if (chart.setting.chartType === 'v-map') {
    // let config = chart.setting.config
    // let legend = []
    // let datas = []
    // // 重置series
    // config.series = [config.series[0]]
    // // 只有一个维度，唯一名称
    // let alias = apiData.dimensions[0].alias
    // // 一个度量对应一个series.data
    // apiData.measures.forEach((measure, index) => {
    //   // 添加series
    //   if (index > 0) {
    //     config.series[index] = Object.assign({}, config.series[0])
    //   }
    //   config.series[index].name = measure.alias
    //   legend.push(measure.alias)
    //   let data = []
    //   for (let item of newData) {
    //     // 抓取区域坐标
    //     let center = getCenterCoordinate(item[alias])
    //     // 找不到对应坐标跳过
    //     if (!center) {
    //       continue
    //     }
    //     data.push({
    //       name: item[alias],
    //       value: center.concat(item[measure.alias]) // 链接数组，坐标和值
    //     })
    //   }
    //   config.series[index].data = data
    //   datas.push(data)
    // })
    // config.legend.data = legend
    // apiData.data = datas
    // return
    setMapData(chart, newData)
  }
  let source = chart.setting.api_data.source
  if (!source) {
    return
  }
  let sourceRows = source.rows
  if (!sourceRows) {
    return
  }
  if (chart.setting.type === '2') {
    sourceRows.forEach((row, index) => {
      // 按对应key重新取值
      if (index === 0) {
        row.value = newData[0][row.type]
      } else {
        row.value = newData[0][row.type] - newData[0][sourceRows[0].type]
      }
    })
    // 环形图
    if (chart.setting.chartType === 'v-ring') {
      let datas = newData[0]
      let keys = chart.setting.api_data.measures.map(measure => measure.alias)
      // 当前值段
      let rows = [
        {
          type: keys[0],
          value: datas[keys[0]]
        }
      ]
      // 剩余段,目标值-当前值
      rows.push({
        type: keys[1],
        value: datas[keys[1]] - rows[0].value
      })
      chart.setting.api_data.source.rows = rows
      chart.setting.config.chartTitle.text =
        +((rows[0].value / datas[keys[1]]) * 100).toFixed(2) + '%'
    }
    // 仪表盘
    if (
      chart.setting.chartType === 'v-gauge' &&
      chart.setting.api_data.measures[1]
    ) {
      chart.setting.config.series.max =
        newData[0][chart.setting.api_data.measures[1].alias]
    }
    // 文本框
    if (chart.setting.chartType === 'v-text') {
      chart.setting.api_data.refreshData = newData[0]
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
    // 雷达图
    if (chart.setting.chartType === 'v-radar') {
      // 格式例子cloumns:[度量，青瓜，土豆，菜心]
      // rows:[{度量:度量1,青瓜，土豆，菜心},{度量2,青瓜，土豆，菜心}]
      let metricsName = chart.setting.api_data.dimensions[0].alias
      let newColumns = ['measure']
      let newRows = []
      chart.setting.api_data.measures.forEach(measure => {
        let measureName = measure.alias
        let obj = {}
        newData.forEach(row => {
          newColumns.push(row[metricsName])
          obj.measure = measureName
          obj[row[metricsName]] = row[measureName]
        })
        newRows.push(obj)
      })

      chart.setting.api_data.source.columns = newColumns
      chart.setting.api_data.source.rows = newRows
    }
  }
}
async function setMapData(chart, newData) {
  let apiData = chart.setting.api_data
  let name = apiData.measures[0].alias
  let legend = []
  let series = []
  // 判断添加填充层
  if (newData.fillList && newData.fillList.length) {
    series.push({
      name,
      type: 'map',
      map: 'guangzhou',
      aspectScale: 0.75,
      showLegendSymbol: false,
      zoom: 1.1,
      roam: false,
      mapLocation: {
        x: 'left',
        y: 'top'
      },
      label: {
        normal: {
          show: true,
          color: '#fff'
        },
        emphasis: {
          show: true
        }
      },
      itemStyle: {
        normal: {
          areaColor: 'rgba(1, 33, 92, 0.45)',
          borderColor: '#215495',
          borderWidth: 1
        },
        emphasis: {
          borderColor: '#073684',
          areaColor: '#061E3D'
        },
        data: []
      }
    })
    let datas = []
    if (apiData.options.fillType === 'area') {
      for (let item of newData.fillList) {
        datas.push({
          name: item[apiData.dimensions[0].alias],
          value: item[name]
        })
      }
    } else {
      for (let item of newData.fillList) {
        let positionMsg = ''
        try {
          positionMsg = await reverseAddressResolution([
            item[apiData.latitude[0].alias],
            item[apiData.longitude[0].alias]
          ])
        } catch (err) {
          continue
        }
        datas.push({
          name: positionMsg.direct,
          value: item[name]
        })
      }
      if (datas.length === 0) {
        message.error('经纬度解析失败')
        return
      }
    }
    series[0].data = datas
    chart.setting.config.legend.data = [name]
    chart.setting.config.series = series
    if (!chart.setting.config.visualMap) {
      chart.setting.config.visualMap = {
        show: false,
        type: 'piecewise',
        min: 0,
        max: 403631060,
        seriesIndex: [0],
        inRange: {
          color: ['#50a3ba', '#eac736', '#d94e5d'],
          symbolSize: [10, 16]
        },
        textStyle: {
          color: '#fff',
          fontSize: 12
        }
      }
    }
  } else {
    delete chart.setting.config.visualMap
  }
  if (newData.labelList && newData.labelList.length) {
    const dotSeries = {
      type: 'scatter', // scatter,effectScatter
      name: '人口',
      coordinateSystem: 'geo',
      symbol: 'circle',
      symbolSize: 10,
      //   aspectScale: 0.75,
      hoverAnimation: true,
      showEffectOn: 'render',
      rippleEffect: {
        brushType: 'stroke',
        scale: 3
      },
      label: {
        show: false,
        // formatter: '{b} ：{c}',
        formatter: function(params) {
          return params.data.value[2].toFixed(2)
        },
        fontSize: 12,
        position: 'right', // 可选inside
        emphasis: {
          show: true
        }
      },
      itemStyle: {
        emphasis: {
          borderColor: '#fff',
          borderWidth: 1
        }
      },
      zlevel: 1
    }
    let config = chart.setting.config
    if (apiData.options.labelType === 'area') {
      // 只有一个维度，唯一名称
      let alias = apiData.labelDimensions[0].alias
      // 一个度量对应一个series.data
      apiData.labelMeasures.forEach((measure, index) => {
        legend.push(measure.alias)
        let data = []
        for (let item of newData.labelList) {
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
        config.series.push(
          Object.assign(dotSeries, { data, name: measure.alias })
        )
      })
    } else {
      let alias = apiData.labelMeasures[0].alias
      legend.push(alias)
      let datas = []
      // 解析数据，获取经度，纬度，目标值
      for (let data of newData.labelList) {
        let positionMsg = ''
        try {
          // 获取位置信息
          positionMsg = await reverseAddressResolution([
            data[apiData.labelLatitude[0].alias],
            data[apiData.labelLongitude[0].alias]
          ])
        } catch (err) {
          continue
        }
        datas.push(
          Object.assign(dotSeries, {
            data: [
              {
                name: positionMsg.direct,
                value: data[alias]
              }
            ],
            name: alias
          })
        )
      }
      if (datas.length === 0) {
        message.error('经纬点解析失败')
        return
      }
      config.series.push(Object.assign(dotSeries, { data: datas, name: alias }))
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

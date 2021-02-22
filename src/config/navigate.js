import { DEFAULT_COLORS } from '../utils/defaultColors'

function chartClick(e) {
  console.log(e)
}

/**
 * type = 1 维度度量都需要的图表
 * type = 2 只有度量的图表(仪表盘、环形图)
 * type = 3 不区分维度或者度量（表格）
 */

const list = [
  {
    type: 'Basic',
    title: '添加图表',
    icon: 'bar-chart',
    hovered: false,
    children: [
      {
        title: '折线图',
        name: 've-line',
        chartType: 'v-line',
        icon: 'icon_line_chart.png',
        type: '1',
        modelId: '',
        isEmpty: false,
        api_data: {
          dimensions: [],
          measures: [],
          source: {},
          columns: ['日期', '访问用户', '下单用户'],
          rows: [
            { 日期: '1/1', 访问用户: 1393, 下单用户: 1093 },
            { 日期: '1/2', 访问用户: 3530, 下单用户: 3230 },
            { 日期: '1/3', 访问用户: 2923, 下单用户: 2623 },
            { 日期: '1/4', 访问用户: 1723, 下单用户: 1423 },
            { 日期: '1/5', 访问用户: 3792, 下单用户: 3492 },
            { 日期: '1/6', 访问用户: 4593, 下单用户: 4293 }
          ],
          options: {}
        },
        apis: {
          labelMap: { x: '类目', y: '值', s: '系列1' }
        },
        background: {
          backgroundType: '1',
          backgroundColor: '',
          borderColor: '',
          borderWidth: 0,
          borderStyle: '',
          borderRadius: 0
        },
        config: {
          title: {
            show: true,
            content: '折线图',
            textAlign: 'left',
            textStyle: {
              color: '#ffffff',
              fontSize: 20
            }
          },
          grid: { left: 50, top: 60, right: 50, bottom: 50 },
          legend: {
            show: true,
            orient: 'horizontal',
            textStyle: {
              color: '#ffffff',
              fontSize: 12
            },
            itemGap: 12,
            icon: '',
            left: 'center',
            top: 'auto',
            right: 'auto',
            bottom: 'auto'
          },
          xAxis: {
            name: '',
            nameLocation: 'middle',
            nameGap: 5,
            nameTextStyle: {
              color: '#fff',
              fontSize: '12',
              align: 'right',
              padding: [30, 0, 0, 0]
            },
            axisLabel: {
              color: '#ffffff',
              fontSize: 12,
              rotate: 0
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#fff'
              }
            },
            splitLine: {
              show: false,
              lineStyle: {
                width: 2,
                type: 'solid',
                color: '#fff'
              }
            },
            axisTick: {
              show: true
            }
          },
          yAxis: {
            name: '单位:个',
            position: 'left',
            nameLocation: 'middle',
            nameTextStyle: {
              color: '#fff',
              fontSize: 12,
              padding: [0, 0, 40, 0]
            },
            axisLabel: {
              color: '#ffffff',
              fontSize: 12
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#fff'
              }
            },
            splitLine: {
              show: true,
              lineStyle: {
                type: 'solid',
                color: '#fff'
              }
            },
            axisTick: {
              show: true
            }
          },
          series: {
            type: 'line',
            smooth: false, // 可选的
            step: false, // step line
            lineStyle: {
              width: 1
            },
            label: {
              show: false,
              color: '#fff',
              fontSize: 12,
              position: 'top'
            },
            areaStyle: {
              // 可选的
              opacity: 0
            }
          },
          color: DEFAULT_COLORS
        },
        view: { width: 500, height: 400, x: 710, y: 340 } // 计算中间值(1920-500)*0.5,(1080-400)*0.5
      },
      {
        title: '柱状图',
        chartType: 'v-histogram',
        name: 've-histogram',
        icon: 'icon_histogram.png',
        type: '1',
        modelId: '',
        isEmpty: false,
        api_data: {
          columns: ['日期', '访问用户', '下单用户', '下单率'],
          rows: [
            { 日期: '1/1', 访问用户: 1393, 下单用户: 1093, 下单率: 0.32 },
            { 日期: '1/2', 访问用户: 3530, 下单用户: 3230, 下单率: 0.26 },
            { 日期: '1/3', 访问用户: 2923, 下单用户: 2623, 下单率: 0.76 },
            { 日期: '1/4', 访问用户: 1723, 下单用户: 1423, 下单率: 0.49 },
            { 日期: '1/5', 访问用户: 3792, 下单用户: 3492, 下单率: 0.323 },
            { 日期: '1/6', 访问用户: 4593, 下单用户: 4293, 下单率: 0.78 }
          ],
          options: {}
        },
        apis: {
          // stack: { '用户': ['系列1', '系列2'] },
          // showLine: ['下单率'],
          // axisSite: { right: ['下单率'] },
          yAxisName: [],
          labelMap: {
            x: '类目',
            y: '值',
            s: '系列1'
          }
        },
        background: {
          backgroundType: '1',
          backgroundColor: '',
          borderColor: '',
          borderWidth: 0,
          borderStyle: '',
          borderRadius: 0
        },
        config: {
          stack: false, // 是否是堆叠柱状图
          mixed: false, // 是否是混合柱状图
          title: {
            show: true,
            content: '柱状图',
            textAlign: 'left',
            textStyle: {
              color: '#ffffff',
              fontSize: 20
            }
          },
          grid: { left: 50, top: 60, right: 50, bottom: 50 },
          legend: {
            show: true,
            orient: 'horizontal',
            textStyle: {
              color: '#ffffff',
              fontSize: 12
            },
            itemGap: 12,
            icon: '',
            left: 'center',
            top: 'auto',
            right: 'auto',
            bottom: 'auto'
          },
          xAxis: {
            name: '',
            nameLocation: 'middle',
            nameGap: 20,
            nameTextStyle: {
              color: '#fff',
              fontSize: '12',
              align: 'right',
              padding: [30, 0, 0, 0]
            },
            axisLabel: {
              color: '#ffffff',
              fontSize: 12,
              rotate: 0
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#fff'
              }
            },
            splitLine: {
              show: false,
              lineStyle: {
                type: 'solid',
                color: '#fff'
              }
            },
            axisTick: {
              show: true
            }
          },
          yAxis: {
            name: '单位:个',
            position: 'left',
            nameLocation: 'middle',
            nameTextStyle: {
              color: '#fff',
              fontSize: 12,
              padding: [0, 0, 40, 0]
            },
            axisLabel: {
              color: '#ffffff',
              fontSize: 12
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: '#fff'
              }
            },
            splitLine: {
              show: true,
              lineStyle: {
                type: 'solid',
                color: '#fff'
              }
            },
            axisTick: {
              show: true
            }
          },
          series: {
            label: {
              show: false,
              color: '#fff',
              fontSize: 12,
              position: 'top'
            },
            itemStyle: {
              normal: {
                barBorderRadius: [0]
              }
            },
            barWidth: '20%' // 可选
          },
          color: DEFAULT_COLORS
        },
        view: { width: 500, height: 400, x: 710, y: 340 }
      },
      {
        title: '条形图',
        chartType: 'v-bar',
        name: 've-bar',
        icon: 'icon_.png',
        type: '1',
        modelId: '',
        isEmpty: false,
        api_data: {
          columns: ['日期', '访问用户', '下单用户', '下单率'],
          rows: [
            { 日期: '1/1', 访问用户: 1393, 下单用户: 1093, 下单率: 0.32 },
            { 日期: '1/2', 访问用户: 3530, 下单用户: 3230, 下单率: 0.26 },
            { 日期: '1/3', 访问用户: 2923, 下单用户: 2623, 下单率: 0.76 },
            { 日期: '1/4', 访问用户: 1723, 下单用户: 1423, 下单率: 0.49 },
            { 日期: '1/5', 访问用户: 3792, 下单用户: 3492, 下单率: 0.323 },
            { 日期: '1/6', 访问用户: 4593, 下单用户: 4293, 下单率: 0.78 }
          ],
          options: {}
        },
        apis: {
          labelMap: {
            x: '类目',
            y: '值',
            s: '系列1'
          }
        },
        background: {
          backgroundType: '1',
          backgroundColor: '',
          borderColor: '',
          borderWidth: 0,
          borderStyle: '',
          borderRadius: 0
        },
        config: {
          title: {
            show: true,
            content: '条形图',
            textAlign: 'left',
            textStyle: {
              color: '#ffffff',
              fontSize: 20
            }
          },
          grid: { left: 50, top: 60, right: 50, bottom: 50 },
          legend: {
            show: true,
            orient: 'horizontal',
            textStyle: {
              color: '#ffffff',
              fontSize: 12
            },
            itemGap: 12,
            icon: '',
            left: 'center',
            top: 'auto',
            right: 'auto',
            bottom: 'auto'
          },
          xAxis: {
            name: '',
            position: 'bottom',
            nameLocation: 'middle',
            nameTextStyle: {
              color: '#fff',
              fontSize: '12',
              //   align: "right",
              padding: [30, 0, 0, 0]
            },
            axisLabel: {
              color: '#ffffff',
              fontSize: 12,
              rotate: 0
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#fff'
              }
            },
            splitLine: {
              show: false,
              lineStyle: {
                type: 'solid',
                color: '#fff'
              }
            },
            axisTick: {
              show: true
            }
          },
          yAxis: {
            name: '单位:个',
            position: 'left',
            // nameLocation: 'middle',
            nameTextStyle: {
              color: '#fff',
              fontSize: 12,
              padding: [0, 0, 30, 0]
            },
            axisLabel: {
              color: '#ffffff',
              fontSize: 12
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: '#fff'
              }
            },
            splitLine: {
              show: true,
              lineStyle: {
                type: 'solid',
                color: '#fff'
              }
            },
            axisTick: {
              show: true
            }
          },
          series: {
            label: {
              show: false,
              color: '#fff',
              fontSize: 12,
              position: 'inside'
              // offset: [0, 1]
            },
            barWidth: '20%', // 可选
            barGap: '40%',
            barCategoryGap: '40%'
          },
          color: DEFAULT_COLORS
        },
        view: { width: 500, height: 450, x: 710, y: 340 }
      },
      {
        title: '饼图',
        name: 've-pie',
        chartType: 'v-pie',
        icon: '饼图.png',
        type: '1',
        modelId: '',
        isEmpty: false,
        api_data: {
          columns: ['日期', '访问用户'],
          rows: [
            { 日期: '1/1', 访问用户: 1393 },
            { 日期: '1/2', 访问用户: 3530 },
            { 日期: '1/3', 访问用户: 2923 },
            { 日期: '1/4', 访问用户: 1723 },
            { 日期: '1/5', 访问用户: 3792 },
            { 日期: '1/6', 访问用户: 4593 }
          ],
          options: {}
        },
        apis: {},
        background: {
          backgroundType: '1',
          backgroundColor: '',
          borderColor: '',
          borderWidth: 0,
          borderStyle: '',
          borderRadius: 0
        },
        config: {
          title: {
            show: true,
            content: '饼图',
            textAlign: 'left',
            textStyle: {
              color: '#ffffff',
              fontSize: 20
            }
          },
          grid: { left: 20, top: 60, right: 20, bottom: 30 },
          legend: {
            show: true,
            orient: 'horizontal',
            textStyle: {
              color: '#ffffff',
              fontSize: 12
            },
            itemGap: 12,
            icon: '',
            left: 'center',
            top: 'auto',
            right: 'auto',
            bottom: 'auto'
          },
          xAxis: {
            show: false,
            axisLabel: {
              color: '#ffffff',
              fontSize: 12,
              rotate: 0
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: '#cccccc'
              }
            },
            splitLine: {
              show: false,
              lineStyle: {
                color: '#cccccc'
              }
            }
          },
          yAxis: {
            show: false,
            axisLabel: {
              color: '#ffffff',
              fontSize: 12
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: '#cccccc'
              }
            },
            splitLine: {
              show: false,
              lineStyle: {
                color: '#cccccc'
              }
            }
          },
          series: {
            label: {
              show: true,
              color: '',
              fontSize: 12,
              position: 'outside', // 可选inside
              formatter: '{b}: {@2012} ({d}%)'
            },
            roseType: false, // 饼图可选玫瑰图
            center: ['50%', '50%'], // 饼图可选
            radius: ['0', '70%'] // 饼图可选
          },
          color: DEFAULT_COLORS
        },
        chartEvents: {
          click: chartClick
        },
        view: { width: 400, height: 400, x: 760, y: 340 }
      },
      {
        title: '雷达图',
        name: 've-radar',
        chartType: 'v-radar',
        icon: 'icon_radar_map.png',
        type: '1',
        modelId: '',
        isEmpty: false,
        api_data: {
          columns: ['日期', '访问用户', '下单用户', '下单率', '日期'],
          rows: [
            { 日期: '1/1', 访问用户: 1393, 下单用户: 1093, 下单率: 0.32 },
            { 日期: '1/2', 访问用户: 3530, 下单用户: 3230, 下单率: 0.26 },
            { 日期: '1/3', 访问用户: 2923, 下单用户: 2623, 下单率: 0.76 },
            { 日期: '1/4', 访问用户: 1723, 下单用户: 1423, 下单率: 0.49 }
          ],
          options: {}
        },
        apis: {
          labelMap: {
            // 'x': '类目',
            // 'y': '值',
            // 's': '系列1'
          }
        },
        background: {
          backgroundType: '1',
          backgroundColor: '',
          borderColor: '',
          borderWidth: 0,
          borderStyle: '',
          borderRadius: 0
        },
        config: {
          title: {
            show: true,
            content: '雷达图',
            textAlign: 'left',
            textStyle: {
              color: '#ffffff',
              fontSize: 20
            }
          },
          grid: { left: 20, top: 60, right: 20, bottom: 30 },
          legend: {
            show: true,
            orient: 'horizontal',
            textStyle: {
              color: '#ffffff',
              fontSize: 12
            },
            itemGap: 12,
            icon: '',
            left: 'center',
            top: 'auto',
            right: 'auto',
            bottom: 'auto'
          },
          radar: {
            // 雷达图可选
            shape: 'circle', // polygon, circle
            center: ['50%', '60%'],
            radius: '75%',
            name: {
              formatter: '{value}',
              textStyle: {
                fontSize: 12, // 外圈标签字体大小
                color: '#fff' // 外圈标签字体颜色
              }
            },
            splitArea: {
              areaStyle: {
                color: 'transparent', // 圆环颜色
                shadowColor: 'aqua', // 圆颜色
                shadowBlur: 10
              }
            },
            axisLine: {
              lineStyle: {
                color: '#fff' // 分割线
              }
            },
            splitLine: {
              lineStyle: {
                color: '#fff', // 圆线
                width: 1
              }
            }
          },
          xAxis: {
            show: false
          },
          yAxis: {
            show: false
          },
          series: {
            type: 'radar',
            label: {
              show: false,
              color: '',
              fontSize: 12,
              position: 'inside' // 可选inside
            },
            areaStyle: {
              // 可选的
              opacity: 0.3
            }
          },
          color: DEFAULT_COLORS
        },
        view: { width: 400, height: 400, x: 760, y: 340 }
      },
      {
        title: '仪表盘',
        name: 've-gauge',
        chartType: 'v-gauge',
        icon: '图表-雷达图.png',
        type: '2',
        modelId: '',
        isEmpty: false,
        api_data: {
          columns: ['type', 'value'],
          rows: [{ type: 'speed', value: 60 }],
          options: {}
          // source: [
          //   { x: 'type', y: 60, s: 'value' }
          // ]
        },
        apis: {
          labelMap: {
            x: '类目',
            y: '值',
            s: '系列1'
          }
        },
        background: {
          backgroundType: '1',
          backgroundColor: '',
          borderColor: '',
          borderWidth: 0,
          borderStyle: '',
          borderRadius: 0
        },
        config: {
          title: {
            show: true,
            content: '仪表盘',
            textAlign: 'left',
            textStyle: {
              color: '#ffffff',
              fontSize: 20
            }
          },
          tooltip: {
            show: false
          },
          grid: { left: 0, top: 60, right: 0, bottom: 30 },
          xAxis: {
            show: false
          },
          yAxis: {
            show: false
          },
          legend: {
            show: false,
            orient: 'horizontal',
            data: [],
            textStyle: {
              color: '#ffffff',
              fontSize: 12
            },
            itemGap: 12,
            icon: '',
            left: 'center',
            top: 'auto',
            right: 'auto',
            bottom: 'auto'
          },
          series: {
            name: '',
            type: 'gauge',
            center: ['50%', '50%'],
            radius: '80%',
            startAngle: 225,
            endAngle: -45,
            min: 0,
            max: 100,
            axisLine: {
              show: true,
              lineStyle: {
                // 属性lineStyle控制线条样式
                color: [[1, '#f5c942']],
                shadowColor: '#ccc',
                shadowBlur: 2,
                width: 15
              }
            },
            splitLine: {
              show: true,
              length: 25, // 刻度节点线长度
              lineStyle: {
                width: 2,
                color: '#fff'
              } // 刻度节点线
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              show: true,
              textStyle: {
                fontSize: 14,
                color: '#fff'
              }
            },
            // title: {
            //   show: true
            // },
            detail: {
              show: true
            },
            pointer: {
              // 指针样式
              length: '60%'
            }
          }
          // color: DEFAULT_COLORS
        },
        view: { width: 400, height: 400, x: 760, y: 340 }
      },
      // {
      //     title: '地图',
      //     name: 've-map',
      //     chartType: 'v-map',
      //     icon: 'global',
      //     modelId: '',
      //     api_data: {
      //       columns: ['位置', '税收', '人口', '面积'],
      //       rows: [
      //         { '位置': '吉林', '税收': 123, '人口': 123, '面积': 92134 },
      //         { '位置': '北京', '税收': 1223, '人口': 2123, '面积': 29234 },
      //         { '位置': '上海', '税收': 2123, '人口': 1243, '面积': 94234 },
      //         { '位置': '浙江', '税收': 4123, '人口': 5123, '面积': 29234 }
      //       ]
      //     },
      //     apis: {
      //         position: 'china',
      //         labelMap: {
      //             'x': '位置',
      //             'y': '人口',
      //             's': '系列1'
      //         }
      //     },
      //     background: {
      //         backgroundType: '1',
      //         backgroundColor: '',
      //         borderColor: '',
      //         borderWidth: 0,
      //         borderStyle: '',
      //         borderRadius: 0
      //     },
      //     config: {
      //         title: {
      //             show: true,
      //             content: '地图',
      //             textAlign: 'left',
      //             textStyle: {
      //                 color: '#ffffff',
      //                 fontSize: 20
      //             }
      //         },
      //         grid: { left: 20, top: 60, right: 20, bottom: 30 },
      //         legend: {
      //             show: true,
      //             textStyle: {
      //                 color: '#ffffff',
      //                 fontSize: 12
      //             },
      //             itemGap: 12,
      //             icon: '',
      //             left: 'center',
      //             top: 'auto',
      //             right: 'auto',
      //             bottom: 'auto'
      //         },
      //         visualMap: {
      //             show: false,
      //             type: 'piecewise',
      //             min: 0,
      //             max: 200,
      //             inRange: {
      //                 color: ['#50a3ba', '#eac736', '#d94e5d'],
      //                 symbolSize: [10, 16]
      //             },
      //             textStyle: {
      //                 color: '#fff',
      //                 fontSize: 12
      //             }
      //         },
      //         xAxis: {
      //             show: false,
      //             axisLabel: {
      //                 color: '#ffffff',
      //                 fontSize: 12,
      //                 rotate: 0
      //             },
      //             axisLine: {
      //                 show: false,
      //                 lineStyle: {
      //                     color: '#cccccc'
      //                 }
      //             },
      //             splitLine: {
      //                 show: false,
      //                 lineStyle: {
      //                     color: '#cccccc'
      //                 }
      //             }
      //         },
      //         yAxis: {
      //             show: false,
      //             axisLabel: {
      //                 color: '#ffffff',
      //                 fontSize: 12
      //             },
      //             axisLine: {
      //                 show: false,
      //                 lineStyle: {
      //                     color: '#cccccc'
      //                 }
      //             },
      //             splitLine: {
      //                 show: false,
      //                 lineStyle: {
      //                     color: '#cccccc'
      //                 }
      //             }
      //         },
      //         // 地图独有的
      //         geo: {
      //             map: 'china',
      //             zoom: 1.2,
      //             label: {
      //                 normal: {
      //                     show: false,
      //                     color: '#fff',
      //                     fontSize: 12
      //                 },
      //                 emphasis: {
      //                     show: false,
      //                     color: '#fff',
      //                     fontSize: 12
      //                 }
      //             },
      //             itemStyle: {
      //                 normal: {
      //                     areaColor: '#282c3c',
      //                     borderColor: '#1f9bff'
      //                 },
      //                 emphasis: {
      //                     areaColor: '#1d2131',
      //                     borderColor: '#1f9bff'
      //                 }
      //             }
      //         },
      //         series: {
      //             type: 'scatter', // scatter,effectScatter
      //             coordinateSystem: 'geo',
      //             symbolSize: 10,
      //             aspectScale: 0.75,
      //             hoverAnimation: true,
      //             showEffectOn: 'render',
      //             rippleEffect: {
      //                 brushType: 'stroke',
      //                 scale: 3
      //             },
      //             label: {
      //                 show: false,
      //                 formatter: '{b}',
      //                 color: '',
      //                 fontSize: 12,
      //                 position: 'inside' // 可选inside
      //             },
      //             itemStyle: {
      //                 emphasis: {
      //                     borderColor: '#fff',
      //                     borderWidth: 1
      //                 }
      //             },
      //             zlevel: 1
      //         },
      //         color: DEFAULT_COLORS
      //     },
      //     view: { width: 500, height: 500, x: 710, y: 290 }
      // },
      {
        title: '环形图',
        name: 've-pie',
        chartType: 'v-ring',
        icon: 'CHART-环形图.png',
        type: '2',
        modelId: '',
        api_data: {
          columns: ['日期', '访问用户'],
          rows: [
            { 日期: '1/1', 访问用户: 3530 },
            { 日期: '1/2', 访问用户: 1393 }
          ],
          options: {}
        },
        apis: {
          hoverAnimation: false,
          labelMap: {
            x: '类目',
            y: '值',
            s: '系列1'
          }
        },
        background: {
          backgroundType: '1',
          backgroundColor: '',
          borderColor: '',
          borderWidth: 0,
          borderStyle: '',
          borderRadius: 0
        },
        config: {
          title: {
            show: true,
            content: '环形图',
            textAlign: 'left',
            textStyle: {
              color: '#ffffff',
              fontSize: 20
            }
          },
          chartTitle: {
            show: true,
            text: '70%',
            x: 'center',
            y: 'center',
            itemGap: 20,
            textStyle: {
              color: '#ffffff',
              fontFamily: '微软雅黑',
              fontSize: 20,
              fontWeight: 'bolder'
            }
          },
          tooltip: {
            show: false
          },
          grid: { left: 20, top: 20, right: 20, bottom: 30 },
          legend: {
            show: false,
            orient: 'horizontal',
            data: [],
            textStyle: {
              color: '#ffffff',
              fontSize: 12
            },
            itemGap: 12,
            icon: '',
            left: 'center',
            top: 'auto',
            right: 'auto',
            bottom: 'auto'
          },
          xAxis: {
            show: false
          },
          yAxis: {
            show: false
          },
          series: {
            radius: ['60%', '70%'],
            center: ['50%', '50%'],
            label: {
              normal: {
                show: false,
                position: 'center',
                textStyle: {
                  fontSize: '30'
                }
              },
              emphasis: {
                show: false,
                textStyle: {
                  fontSize: '30',
                  fontWeight: 'bold'
                }
              }
            }
          },
          color: ['#0185FE', '#9ED1FF']
        },
        chartEvents: {
          click: chartClick
        },
        view: { width: 400, height: 400, x: 760, y: 340 }
      },
      {
        title: '嵌套饼图',
        name: 've-pie',
        chartType: 'v-multiPie',
        icon: 'icon_pie_chart.png',
        // iconFont: 'icon-Pie-chart',
        type: '1',
        modelId: '',
        isEmpty: false,
        api_data: {
          columns: ['日期', '访问用户'],
          rows: [
            { 日期: '1/1', 访问用户: 1393 },
            { 日期: '1/2', 访问用户: 3530 },
            { 日期: '1/3', 访问用户: 2923 },
            { 日期: '1/4', 访问用户: 1723 },
            { 日期: '1/5', 访问用户: 3792 },
            { 日期: '1/6', 访问用户: 4593 }
          ],
          options: {}
        },
        apis: {
          level: [['1/1', '1/2', '1/3'], ['1/4', '1/5']],
          labelMap: {
            x: '类目',
            y: '值',
            s: '系列1'
          },
          radius: 100
        },
        background: {
          backgroundType: '1',
          backgroundColor: '',
          borderColor: '',
          borderWidth: 0,
          borderStyle: '',
          borderRadius: 0
        },
        config: {
          title: {
            show: true,
            content: '嵌套饼图',
            textAlign: 'left',
            textStyle: {
              color: '#ffffff',
              fontSize: 20
            }
          },
          grid: { left: 20, top: 60, right: 20, bottom: 30 },
          legend: {
            show: true,
            orient: 'horizontal',
            textStyle: {
              color: '#ffffff',
              fontSize: 12
            },
            itemGap: 12,
            icon: '',
            left: 'center',
            top: 'auto',
            right: 'auto',
            bottom: 'auto'
          },
          xAxis: {
            show: false,
            axisLabel: {
              color: '#ffffff',
              fontSize: 12,
              rotate: 0
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: '#cccccc'
              }
            },
            splitLine: {
              show: false,
              lineStyle: {
                color: '#cccccc'
              }
            }
          },
          yAxis: {
            show: false,
            axisLabel: {
              color: '#ffffff',
              fontSize: 12
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: '#cccccc'
              }
            },
            splitLine: {
              show: false,
              lineStyle: {
                color: '#cccccc'
              }
            }
          },
          series: {
            label: {
              show: true,
              color: '',
              fontSize: 12,
              position: 'outside', // 可选inside
              formatter: '{b}: {@2012} ({d}%)'
            },
            center: ['50%', '50%'] // 饼图可选
          },
          color: DEFAULT_COLORS
        },
        chartEvents: {
          click: chartClick
        },
        view: { width: 400, height: 400, x: 760, y: 340 }
      }
    ]
  },
  {
    type: 'Tool',
    title: '添加控件',
    hovered: false,
    icon: 'menu',
    children: [
      {
        title: '文本',
        name: 've-text',
        chartType: 'v-text',
        icon: 'icon_add.png',
        api_data: {},
        apis: {},
        modelId: '',
        canEdit: false,
        background: {
          backgroundType: '1',
          backgroundColor: 'none',
          borderColor: '',
          borderWidth: 0,
          borderStyle: '',
          borderRadius: 0
        },
        config: {
          title: {
            content: '',
            textAlign: 'left',
            textStyle: {
              color: '#ffffff',
              fontSize: 20
            }
          }
        },
        view: { width: 500, height: 400, x: 710, y: 340 }
      },
      {
        title: '图片',
        name: 've-image',
        chartType: 'v-image',
        icon: 'icon_Uploadphotos.png',
        modelId: '',
        api_data: {},
        apis: {},
        config: {
          noTitle: true,
          title: {
            content: '图片'
          }
        },
        background: {
          backgroundType: '1',
          backgroundColor: '',
          borderColor: '',
          borderWidth: 0,
          borderStyle: '',
          borderRadius: 0
        },
        view: { width: 400, height: 400, x: 760, y: 340 }
      },
      {
        title: '表格',
        name: 've-tables',
        chartType: 'v-tables',
        icon: 'icon_time.png',
        type: '3',
        modelId: '',
        isEmpty: false,
        api_data: {
          columns: [
            {
              title: '日期',
              dataIndex: 'date',
              key: 'date',
              scopedSlots: { customRender: 'date' }
            },
            {
              title: '访问用户',
              dataIndex: 'user1',
              key: 'user1',
              width: 80
            },
            {
              title: '下单用户',
              dataIndex: 'user2',
              key: 'user2',
              ellipsis: true
            },
            {
              title: '下单率',
              dataIndex: 'rate',
              key: 'rate',
              ellipsis: true
            }
          ],
          rows: [
            {
              // key: '1',
              date: '1/1',
              user1: 1393,
              user2: '1093',
              rate: '10%'
            },
            {
              // key: '2',
              date: '1/2',
              user1: 2341,
              user2: '2312',
              rate: '12%'
            },
            {
              // key: '3',
              date: '1/3',
              user1: 2378,
              user2: '2555',
              rate: '34%'
            },
            {
              // key: '4',
              date: '1/4',
              user1: 3256,
              user2: '5488',
              rate: '45%'
            },
            {
              // key: '5',
              date: '1/5',
              user1: 3452,
              user2: '3210',
              rate: '33%'
            },
            {
              // key: '6',
              date: '1/6',
              user1: 1234,
              user2: '3321',
              rate: '30%'
            }
          ],
          options: {}
        },
        apis: {},
        background: {
          backgroundType: '1',
          backgroundColor: '',
          borderColor: '',
          borderWidth: 0,
          borderStyle: '',
          borderRadius: 0
        },
        config: {
          index: {
            show: false
          },
          title: {
            show: true,
            content: '表格',
            textAlign: 'left',
            textStyle: {
              color: '#fff',
              fontSize: 20
            }
          },
          header: {
            show: true,
            textStyle: {
              color: '#fff',
              fontSize: 20,
              fontWeight: 'bold',
              textAlign: 'left'
            },
            backgroundColor: ''
          },
          table: {
            textStyle: {
              color: '#fff',
              fontSize: 20,
              fontWeight: 'bold',
              textAlign: 'left'
            },
            oddBackgroundColor: '',
            evenBackgroundColor: '',
            pageSize: 10,
            ellipsis: true
          }
        },
        view: { width: 500, height: 400, x: 710, y: 340 } // 计算中间值(1920-500)*0.5,(1080-400)*0.5
      }
    ]
  }
  // {
  //     type: 'Base',
  //     title: '素材库',
  //     hovered: false,
  //     icon: 'database',
  //     children: []
  // }
  // {
  //     type: 'Sort',
  //     title: '排序',
  //     hovered: false,
  //     icon: 'unordered-list',
  //     children: [{
  //             title: '上移一层'
  //         },
  //         {
  //             title: '下移一层'
  //         },
  //         {
  //             title: '置于顶层'
  //         },
  //         {
  //             title: '置于底层'
  //         }
  //     ]
  // },
  // {
  //     type: 'Theme',
  //     title: '主题风格',
  //     hovered: false,
  //     icon: 'bg-colors',
  //     children: []
  // },
  // {
  //     type: 'Recommend',
  //     title: '智能推荐',
  //     hovered: false,
  //     icon: 'compass',
  //     children: []
  // }
]

export default list

function getConfig(enddata = 20) {
  return {
    title: {
      text: '用户登录数',
      padding: [5, 0, 0, 15]
    },
    grid: { left: 20, right: 50, bottom: 50 },
    dataZoom: [
      {
        type: 'slider',
        start: 0,
        end: enddata,
        maxSpan: 100
      },
      {
        type: 'inside' // 使鼠标在图表中时滚轮可用
      }
    ],
    xAxis: {
      name: '',
      boundaryGap: false,
      nameLocation: 'end',
      nameGap: 5,
      nameTextStyle: {
        fontSize: '12',
        align: 'right'
      },
      axisLabel: {
        fontSize: 12,
        rotate: 0
      },
      axisLine: {
        show: true,
        lineStyle: {}
      },
      splitLine: {
        show: false,
        lineStyle: {
          width: 2,
          type: 'solid'
        }
      },
      axisTick: {
        show: true
      }
    },
    yAxis: {
      name: '',
      position: 'left',
      nameTextStyle: {
        fontSize: 12
      },
      axisLabel: {
        fontSize: 12
      },
      axisLine: {
        show: true,
        lineStyle: {}
      },
      splitLine: {
        show: true,
        lineStyle: {
          type: 'solid'
        }
      },
      axisTick: {
        show: true
      }
    },
    series: {
      type: 'line',
      smooth: true, // 可选的
      showSymbol: true, // 隐藏图标
      lineStyle: {
        width: 2
      },
      label: {
        show: true,
        color: 'black',
        fontSize: 12,
        position: 'top'
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: 'rgb(17,207,255)' // 0% 处的颜色
            },
            {
              offset: 1,
              color: 'white' // 100% 处的颜色
            }
          ]
        }
      }
    },
    // color: ['#EE6666']
    color: ['RGB(0,0,191)']
  }
}
export default getConfig

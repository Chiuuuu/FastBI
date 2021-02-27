function getConfig(enddata = 20) {
  return {
    title: {
      text: '系统访问量趋势分析'
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
      name: '日期',
      boundaryGap: false,
      nameLocation: 'end',
      nameGap: 5,
      nameTextStyle: {
        //   color: '#fff',
        fontSize: '12',
        align: 'right'
      },
      axisLabel: {
        //   color: '#ffffff',
        fontSize: 12,
        rotate: 0
      },
      axisLine: {
        show: true,
        lineStyle: {
          // color: '#fff'
        }
      },
      splitLine: {
        show: false,
        lineStyle: {
          width: 2,
          type: 'solid'
          // color: '#fff'
        }
      },
      axisTick: {
        show: true
      }
    },
    yAxis: {
      name: '访问量/次',
      position: 'left',
      nameTextStyle: {
        //   color: '#fff',
        fontSize: 12
      },
      axisLabel: {
        //   color: '#ffffff',
        fontSize: 12
      },
      axisLine: {
        show: true,
        lineStyle: {
          // color: '#fff'
        }
      },
      splitLine: {
        show: true,
        lineStyle: {
          type: 'solid'
          // color: '#fff'
        }
      },
      axisTick: {
        show: true
      }
    },
    series: {
      type: 'line',
      smooth: true, // 可选的
      step: false, // step line
      showSymbol: false, // 隐藏图标
      lineStyle: {
        width: 2
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
    color: ['#EE6666']
  }
}
export default getConfig

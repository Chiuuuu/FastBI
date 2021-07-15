export default {
  'high-pie': [{
    type: 'pie',
    name: '图形占比',
    //模块名和所占比，也可以{name: '测试1',y: 12}
    data: [{
        name: 'Chrome',
        y: 61.41
      },
      {
        name: 'IE',
        y: 11.84
      },
      {
        name: 'Firefox',
        y: 10.85
      },
      {
        name: 'Edge',
        y: 4.67
      },
      {
        name: 'Safari',
        y: 4.18
      },
      {
        name: 'Other',
        y: 7.05
      }
    ]
  }],
  'high-column': [{
    // type: 'pie',
    name: '图形占比',
    //模块名和所占比，也可以{name: '测试1',y: 12}
    data: [{
        name: 'Chrome',
        y: 61.41
      },
      {
        name: 'Internet Explorer',
        y: 11.84
      },
      {
        name: 'Firefox',
        y: 10.85
      },
      {
        name: 'Edge',
        y: 4.67
      },
      {
        name: 'Safari',
        y: 4.18
      },
      {
        name: 'Other',
        y: 7.05
      }
    ]
  }],
  'v-sun': {
    type: 'sunburst',
    emphasis: {
      focus: 'ancestor'
    },
    center: ['50%', '50%'],
    radius: [0, '80%'],
    label: {
      show: true,
      fontSize: 12,
      color: '#fff',
      formatter: '{b}',
      position: 'inside',
      rotate: 'radial'
    },
    itemStyle: {
      borderColor: '#fff',
      borderWidth: 1
    },
    data: [{
        name: "张明1",
        value: 78,
        children: [{
          name: "男",
          value: 78,
          children: []
        }]
      },
      {
        name: "张明2",
        value: 42,
        children: [{
          name: "男",
          value: 42,
          children: []
        }]
      },
      {
        name: "张明3",
        value: 88,
        children: [{
          name: "男",
          value: 88,
          children: []
        }]
      },
      {
        name: "张明4",
        value: 32,
        children: [{
          name: "男",
          value: 32,
          children: []
        }]
      },
      {
        name: "张明5",
        value: 20,
        children: [{
          name: "男",
          value: 20,
          children: []
        }]
      }
    ]
  },
  'v-heatmap': {
    name: '',
    type: 'heatmap',
    center: ['50%', '50%'],
    data: [
      ['1a', 'Sunday', 2],
      ['2a', 'Saturday', 4],
      ['3a', 'Friday', 6],
      ['4a', 'Saturday', 8],
      ['5a', 'Thursday', 10],
      ['6a', 'Saturday', 1],
      ['7a', 'Wednesday', 2],
      ['8a', 'Saturday', 3],
      ['9a', 'Tuesday', 24],
      ['10a', 'Saturday', 5],
      ['11a', 'Monday', 20],
      ['12a', 'Saturday', 12]
    ],
    label: {
      show: true,
      color: '#fff',
      position: 'inside'
    },
    emphasis: {
      itemStyle: {
        shadowBlur: 10,
        shadowColor: 'rgba(0, 0, 0, 0.5)'
      }
    }
  }
}

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
    visualMap: {},
    series: {
      label: {
        formatter: '{b}'
      },
      data: [{
        name: '张明1',
        value: 78,
        children: [{
          name: '男',
          value: 78,
          children: []
        }]
      },
      {
        name: '张明2',
        value: 42,
        children: [{
          name: '男',
          value: 42,
          children: []
        }]
      },
      {
        name: '张明3',
        value: 88,
        children: [{
          name: '男',
          value: 88,
          children: []
        }]
      },
      {
        name: '张明4',
        value: 32,
        children: [{
          name: '男',
          value: 32,
          children: []
        }]
      },
      {
        name: '张明5',
        value: 20,
        children: [{
          name: '男',
          value: 20,
          children: []
        }]
      }
      ]
    }
    // series: {
    //   label: {
    //     show: true,
    //     color: '',
    //     fontSize: 12,
    //     position: 'outside', // 可选inside
    //     formatter: '{b}: {@2012} ({d}%)'
    //   },
    //   center: ['50%', '50%'] // 饼图可选
    // },
  },
  'v-heatmap': {
    visualMap: {},
    series: {
      label: {
        formatter: '{b}'
      },
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
      ]
    }
    // color: DEFAULT_COLORS
  },
  'v-treemap': {
    visualMap: {
      pieces: [
        { label: '广州市', value: 800 },
        { label: '深圳市', value: 100 },
        { label: '东莞市', value: 100 },
        { label: '南京市', value: 700 },
        { label: '苏州市', value: 200 },
        { label: '无锡市', value: 100 }
      ]
    },
    series: {
      label: {
        formatter: '{b}'
      },
      data: [{
        name: '广东省',
        value: [1000, 1000],
        children: [{
          name: '广州市',
          value: [800, 800]
        },
        {
          name: '深圳市',
          value: [100, 100]
        },
        {
          name: '东莞市',
          value: [100, 100]
        }
        ]
      },
      {
        name: '江苏省',
        value: [1000, 1000],
        children: [{
          name: '南京市',
          value: [700, 700]
        },
        {
          name: '苏州市',
          value: [200, 200]
        },
        {
          name: '无锡市',
          value: [100, 100]
        }
        ]
      }
      ]
    }
  }
}

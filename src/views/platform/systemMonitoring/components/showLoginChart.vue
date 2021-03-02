<template>
  <div class="monitoringtab">
    <div class="search">
      <div class="searchbar">
        登录日期从
        <a-date-picker
          v-model="startTime"
          :disabled-date="disabledStartDate"
          format="YYYY/MM/DD"
          placeholder="请选择日期"
        />
        至
        <a-date-picker
          v-model="endTime"
          :disabled-date="disabledEndDate"
          format="YYYY/MM/DD"
          placeholder="请选择日期"
        />
        <div class="btn">
          <a-button
            style="margin-right:20px"
            type="primary"
            icon="search"
            @click="getData"
          >
            查询
          </a-button>
          <a-button icon="sync" @click="reset">
            重置
          </a-button>
        </div>
      </div>
    </div>
    <div class="chart">
      <ve-line
        :key="key"
        :height="height"
        :data="chartData"
        :extend="chartExtend"
        :legend-visible="false"
        :setting="{ labelMap: { x: '类目', y: '值', s: '系列1' } }"
      ></ve-line>
    </div>
  </div>
</template>
<script>
import getConfig from './linechart.js'
import moment from 'moment'
const showLength = 10 // 图表显示的数据区间大小
export default {
  name: 'SystemMonitoring',
  data() {
    return {
      chartData: { columns: ['日期', '访问量/次'] },
      chartExtend: getConfig(),
      height: 'auto',
      startTime: '',
      endTime: '',
      count: { totalVisits: '', totalUsers: '', totalUnits: '' },
      key: 0 // 控制图表刷新
    }
  },
  mounted() {
    this.height = `${document.querySelector('.monitoring').clientHeight -
      110}px`
    this.getData()
  },
  methods: {
    async getData() {
      let dataList = [
        { dateTime: '2021/01/01', visits: 1393, users: 200, units: 463 },
        { dateTime: '2021/01/02', visits: 3530, users: 340, units: 523 },
        { dateTime: '2021/01/03', visits: 2923, users: 120, units: 423 },
        { dateTime: '2021/01/04', visits: 1723, users: 200, units: 643 },
        { dateTime: '2021/01/05', visits: 3792, users: 450, units: 263 },
        { dateTime: '2021/01/06', visits: 8593, users: 260, units: 423 },
        { dateTime: '2021/01/11', visits: 1393, users: 200, units: 463 },
        { dateTime: '2021/01/22', visits: 530, users: 340, units: 523 },
        { dateTime: '2021/01/23', visits: 2923, users: 120, units: 423 },
        { dateTime: '2021/01/24', visits: 1723, users: 200, units: 643 },
        { dateTime: '2021/01/25', visits: 3792, users: 450, units: 263 },
        { dateTime: '2021/01/26', visits: 4593, users: 260, units: 423 },
        { dateTime: '2021/01/28', visits: 8593, users: 260, units: 423 }
      ]
      if (this.startTime && this.endTime) {
        let start = new Date(this.startTime).getTime()
        let end = new Date(this.endTime).getTime()
        dataList = dataList.filter(item => {
          let date = new Date(item.dateTime).getTime()
          return date >= start && date <= end
        })
      }
      this.createChartData(dataList)
    },
    createChartData(list) {
      let rows = []
      let vcount = 0
      let ucount = 0
      let uncount = 0
      list.forEach(item => {
        rows.push({
          日期: item.dateTime.substr(-5, 5).replace(/\//g, '-'),
          '访问量/次': item.visits
        })
        vcount += item.visits
        ucount += item.users
        uncount += item.units
      })
      this.chartData.rows = rows
      this.count = {
        totalVisits: vcount,
        totalUsers: ucount,
        totalUnits: uncount
      }
      // 计算区间百分比
      let enddata = Math.floor((showLength / list.length) * 100)
      this.chartExtend = getConfig(enddata)
      this.key++
    },
    disabledStartDate(current) {
      if (!current || !this.endTime) {
        return
      }
      return current.valueOf() > this.endTime.valueOf()
    },
    disabledEndDate(current) {
      if (!current || !this.startTime) {
        return
      }
      return (
        current.valueOf() > this.startTime.valueOf() &&
        current >= moment().endOf('day')
      )
    },
    reset() {
      this.startTime = ''
      this.endTime = ''
      this.getData()
    }
  }
}
</script>

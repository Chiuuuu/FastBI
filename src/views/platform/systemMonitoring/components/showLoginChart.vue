<template>
  <div class="monitoringtab">
    <div class="search">
      <div class="searchbar">
        登录日期从
        <a-date-picker
          v-model="startTime"
          :disabled-date="disabledStartDate"
          format="YYYY-MM-DD"
          placeholder="请选择日期"
        />
        至
        <a-date-picker
          v-model="endTime"
          :disabled-date="disabledEndDate"
          format="YYYY-MM-DD"
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
      startTime: moment().subtract(6, 'days'),
      endTime: moment(),
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
      let dataList = []
      if (this.startTime && this.endTime) {
        let params = {
          beginDate: this.startTime,
          endDate: this.endTime
        }
        let res = await this.$server.systemMonitoring.showChartData(params)
        dataList = res.data.graphData
      }
      this.createChartData(dataList)
    },
    createChartData(list) {
      let rows = []
      list.forEach(item => {
        rows.push({
          日期: item.dayTime.replace(/-/g, '.'),
          '访问量/次': item.total
        })
      })
      this.chartData.rows = rows

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
      this.startTime = moment().subtract(6, 'days')
      this.endTime = moment()
      this.getData()
    }
  }
}
</script>

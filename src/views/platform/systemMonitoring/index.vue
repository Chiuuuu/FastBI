<template>
  <a-row :gutter="16" class="screen-manage">
    <a-col class="gutter-row screen-manage" :span="24">
      <div class="main" style="height:100%;backgroundColor:transparent">
        <div class="right" style="color:red;height:100%">
          <div class="monitoring">
            <div class="contain left" ref="leftpanal">
              <ve-line
                :key="key"
                :height="height"
                :data="chartData"
                :extend="chartExtend"
                :legend-visible="false"
                :setting="{ labelMap: { x: '类目', y: '值', s: '系列1' } }"
              ></ve-line>
            </div>
            <div class="contain right">
              <div class="searchbar">
                <a-range-picker
                  style="width:250px;margin-right:10px;"
                  :disabled-date="disabledDate"
                  @change="onChange"
                >
                  <a-icon slot="suffixIcon" type="calendar" />
                </a-range-picker>
                <a-button type="primary" icon="search" @click="getData">
                  查询
                </a-button>
              </div>
              <ul class="staticlist">
                <li>
                  系统访问总量：<span>{{ count.totalVisits }}</span>
                </li>
                <li>
                  系统用户数量：<span>{{ count.totalUsers }}</span>
                </li>
                <li>
                  系统单位数量：<span>{{ count.totalUnits }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </a-col>
  </a-row>
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
    // 图表高度填满左边板块
    this.height = this.$refs.leftpanal.clientHeight + 'px'
    this.getData()
  },
  methods: {
    disabledDate(current) {
      // 截止到今天
      return current && current >= moment().endOf('day')
    },
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
        dataList = dataList.filter(item => {
          let date = new Date(item.dateTime).getTime()
          return (
            date >= this.startTime.getTime() && date <= this.endTime.getTime()
          )
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
    onChange(date) {
      if (date.length === 0) {
        this.startTime = ''
        this.endTime = ''
        return
      }
      this.startTime = new Date(date[0].format('Y/MM/DD'))
      this.endTime = new Date(date[1].format('Y/MM/DD'))
    }
  }
}
</script>
<style lang="less" scoped>
@import './monitoring.less';
</style>

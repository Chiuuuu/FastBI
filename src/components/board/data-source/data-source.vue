<template>
  <div class="data-source">
    <a-collapse v-model="activeKey" :bordered="false">
      <a-collapse-panel key="dimensions" header="维度" v-if="chartType!=='v-tables' && chartType!=='v-gauge'">
        <drag-area type="dimensions" :fileList="fileObj.dimensions"></drag-area>
      </a-collapse-panel>
      <a-collapse-panel key="measures" header="度量" v-if="chartType!=='v-tables'">
        <drag-area type="measures" :fileList="fileObj.measures"></drag-area>
      </a-collapse-panel>
      <a-collapse-panel key="tableList" header="列" v-if="chartType==='v-tables'">
        <drag-area type="tableList" ref="table"></drag-area>
      </a-collapse-panel>
      <a-collapse-panel key="sort" header="排序">
        <div style="display: flex;">
          <a-select v-model="sortData.fileid" placeholder="选择字段" style="width: 120px;margin-right:10px"
                    @change="sortFileChange">
            <a-select-option v-for="item in sortList" :value="item.id" :key="item.id">
              {{item.name}}
            </a-select-option>
          </a-select>
          <a-select v-model="sortData.asc" style="width: 110px" @change="ascChange">
            <a-select-option v-for="(item,index) in ascList" :key="index" :value="item.value">{{item.name}}</a-select-option>
          </a-select>
        </div>
      </a-collapse-panel>
      <a-collapse-panel key="refresh" header="定时刷新">
        <a-switch slot="extra" v-if="activeKey.includes('refresh')" v-model="refresh.isRefresh" default-checked @change="refreshChange" size="small" />
        <div style="display: flex;">
          <a-input-number v-model="refresh.frequency" :min="1" @change="frequencyChange" style="width: 110px;margin-right:10px" />
          <a-select v-model="refresh.unit" placeholder="请选择"  @change="unitChange" style="width: 110px">
            <a-select-option v-for="(item,index) in refreshList" :key="index" :value="item.value">{{item.name}}</a-select-option>
          </a-select>
        </div>
      </a-collapse-panel>
      {{refresh.frequency}}
      {{refresh.unit}}
      {{refresh.isRefresh}}
      <!-- <a-collapse-panel key="filter" header="数据筛选">
        <div class="empty">拖入字段</div>
      </a-collapse-panel>
      <a-collapse-panel key="sort" header="排序">
      </a-collapse-panel>
      <a-collapse-panel key="tips" header="鼠标移入时提示">
      </a-collapse-panel>
      <a-collapse-panel key="refresh" header="定时刷新">
      </a-collapse-panel> -->
    </a-collapse>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import DragArea from './components/dragArea'
import { deepClone } from '../../../utils/deepClone'
export default {
  components: {
    DragArea
  },
  data() {
    return {
      activeKey: ['dimensions', 'measures', 'filter', 'sort', 'tips', 'tableList', 'refresh'], // 所有面板默认打开
      fileObj: {
        dimensions: [],
        measures: []
      }, // 存储维度度量数据
      apiData: {},
      sortList: [], // 排序列表
      ascList: [
        { name: '无', value: '' },
        { name: '升序', value: 1 },
        { name: '降序', value: 0 }
      ],
      sortData: {
        fileid: '', // 排序的字段
        asc: '' // 字段排序 升序true 降序false
      },
      refresh: {
        isRefresh: false, // 是否启用定时刷新
        frequency: 1, // 刷新频率
        unit: undefined // 刷新单位 分 小时 天
      },
      refreshList: [
        { name: '分', value: 'min' },
        { name: '小时', value: 'hour' }
      ],
      timer: null
    }
  },
  watch: {
    currentSelected: {
      handler (val) {
        if (val.packageJson.api_data) {
          this.sortList = [
            { name: '选择字段', id: '' }
          ]
          this.sortData = {}
          let apiData = deepClone(val.packageJson.api_data)
          this.apiData = apiData
          // 选中的维度度量组合成排序列表
          if (apiData.dimensions) {
            this.sortList = this.sortList.concat(apiData.dimensions)
          }
          if (apiData.measures) {
            this.sortList = this.sortList.concat(apiData.measures)
          }
          if (val.packageJson.name === 've-tables') {
            this.sortList = this.sortList.concat(apiData.tableList)
          }
          // 回显排序信息
          console.log(apiData)
          if (apiData.options && apiData.options.sort) {
            this.sortData = {
              fileid: apiData.options.sort.id,
              asc: apiData.options.sort.asc
            }
          }
          // 回显定时信息
          if (apiData.refresh) {
            this.refresh = {
              ...apiData.refresh
            }
          }
        }
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    ...mapGetters(['currentSelected']),
    chartType () {
      return this.currentSelected ? this.currentSelected.packageJson.chartType : ''
    }
  },
  methods: {
    ...mapActions(['saveScreenData']),
    // 排序筛选字段选择
    sortFileChange(val) {
      if (val === '') {
        this.sortData.asc = ''
      }
      let data = this.sortList.filter(item => item.id === val)
      data[0].asc = this.sortData.asc
      let options = {
        sort: data[0]
      }
      this.apiData.options = options
      this.$store.dispatch('SetSelfDataSource', this.apiData)
      if (this.currentSelected.packageJson.name === 've-tables') {
        this.$refs.table.getData()
      } else {
        this.$refs.child.getData()
      }
    },
    // 排序类型 升序 降序
    ascChange() {
      if (this.sortData.fileid) {
        this.apiData.options.sort.asc = this.sortData.asc
        this.$store.dispatch('SetSelfDataSource', this.apiData)
        if (this.currentSelected.packageJson.name === 've-tables') {
          this.$refs.table.getData()
        } else {
          this.$refs.child.getData()
        }
      }
    },
    // 定时刷新开关
    refreshChange(checked, event) {
      // 阻止默认事件，取消收起
      event.stopPropagation()
      this.refresh.isRefresh = checked
      if (checked) {
        this.frequencyChange(1)
        this.unitChange(1)
      }
      this.apiData.refresh = this.refresh
      this.$store.dispatch('SetSelfDataSource', this.apiData)
      this.saveScreenData()
      this.setTimer()
    },
    // 刷新频率设置
    frequencyChange(val) {
      if (this.refresh.isRefresh) {
        if (this.refresh.unit === 'min' && this.refresh.frequency > 1440) {
          this.$message.error('时间设置不超过1天, 请重新设置')
          this.reset()
        }
        if (this.refresh.unit === 'hour' && this.refresh.frequency > 24) {
          this.$message.error('时间设置不超过24天, 请重新设置')
          this.reset()
        }
      }
      if (val !== 1) {
        this.apiData.refresh = this.refresh
        this.$store.dispatch('SetSelfDataSource', this.apiData)
        this.saveScreenData()
        this.setTimer()
      }
    },
    // 刷新单位设置
    unitChange(val) {
      if (this.refresh.isRefresh) {
        if (this.refresh.frequency > 1440 && this.refresh.unit === 'min') {
          this.$message.error('时间设置不超过1天, 请重新设置')
          this.reset()
        }
        if (this.refresh.frequency > 24 && this.refresh.unit === 'hour') {
          this.$message.error('时间设置不超过1天, 请重新设置')
          this.reset()
        }
      }
      if (val !== 1) {
        this.apiData.refresh = this.refresh
        this.$store.dispatch('SetSelfDataSource', this.apiData)
        this.saveScreenData()
        this.setTimer()
      }
    },
    reset() {
      this.refresh.frequency = 1
      this.refresh.unit = undefined
    },
    // 单个图表的定时器设置
    setTimer() {
      if (this.timer) {
        clearInterval(this.timer)
        this.timer = null
      } else {
        // 所有条件都满足才开始倒计时刷新
        if (this.refresh.isRefresh && this.refresh.unit && this.refresh.frequency > 0) {
          let count = 0
          if (this.refresh.unit === 'min') {
            count = this.refresh.frequency * 60 * 1000
          } else if (this.refresh.unit === 'hour') {
            count = this.refresh.frequency * 60 * 60 * 1000
          }
          this.timer = setInterval(() => {
            this.refreshData()
          }, count)
        }
      }
    },
    // 刷新大屏
    refreshData() {
      let params = {
        id: this.screenId
      }
      this.$server.screenManage.actionRefreshScreen({ params }).then(res => {
        if (res.code === 200) {
          let screenDataList = res.data.screenDataList
          for (let item of screenDataList) {
            for (let item2 of this.canvasMap) {
              let apidata = deepClone(item2.packageJson.api_data)
              if (item2.id === item.id) {
                if (apidata.refresh.isRefresh && apidata.refresh.unit && apidata.refresh.frequency > 0) {
                  item2.packageJson.api_data.source.rows = item.value
                }
              }
            }
          }
          this.saveScreenData()
        }
      })
    }
  }
}
</script>

<style>

</style>

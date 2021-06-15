<template>
  <div class="data-source">
    <a-collapse v-model="activeKey" :bordered="false">
      <a-collapse-panel
        key="dimensions"
        header="维度"
        v-if="chartType === '1' && currSelected.setting.chartType !== 'v-map'"
      >
        <drag-area
          type="dimensions"
          :fileList="fileObj.dimensions"
          ref="child"
        ></drag-area>
      </a-collapse-panel>
      <a-collapse-panel
        key="measures"
        header="度量"
        v-if="
          (chartType === '1' || chartType === '2') &&
            currSelected.setting.chartType !== 'v-text' &&
            currSelected.setting.chartType !== 'v-map'
        "
      >
        <drag-area
          type="measures"
          :fileList="fileObj.measures"
          ref="child"
        ></drag-area>
      </a-collapse-panel>
      <a-collapse-panel key="tableList" header="列" v-if="chartType === '3'">
        <drag-area type="tableList" ref="table"></drag-area>
      </a-collapse-panel>
      <!-- 地图填充 -->
      <a-collapse-panel
        key="mapFill"
        header="填充"
        v-if="currSelected.setting.chartType === 'v-map'"
      >
        <a-collapse v-model="activeKey" :bordered="false">
          <a-radio-group
            class="radio-box"
            v-model="currSelected.setting.fillType"
          >
            <a-radio
              value="area"
              @click.native.stop="
                onRadioChange($event, currSelected.setting.fillType, 'fillType')
              "
              >地区</a-radio
            >
            <a-radio
              value="dot"
              @click.native.stop="
                onRadioChange($event, currSelected.setting.fillType, 'fillType')
              "
              >经纬度</a-radio
            >
          </a-radio-group>
          <a-collapse-panel
            key="dimensions"
            header="维度"
            v-if="currSelected.setting.fillType === 'area'"
          >
            <dragAreaForMapFill
              type="dimensions"
              :fileList="fileObj.dimensions"
              ref="fillDi"
              :fillType="currSelected.setting.fillType"
            ></dragAreaForMapFill>
          </a-collapse-panel>
          <a-collapse-panel key="measures" header="度量">
            <dragAreaForMapFill
              type="measures"
              :fileList="fileObj.measures"
              ref="fillMe"
              :fillType="currSelected.setting.fillType"
            ></dragAreaForMapFill>
          </a-collapse-panel>
        </a-collapse>
      </a-collapse-panel>
      <!-- 地图标记点 -->
      <a-collapse-panel
        key="mapLabel"
        header="标记点"
        v-if="currSelected.setting.chartType === 'v-map'"
      >
        <a-collapse v-model="activeKey" :bordered="false">
          <a-radio-group
            class="radio-box"
            v-model="currSelected.setting.labelType"
          >
            <a-radio
              value="area"
              @click.native.stop="
                onRadioChange(
                  $event,
                  currSelected.setting.labelType,
                  'labelType'
                )
              "
              >地区</a-radio
            >
            <a-radio
              value="dot"
              @click.native.stop="
                onRadioChange(
                  $event,
                  currSelected.setting.labelType,
                  'labelType'
                )
              "
              >经纬度</a-radio
            >
          </a-radio-group>
          <a-collapse-panel
            key="dimensions"
            header="维度"
            v-if="currSelected.setting.labelType === 'area'"
          >
            <dragAreaForMapLabel
              type="dimensions"
              :fileList="fileObj.labelDimensions"
              ref="labelDi"
              :labelType="currSelected.setting.labelType"
            ></dragAreaForMapLabel>
          </a-collapse-panel>
          <a-collapse-panel key="measures" header="度量">
            <dragAreaForMapLabel
              type="measures"
              :fileList="fileObj.labelMeasures"
              ref="labelMe"
              :labelType="currSelected.setting.labelType"
            ></dragAreaForMapLabel>
          </a-collapse-panel>
        </a-collapse>
      </a-collapse-panel>
      <!-- 数据筛选 -->
      <a-collapse-panel
        key="pick"
        header="数据筛选"
        v-if="chartType === '1' || chartType === '2' || chartType === '3'"
      >
        <drag-pick type="pick"></drag-pick>
      </a-collapse-panel>
      <a-collapse-panel key="sort" header="排序" v-if="chartType !== '2'">
        <div style="display: flex;">
          <a-select
            v-model="sortData.pivotschemaId"
            placeholder="选择字段"
            class="f-flex1"
            style="margin-right:10px;width:50%"
            @change="sortFileChange"
          >
            <a-select-option
              v-for="item in sortList"
              :value="item.id"
              :key="item.id"
              >{{ item.alias }}</a-select-option
            >
          </a-select>
          <a-select v-model="sortData.asc" class="f-flex1" @change="ascChange">
            <a-select-option
              v-for="(item, index) in ascList"
              :key="index"
              :value="item.value"
              >{{ item.name }}</a-select-option
            >
          </a-select>
        </div>
      </a-collapse-panel>
      <a-collapse-panel key="refresh" header="定时刷新">
        <a-switch
          slot="extra"
          v-if="activeKey.includes('refresh')"
          v-model="refresh.isRefresh"
          default-checked
          @change="refreshChange"
          size="small"
        />
        <div style="display: flex;">
          <a-input-number
            v-model="refresh.frequency"
            :min="1"
            @change="frequencyChange"
            class="f-flex1"
            style="margin-right:10px"
          />
          <a-select
            v-model="refresh.unit"
            placeholder="请选择"
            @change="unitChange"
            class="f-flex1"
          >
            <a-select-option
              v-for="(item, index) in refreshList"
              :key="index"
              :value="item.value"
              >{{ item.name }}</a-select-option
            >
          </a-select>
        </div>
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import DragArea from './components/dragArea'
import dragAreaForMapFill from './components/dragAreaForMapFill'
import dragAreaForMapLabel from './components/dragAreaForMapLabel'
import DragPick from './components/dragPick'
import { deepClone } from '../../../utils/deepClone'
export default {
  components: {
    DragArea,
    DragPick,
    dragAreaForMapFill,
    dragAreaForMapLabel,
  },
  data() {
    return {
      activeKey: [
        'dimensions',
        'measures',
        'filter',
        'sort',
        'tips',
        'tableList',
        'refresh',
        'pick',
        'mapFill',
        'mapLabel'
      ], // 所有面板默认打开
      fileObj: {
        labelDimensions: [],
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
        pivotschemaId: '', // 排序的字段
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
      ]
    }
  },
  watch: {
    currSelected: {
      handler(val) {
        if (val.setting.api_data) {
          this.sortList = [{ name: '选择字段', id: '' }]
          this.sortData = {}
          let apiData = deepClone(val.setting.api_data)
          this.apiData = apiData
          // 选中的维度度量组合成排序列表
          if (apiData.labelDimensions) {
            this.sortList = this.sortList.concat(apiData.labelDimensions)
          }
          if (apiData.measures) {
            this.sortList = this.sortList.concat(apiData.measures)
          }
          //   if (val.setting.name === 've-tables') {
          //     this.sortList = this.sortList.concat(apiData.tableList)
          //   }
          // 回显排序信息
          if (apiData.options && apiData.options.sort) {
            this.sortData = {
              pivotschemaId: apiData.options.sort.id,
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
    ...mapGetters(['currSelected', 'currentSelected']),
    chartType() {
      return this.currSelected ? this.currSelected.setting.type : ''
    }
  },
  methods: {
    ...mapActions(['saveScreenData', 'handleRefreshData', 'updateChartData']),
    // 排序筛选字段选择
    sortFileChange(val) {
      if (!val || (val && this.sortData.asc === undefined)) {
        this.sortData.asc = ''
      }
      let data = this.sortList.filter(item => item.id === val)
      data[0].asc = this.sortData.asc

      let options = {
        sort: data[0]
      }
      this.apiData.options = { ...this.apiData.options, ...options }
      this.$store.dispatch('SetSelfDataSource', this.apiData)
      if (this.currSelected.setting.name === 've-tables') {
        this.$refs.table.getData()
      } else {
        this.$refs.child.getData()
      }
    },
    onRadioChange(e, data, key) {
      this.$set(data, key, e.target.value)
      // 切换页签清空对应数据
      if (key === 'fillType' && e.target.value === 'area') {
        this.$refs.fillDi.clearData()
      }
      if (key === 'fillType' && e.target.value === 'dot') {
        this.$refs.labelDi.clearData()
      }
      if (key === 'labelType' && e.target.value === 'area') {
        this.$refs.fillMe.clearData()
      }
      if (key === 'labelType' && e.target.value === 'dot') {
        this.$refs.labelMe.clearData()
      }
      this.updateChartData()
    },
    // 排序类型 升序 降序
    ascChange() {
      if (this.sortData.pivotschemaId) {
        this.apiData.options.sort.asc = this.sortData.asc
        this.$store.dispatch('SetSelfDataSource', this.apiData)
        if (this.currSelected.setting.name === 've-tables') {
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
      this.apiData.refresh = this.refresh
      this.$store.dispatch('SetSelfDataSource', this.apiData)
      this.updateChartData()
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
      this.apiData.refresh = this.refresh
      this.$store.dispatch('SetSelfDataSource', this.apiData)
      this.updateChartData()
      this.setTimer()
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
      this.apiData.refresh = this.refresh
      this.$store.dispatch('SetSelfDataSource', this.apiData)
      this.updateChartData()
      this.setTimer()
    },
    reset() {
      this.refresh.frequency = 1
      this.refresh.unit = undefined
    },
    // 单个图表的定时器设置
    setTimer() {
      this.$emit('setChartTimer', this.currentSelected)
    }
  }
}
</script>

<style></style>

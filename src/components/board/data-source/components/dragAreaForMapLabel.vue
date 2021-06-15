<template>
  <div
    class="dragArea"
    :class="{
      'dragable-vaild': isdrag
    }"
    @drop.stop.prevent="handleDropOnFilesWD($event)"
    @dragover.stop.prevent
    @dragenter="dragenter"
    @dragleave="dragleave"
  >
    <div v-if="fileList.length > 0">
      <div
        :class="['field', { error: item.status === 1 }]"
        v-for="(item, index) in fileList"
        :key="index"
        @contextmenu.prevent="showMore(item)"
      >
        <a-dropdown :trigger="['click', 'contextmenu']" v-model="item.showMore">
          <a-icon class="icon-more" type="caret-down" />
          <a-menu slot="overlay">
            <a-sub-menu
              key="1"
              title="聚合方式"
              v-show="item.file === 'labelMeasures'"
            >
              <a-menu-item
                v-for="(aggregator, index) in polymerizationData"
                :key="index"
                @click.native="changePolymerization(aggregator, item)"
                >{{ aggregator.name }}</a-menu-item
              >
            </a-sub-menu>
            <a-menu-item key="3" @click.native="deleteFile(item, index)"
              >移除</a-menu-item
            >
          </a-menu>
        </a-dropdown>
        <a-tooltip :title="item.alias">
          <span ref="itemName" class="field-text">{{ item.alias }}</span>
        </a-tooltip>
      </div>
    </div>
    <div class="empty" :class="{ field: isdrag }">
      {{
        labelType === 'dot'
          ? emptyText['dotMeasure'][fileList.length]
          : emptyText[type]
      }}
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { deepClone } from '@/utils/deepClone'
import { sum, summary } from '@/utils/summaryList'
import geoJson from '@/utils/guangdong.json'
import reverseAddressResolution from '@/utils/reverseAddressResolution'
const dotSeries = {
  type: 'scatter', // scatter,effectScatter
  name: '人口',
  coordinateSystem: 'geo',
  symbol: 'circle',
  symbolSize: 10,
  //   aspectScale: 0.75,
  hoverAnimation: true,
  showEffectOn: 'render',
  rippleEffect: {
    brushType: 'stroke',
    scale: 3
  },
  label: {
    show: false,
    // formatter: '{b} ：{c}',
    formatter: function(params) {
      return params.data.value[2].toFixed(2)
    },
    fontSize: 12,
    position: 'right', // 可选inside
    emphasis: {
      show: true
    }
  },
  itemStyle: {
    emphasis: {
      borderColor: '#fff',
      borderWidth: 1
    }
  },
  zlevel: 1
}

export default {
  props: {
    type: {
      type: String,
      default: ''
    }, // 区域类型 维度/度量
    labelType: {
      type: String,
      default: ''
    } // 标记点:区域/经纬度
  },
  data() {
    return {
      current: {},
      selected: {},
      emptyText: {
        dimensions: '拖入维度',
        measures: '拖入度量',
        dotMeasure: ['拖入经度', '拖入纬度', '拖入度量']
      },
      polymerizationData: [
        { name: '求和', value: 'SUM' },
        { name: '平均', value: 'AVG' },
        { name: '最大值', value: 'MAX' },
        { name: '最小值', value: 'MIN' },
        { name: '统计', value: 'CNT' }
      ],
      isdrag: false, // 是否拖拽中
      fileList: [], // 维度字段数组
      isVaild: false, //
      polymerizeType: [
        { name: '求和', value: 'SUM' },
        { name: '平均', value: 'AVG' },
        { name: '最大值', value: 'MAX' },
        { name: '最小值', value: 'MIN' }
      ] // 聚合方式
    }
  },
  inject: ['errorFile', 'initTargetMeasure'],
  watch: {
    currSelected: {
      handler(val) {
        if (val) {
          // 当前选中的图表显示维度度量的数据
          this.fileList = []
          if (
            this.type === 'dimensions' &&
            val.setting.api_data.labelDimensions
          ) {
            // 维度
            this.fileList = deepClone(val.setting.api_data.labelDimensions)
          }
          if (this.type === 'measures' && val.setting.api_data.labelMeasures) {
            // 度量
            this.fileList = deepClone(val.setting.api_data.labelMeasures)
          }
        }
      },
      deep: true,
      immediate: true
    },
    errorFile: {
      handler(val) {
        if (val) {
          if (this.type === 'dimensions' && this.fileList) {
            // 维度
            this.fileList.forEach(file => {
              let dimension = val.labelDimensions.find(
                item => item.alias === file.alias
              )
              if (dimension && dimension.status === 1) {
                file.status = dimension.status
              }
            })
          }
          if (this.type === 'measures' && this.fileList) {
            // 度量
            this.fileList.forEach(file => {
              let measure = val.labelMeasures.find(
                item => item.alias === file.alias
              )
              if (measure && measure.status === 1) {
                file.status = measure.status
              }
            })
          }
        }
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    ...mapGetters([
      'dragFile',
      'currentSelected',
      'currSelected',
      'optionsTabsType',
      'dataModel',
      'canvasMap'
    ])
  },
  methods: {
    ...mapActions(['saveScreenData', 'updateChartData']),
    // 切换labelType清空数据
    clearData() {
      // 清空显示列表
      this.fileList = []
      // 清空维度度量
      this.$set(this.currSelected.setting.api_data, 'labelDimensions', [])
      this.$set(this.currSelected.setting.api_data, 'labelMeasures', [])
      // 清空标记点图表数据
      let config = this.currSelected.setting.config
      this.$set(
        this.currSelected.setting.config,
        'series',
        (config.series = config.series.filter(item => item.type === 'map'))
      )
    },
    // 将拖动的维度到所选择的放置目标节点中
    handleDropOnFilesWD(event) {
      // h5 api
      let dataFile = JSON.parse(event.dataTransfer.getData('dataFile'))
      if (
        this.currSelected.datamodelId &&
        this.currSelected.datamodelId !== '0' &&
        this.currSelected.datamodelId !== dataFile.screenTableId
      ) {
        this.$message.error('一个图表只能拖入一个数据模型的字段')
        this.isdrag = false
        return false
      }
      dataFile.showMore = false // 是否点击显示更多
      if (this.type === 'dimensions' && this.dragFile === this.type) {
        // 维度暂时只能拉入一个字段
        this.fileList[0] = dataFile
        this.fileList = this.uniqueFun(this.fileList, 'alias')
        this.getData()
      }
      // 度量
      if (this.type === 'measures' && this.dragFile === this.type) {
        // 区域一个维度一个度量，经纬度度量经度维度值
        if (
          this.labelType === 'area' ||
          (this.labelType === 'dot' && this.fileList.length < 2)
        ) {
          this.fileList.push(dataFile)
        }
        this.fileList = this.uniqueFun(this.fileList, 'alias')
        this.getData()
      }
      this.isdrag = false
    },
    // 对象数组去重,type表示对象里面的一个属性
    uniqueFun(arr, type) {
      const res = new Map()
      return arr.filter(a => !res.has(a[type]) && res.set(a[type], 1))
    },
    // 当可拖动的元素进入可放置的目标时
    dragenter(event) {
      event.preventDefault()
      this.isdrag = true
    },
    // 当拖动元素离开可放置目标节点
    dragleave(event) {
      event.preventDefault()
      this.isdrag = false
    },
    // 点击右键显示更多
    showMore(item) {
      item.showMore = true
    },
    // 修改数据聚合方式
    changePolymerization(i, item) {
      item.showMore = false
      item.alias = item.alias.replace(/\(.*?\)/, '(' + i.name + ')')
      item.defaultAggregator = i.value
      this.getData()
    },
    // 抓取区中心点
    getCenterCoordinate(name) {
      let dataList = geoJson.features
      let countryside = dataList.find(item => item.properties.name === name)
      if (!countryside) {
        return null
      }
      return countryside.properties.center
    },
    // 删除当前维度或者度量
    deleteFile(item, index) {
      this.fileList.splice(index, 1)
      this.getData()
      let current = deepClone(this.currSelected)
      // 重置地图样式配置对应的度量数据
      this.initTargetMeasure()
      if (
        current.setting.api_data.labelDimensions.length === 0 &&
        current.setting.api_data.labelMeasures.length === 0
      ) {
        // 清空数据
        delete current.setting.api_data.source
        this.$store.dispatch('SetSelfDataSource', current.setting.api_data)
        current.series = current.series.filter(item => item.type === 'map')
        this.$store.dispatch('SetSelfDataSource', current.setting.api_data)
        this.$store.dispatch('SetSelfProperty', current.setting.config)
        this.updateChartData()
      }
    },
    // 根据维度度量获取数据
    async getData() {
      let selected = this.canvasMap.find(
        item => item.id === this.currentSelected
      )
      // 维度
      if (this.type === 'dimensions') {
        selected.setting.api_data.labelDimensions = this.fileList
      }
      // 度量
      if (this.type === 'measures') {
        selected.setting.api_data.labelMeasures = this.fileList
      }

      if (
        (!selected.datamodelId || selected.datamodelId === '0') &&
        this.fileList.length > 0
      ) {
        // modelId 赋值
        selected.datamodelId = this.fileList[0].screenTableId
        selected.setting.api_data.modelId = parseInt(
          this.fileList[0].screenTableId
        )
        selected.setting.resourceType = this.fileList[0].resourceType
      }
      this.updateChartData()

      let apiData = deepClone(this.currSelected.setting.api_data)
      // 区域需要纬度度量
      if (this.labelType === 'area') {
        if (
          apiData.labelDimensions.length === 0 &&
          apiData.labelMeasures.length === 0
        ) {
          selected.datamodelId = 0
          selected.setting.api_data.modelId = 0
          selected.setting.isEmpty = false
          selected.setting.resourceType = ''
          this.updateChartData()
          return
        }
        if (
          apiData.labelDimensions.length === 0 ||
          apiData.labelMeasures.length === 0
        ) {
          return
        }
        if (
          apiData.labelDimensions.some(item => item.status === 1) ||
          apiData.labelMeasures.some(item => item.status === 1)
        ) {
          return
        }
      } else {
        // 经纬度只需要度量
        if (apiData.labelMeasures.length === 0) {
          selected.datamodelId = 0
          selected.setting.api_data.modelId = 0
          selected.setting.isEmpty = false
          selected.setting.resourceType = ''
          this.updateChartData()
          return
        }
        if (apiData.labelMeasures.some(item => item.status === 1)) {
          return
        }
      }

      let params = deepClone(selected)
      let res = ''
      // 经纬度类型只有三个度量，传参的时候改图标type = 2
      if (this.labelType === 'dot') {
        params.type = 2
      }
      if (
        apiData.labelMeasures[0] &&
        apiData.labelMeasures[0].resourceType === 8
      ) {
        res = await this.$server.screenManage.getData(params)
      } else {
        res = await this.$server.screenManage.getDataForSource(params)
      }
      selected.setting.isEmpty = false
      // 数据源被删掉
      if (res.code === 500 && res.msg === 'IsChanged') {
        selected.setting.isEmpty = true
        this.updateChartData()
        return
      }
      if (res.code === 200) {
        let config = deepClone(this.currSelected.setting.config)
        let legend = []
        // 重置series
        config.series = config.series.filter(item => item.type === 'map')
        // 类型为区域
        if (this.labelType === 'area') {
          // 只有一个维度，唯一名称
          let alias = apiData.labelDimensions[0].alias
          // 一个度量对应一个series.data
          apiData.labelMeasures.forEach((measure, index) => {
            legend.push(measure.alias)
            let data = []
            for (let item of res.rows) {
              // 抓取区域坐标
              let center = this.getCenterCoordinate(item[alias])
              // 找不到对应坐标跳过
              if (!center) {
                continue
              }
              data.push({
                name: item[alias],
                value: center.concat(item[measure.alias]) // 链接数组，坐标和值
              })
            }
            config.series.push(
              Object.assign(dotSeries, { data, name: measure.alias })
            )
          })
        } else {
          let measures = apiData.labelMeasures.map(item => item.alias)
          legend.push(measures[2])
          // 解析数据，获取经度，纬度，目标值
          let data = res.rows[0]
          // 获取位置信息
          let res = reverseAddressResolution([
            data[measures[0]],
            data[measures[1]]
          ])
          config.series.push(
            Object.assign(dotSeries, {
              data: [
                {
                  name: res.direct,
                  value: Object.values(data)
                }
              ],
              name: measures[2]
            })
          )
        }
        config.legend.data = legend
        apiData.data = datas
        this.$store.dispatch('SetSelfProperty', config)
        this.$store.dispatch('SetSelfDataSource', apiData)
        this.updateChartData()
      } else {
        this.$message.error(res.msg)
      }
    }
  }
}
</script>

<style></style>

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
              v-show="item.file === 'measures'"
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
      {{ emptyText[type] }}
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { deepClone } from '@/utils/deepClone'
import { sum, summary } from '@/utils/summaryList'
import geoJson from '@/utils/guangdong.json'

export default {
  props: {
    type: {
      type: String,
      default: ''
    } // 区域类型 维度/度量
  },
  data() {
    return {
      current: {},
      selected: {},
      emptyText: {
        dimensions: '拖入维度',
        measures: '拖入度量',
        filter: '拖入字段',
        tableList: '拖入字段'
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
          // 维度度量都需要
          if (this.chartType === '1') {
            if (this.type === 'dimensions' && val.setting.api_data.dimensions) {
              // 维度
              this.fileList = deepClone(val.setting.api_data.dimensions)
            }
            if (this.type === 'measures' && val.setting.api_data.measures) {
              // 度量
              this.fileList = deepClone(val.setting.api_data.measures)
            }
          }

          // 只需要度量
          if (this.chartType === '2') {
            if (this.type === 'measures' && val.setting.api_data.measures) {
              this.fileList = deepClone(val.setting.api_data.measures)
            }
          }

          // 表格不区分维度跟度量
          if (this.chartType === '3') {
            if (this.type === 'tableList' && val.setting.api_data.tableList) {
              this.fileList = deepClone(val.setting.api_data.tableList)
            }
          }
        }
      },
      deep: true,
      immediate: true
    },
    errorFile: {
      handler(val) {
        if (val) {
          // 维度度量都需要
          if (this.chartType === '1') {
            if (this.type === 'dimensions' && this.fileList) {
              // 维度
              this.fileList.forEach(file => {
                let dimension = val.dimensions.find(
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
                let measure = val.measures.find(
                  item => item.alias === file.alias
                )
                if (measure && measure.status === 1) {
                  file.status = measure.status
                }
              })
            }
          }

          // 只需要度量
          if (this.chartType === '2') {
            if (this.type === 'measures' && this.fileList) {
              this.fileList.forEach(file => {
                let measure = val.measures.find(
                  item => item.alias === file.alias
                )
                if (measure && measure.status === 1) {
                  file.status = measure.status
                }
              })
            }
          }

          // 表格不区分维度跟度量
          if (this.chartType === '3') {
            if (this.type === 'tableList' && this.fileList) {
              let list = val.dimensions.concat(val.measures)
              this.fileList.forEach(file => {
                let li = list.find(item => item.alias === file.alias)
                if (li && li.status === 1) {
                  file.status = li.status
                }
              })
            }
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
    ]),
    chartType() {
      return this.currSelected ? this.currSelected.setting.type : ''
    }
  },
  methods: {
    ...mapActions(['saveScreenData', 'updateChartData']),
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
        // 嵌套饼图可以有多个维度
        if (this.currSelected.setting.chartType === 'v-multiPie') {
          this.fileList.push(dataFile)
        } else {
          // 维度暂时只能拉入一个字段
          this.fileList[0] = dataFile
        }
        this.fileList = this.uniqueFun(this.fileList, 'alias')
        this.getData()
      }
      // 度量
      if (
        this.type === 'measures' &&
        this.dragFile === this.type &&
        this.chartType === '1'
      ) {
        // 饼图类型只能拉入一个度量
        if (this.currSelected.setting.name === 've-pie') {
          this.fileList[0] = dataFile
        } else if (this.currSelected.setting.name === 've-map') {
          // 地图类型暂时只能拉入一个度量
          this.fileList[0] = dataFile
        } else {
          this.fileList.push(dataFile)
        }
        this.fileList = this.uniqueFun(this.fileList, 'alias')
        this.getData()
      }
      // 表格
      if (this.type === 'tableList') {
        this.fileList.push(dataFile)
        this.fileList = this.uniqueFun(this.fileList, 'alias')
        this.getData()
      }
      // 仪表盘/环形图
      if (
        this.chartType === '2' &&
        this.type === 'measures' &&
        this.dragFile === this.type
      ) {
        // 进度条只有一个度量
        if (this.currSelected.setting.name === 'steepBar') {
          this.fileList[0] = dataFile
        } else {
          if (this.currSelected.setting.chartType === 'v-text') {
            dataFile.alias = dataFile.alias + '(求和)'
          }
          if (this.fileList.length < 2) {
            this.fileList.push(dataFile)
          }
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
      // 维度度量删除完以后重置该图表数据
      if (this.chartType === '1' || this.chartType === '2') {
        if (current.setting.chartType === 'v-map') {
          // 重置地图样式配置对应的度量数据
          this.initTargetMeasure()
        }
        if (
          current.setting.api_data.dimensions.length === 0 &&
          current.setting.api_data.measures.length === 0
        ) {
          // 清空数据
          delete current.setting.api_data.source
          this.$store.dispatch('SetSelfDataSource', current.setting.api_data)
          // 地图数据还原
          if (current.setting.chartType === 'v-map') {
            current.setting.api_data.data = [[]]
            current.setting.config.series[0].data = [[]]
            this.$store.dispatch('SetSelfDataSource', current.setting.api_data)
            this.$store.dispatch('SetSelfProperty', current.setting.config)
            this.updateChartData()
          }
          // 嵌套饼图apis恢复原始状态
          if (current.setting.chartType === 'v-multiPie') {
            let apis = {
              level: [['1/1', '1/2', '1/3'], ['1/4', '1/5']]
            }
            this.$store.dispatch('SetApis', apis)
          }
        }
        // 如果是仪表盘，第二个度量是目标值（进度条最大值）,重置进度条范围
        if (current.setting.chartType === 'v-gauge') {
          current.setting.config.series.max = 100
          this.$store.dispatch('SetSelfProperty', current.setting.config)
        }
        // 环形重置显示值
        if (current.setting.chartType === 'v-ring') {
          current.setting.config.chartTitle.text = '70%'
          this.$store.dispatch('SetSelfProperty', current.setting.config)
        }
      }
      if (this.chartType === '3') {
        if (current.setting.api_data.tableList.length === 0) {
          // current.setting.api_data.modelId = ''
          this.$store.dispatch('SetSelfDataSource', current.setting.api_data)
        }
      }
    },
    // 根据维度度量获取数据
    async getData() {
      let selected = this.canvasMap.find(
        item => item.id === this.currentSelected
      )
      // 维度
      if (this.type === 'dimensions') {
        selected.setting.api_data.dimensions = this.fileList
      }
      // 度量
      if (this.type === 'measures') {
        selected.setting.api_data.measures = this.fileList
      }
      // 表格
      if (this.type === 'tableList') {
        // 不区分默认都放在维度
        let di = []
        let me = []
        this.fileList.forEach(item => {
          if (item.file === 'dimensions') {
            di.push(item)
          }
          if (item.file === 'measures') {
            me.push(item)
          }
        })
        selected.setting.api_data.dimensions = di
        selected.setting.api_data.measures = me
        selected.setting.api_data.tableList = this.fileList
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

      let data = this.currSelected.setting.api_data
      if (this.chartType === '1') {
        if (data.dimensions.length === 0 && data.measures.length === 0) {
          selected.datamodelId = 0
          selected.setting.api_data.modelId = 0
          selected.setting.isEmpty = false
          selected.setting.resourceType = ''
          this.updateChartData()
          return
        }
        if (data.dimensions.length === 0 || data.measures.length === 0) {
          return
        }
        if (
          data.dimensions.some(item => item.status === 1) ||
          data.measures.some(item => item.status === 1)
        ) {
          return
        }
      }
      if (this.chartType === '2') {
        if (data.measures.length === 0) {
          selected.datamodelId = 0
          selected.setting.api_data.modelId = 0
          selected.setting.isEmpty = false
          selected.setting.resourceType = ''
          this.updateChartData()
          return
        }
        if (data.measures.some(item => item.status === 1)) {
          return
        }
      }
      if (this.chartType === '3') {
        if (data.tableList.length === 0) {
          selected.datamodelId = 0
          selected.setting.api_data.modelId = 0
          selected.setting.isEmpty = false
          selected.setting.resourceType = ''
          this.updateChartData()
          return
        }
        if (data.tableList.some(item => item.status === 1)) {
          return
        }
      }

      let params = selected
      let apiData = deepClone(this.currSelected.setting.api_data)
      let res = ''
      if (
        (apiData.measures[0] && apiData.measures[0].resourceType === 8) ||
        apiData.tableList[0].resourceType === 8
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
        if (this.currSelected.setting.chartType === 'v-map') {
          let config = deepClone(this.currSelected.setting.config)
          let legend = []
          let datas = []
          // 重置series
          config.series = [config.series[0]]
          // 只有一个维度，唯一名称
          let alias = apiData.dimensions[0].alias
          // 一个度量对应一个series.data
          apiData.measures.forEach((measure, index) => {
            // 添加series
            if (index > 0) {
              config.series[index] = Object.assign({}, config.series[0])
            }
            config.series[index].name = measure.alias
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
            config.series[index].data = data
            datas.push(data)
          })
          config.legend.data = legend
          apiData.data = datas
          this.$store.dispatch('SetSelfProperty', config)
          this.$store.dispatch('SetSelfDataSource', apiData)
          this.updateChartData()
          return
        }
        if (this.currSelected.setting.chartType === 'v-text') {
          let config = deepClone(this.currSelected.setting.config)
          let str = ''
          for (let item of this.fileList) {
            str += res.rows[0][item.alias] + ' '
          }
          config.title.content = str
          this.$store.dispatch('SetSelfProperty', config)
        }
        if (this.type === 'tableList') {
          let columns = []
          for (let item of this.fileList) {
            columns.push({
              title: item.alias,
              dataIndex: item.alias,
              key: item.alias
            })
          }
          let rows = res.rows
          if (rows.length > 10) {
            rows.length = 10
          }
          apiData.source = {
            columns,
            rows
          }
          this.$store.dispatch('SetSelfDataSource', apiData)
        } else {
          // 仪表盘/环形图 只显示度量
          if (this.chartType === '2') {
            let columns = ['type', 'value'] // 维度固定
            for (let m of apiData.measures) {
              columns.push(m.alias) // 默认columns第二项起为指标
            }
            // 对返回的数据列进行求和
            let total = sum(res.rows, apiData.measures[0].alias)
            let rows = [
              {
                type: apiData.measures[0].alias,
                value: total
              }
            ]
            // 环形图第二度量(指针值)
            if (
              this.currSelected.setting.chartType === 'v-ring' &&
              apiData.measures[1]
            ) {
              let currentTotal = sum(res.rows, apiData.measures[1].alias)
              rows[0] = {
                type: apiData.measures[1].alias,
                value: currentTotal
              }
              rows.push({
                type: apiData.measures[0].alias,
                value: total - currentTotal
              })
            }
            apiData.source = {
              columns,
              rows
            }
            // 保存apidata数据
            this.$store.dispatch('SetSelfDataSource', apiData)
            let config = deepClone(this.currSelected.setting.config)
            if (this.currSelected.setting.chartType === 'v-ring') {
              config.chartTitle.text = rows[1] ? rows[1].value : rows[0].value
              this.$store.dispatch('SetSelfProperty', config)
            }
            // 如果是仪表盘，第二个度量是目标值（进度条最大值）
            if (
              this.currSelected.setting.chartType === 'v-gauge' &&
              apiData.measures[1]
            ) {
              let goalTotal = sum(res.rows, apiData.measures[1].alias)
              config.series.max = goalTotal
              this.$store.dispatch('SetSelfProperty', config)
            }
            this.updateChartData()
            return
          }

          let columns = []
          let rows = []
          let dimensionKeys = [] // 度量key
          for (let m of apiData.dimensions) {
            dimensionKeys.push(m.alias)
            columns.push(m.alias) // 默认columns第二项起为指标
          }

          let measureKeys = [] // 度量key
          for (let m of apiData.measures) {
            measureKeys.push(m.alias)
            columns.push(m.alias) // 默认columns第二项起为指标
          }

          // 嵌套饼图设置apis
          if (this.currSelected.setting.chartType === 'v-multiPie') {
            // name是各维度数据拼接，value是分类汇总过的数值
            columns = ['name', 'value']
            let result = res.rows
            let level = []
            // 一个维度是一层饼
            dimensionKeys.forEach(item => {
              // 根据当前维度分类得到的列表
              let list = summary(result, item, measureKeys[0]) // 嵌套饼图度量只有一个，直接取第一个数
              rows = rows.concat(list) // 把所有维度分类出来的数组进行拼接（v-charts配置格式要求）

              level.push(list.map(obj => obj.name)) // 按维度分层
            })

            let apis = {
              level
            }
            this.$store.dispatch('SetApis', apis)
          } else {
            res.rows.map((item, index) => {
              let obj = {}
              for (let item2 of dimensionKeys) {
                obj[item2] = item[item2]
              }
              obj[dimensionKeys] = item[dimensionKeys]
              for (let item2 of measureKeys) {
                obj[item2] = item[item2]
              }
              // if (obj[dimensionKeys]) {
              rows.push(obj)
              // }
            })
          }

          apiData.source = {
            columns,
            rows
          }
          this.$store.dispatch('SetSelfDataSource', apiData)
        }
        this.updateChartData()
      } else {
        this.$message.error(res.msg)
      }
    }
  }
}
</script>

<style></style>

<template>
  <div
    class="dragArea"
    :class="{
      'dragable-vaild': type === dragFile || (isdrag && type === 'tableList')
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
          <a-menu slot="overlay" @click="deleteFile(item, index)">
            <a-menu-item key="3">移除</a-menu-item>
          </a-menu>
        </a-dropdown>
        <a-tooltip :title="item.alias">
          <span ref="itemName" class="field-text">{{ item.alias }}</span>
        </a-tooltip>
      </div>
    </div>
    <div class="empty" :class="{ field: isdrag && type === dragFile }">
      {{ emptyText[type] }}
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { deepClone } from '@/utils/deepClone'
import { sum, summary } from '@/utils/summaryList'
import navigateList from '@/config/navigate' // 导航条菜单

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
      isdrag: false, // 是否拖拽中
      fileList: [], // 维度字段数组
      isVaild: false //
    }
  },
  inject: ['errorFile'],
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
        this.currSelected.datamodelId !== dataFile.datamodelId
      ) {
        this.$message.error('一个图表只能拖入一个数据模型的字段')
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
        // if (this.currSelected.setting.name === 've-pie') {
        //   this.fileList[0] = dataFile
        // } else {
        this.fileList.push(dataFile)
        // }
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
        // if (this.currSelected.setting.name === 've-pie') {
        //   this.fileList[0] = dataFile
        //   // 如果是仪表盘，需要两个度量
        // } else
        if (this.fileList.length < 2) {
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
    // 删除当前维度或者度量
    deleteFile(item, index) {
      this.fileList.splice(index, 1)
      this.getData()
      let current = deepClone(this.currSelected)
      // 维度度量删除完以后重置该图表数据
      if (this.chartType === '1' || this.chartType === '2') {
        if (
          current.setting.api_data.dimensions.length === 0 &&
          current.setting.api_data.measures.length === 0
        ) {
          // 清空modelid
          //   current.packageJson.api_data.modelId = ''
          this.$store.dispatch('SetSelfDataSource', current.setting.api_data)
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
          if (
            current.setting.api_data.measures.length === 0 &&
            current.setting.config.warningValue &&
            current.setting.api_data.rows[0].value >
              current.setting.config.warningValue
          ) {
            current.setting.config.series.axisLine.lineStyle.color[0][1] =
              '#DC143C'
          } else {
            current.setting.config.series.axisLine.lineStyle.color[0][1] =
              current.setting.config.selectedColor
          }
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
    getData() {
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
        selected.setting.api_data.dimensions = this.fileList
        selected.setting.api_data.tableList = this.fileList
      }

      if (
        (!selected.datamodelId || selected.datamodelId === '0') &&
        this.fileList.length > 0
      ) {
        // modelId 赋值
        selected.datamodelId = this.fileList[0].datamodelId
        // apiData.datamodelId = this.fileList[0].datamodelId
        // apiData.modelId = this.fileList[0].datamodelId
        selected.setting.api_data.modelId = parseInt(
          this.fileList[0].datamodelId
        )
      }
      this.updateChartData()

      let data = this.currSelected.setting.api_data
      if (this.chartType === '1') {
        if (data.dimensions.length === 0 && data.measures.length === 0) {
          selected.datamodelId = 0
          selected.setting.api_data.modelId = 0
          selected.setting.isEmpty = false
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
          this.updateChartData()
          return
        }
        if (data.tableList.some(item => item.status === 1)) {
          return
        }
      }

      let params = selected
      let apiData = deepClone(this.currSelected.setting.api_data)
      this.$server.screenManage.getData(params).then(res => {
        selected.setting.isEmpty = false
        // 数据源被删掉
        if (res.code === 500 && res.msg === 'IsChanged') {
          selected.setting.isEmpty = true
          this.updateChartData()
          return
        }
        if (res.code === 200) {
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
              if (this.currSelected.setting.chartType === 'v-gauge') {
                if (apiData.measures[1]) {
                  let goalTotal = sum(res.rows, apiData.measures[1].alias)
                  config.series.max = goalTotal
                }
                config.series.axisLine.lineStyle.color[0][1] =
                  total > config.series.max ||
                  (config.warningValue && total > config.warningValue)
                    ? '#DC143C'
                    : config.selectedColor
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
              console.log(apis)
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
              console.log(columns)
              console.log(rows)
            }

            apiData.source = {
              columns,
              rows
            }
            console.log(apiData)
            this.$store.dispatch('SetSelfDataSource', apiData)
          }
          this.updateChartData()
        } else {
          this.$message.error(res.msg)
        }
      })
    }
  }
}
</script>

<style></style>

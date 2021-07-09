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
          <a-menu slot="overlay">
            <a-sub-menu
              key="1"
              title="聚合方式"
              v-show="item.polymerizationShow"
            >
              <a-menu-item
                v-for="(aggregator, index) in item.polymerizationShow"
                :key="index"
                @click.native="changePolymerization(aggregator, item)"
                >{{ aggregator.name }}</a-menu-item
              >
            </a-sub-menu>
            <a-menu-item key="2" @click.native="changeAsc(item, 1)"
              >升序</a-menu-item
            >
            <a-menu-item key="3" @click.native="changeAsc(item, 2)"
              >降序</a-menu-item
            >
            <a-menu-item key="4" @click.native="deleteFile(item, index)"
              >移除</a-menu-item
            >
          </a-menu>
        </a-dropdown>
        <a-tooltip :title="item.alias">
          <span ref="itemName" class="field-text"
            ><icon-font
              style="font-weight:bolder"
              :type="item.asc === 1 ? 'icon-paixu-5' : 'icon-paixu-3'"
            />&nbsp;&nbsp;{{ item.alias }}</span
          >
        </a-tooltip>
      </div>
    </div>
    <div class="empty" :class="{ field: isdrag }">拖入字段</div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { deepClone } from '@/utils/deepClone'
import { sum, summary } from '@/utils/summaryList'
import navigateList from '@/config/navigate' // 导航条菜单
import _ from 'lodash'
import { Loading } from 'element-ui'
import { Icon } from 'ant-design-vue'
const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_2276651_mlklp2yb77i.js'
}) // 引入iconfont
export default {
  props: {
    type: {
      type: String,
      default: ''
    } // 区域类型 维度/度量
  },
  data() {
    return {
      isExist: false,
      screenVisible: false, // 弹窗显示
      listValue: '', // 列表模糊查询输入值
      manualValue: '', // 手动输入值
      checkAll: false, // 是否全选标识
      currentFile: {}, // 当前选中的维度/度量数据
      current: {},
      isdrag: false, // 是否拖拽中
      fileList: [], // 维度字段数组
      isVaild: false, //
      isEmpty: false, // 控制输入框边框样式，空输入变红
      polymerizationData: {
        numberType: [
          { name: '求和', value: 'SUM' },
          { name: '平均', value: 'AVG' },
          { name: '最大值', value: 'MAX' },
          { name: '最小值', value: 'MIN' },
          { name: '统计', value: 'CNT' }
        ],
        stringType: [
          { name: '计数', value: 'CNT' },
          { name: '去重计数', value: 'MIN' }
        ]
      }
    }
  },
  inject: ['errorFile'],
  components: {
    IconFont
  },
  watch: {
    currSelected: {
      handler(val) {
        if (val) {
          this.fileList = []
          // 当前选中的图表数据筛选的数据
          if (
            val.setting.api_data.options &&
            val.setting.api_data.options.sort
          ) {
            this.fileList = deepClone(val.setting.api_data.options.sort)
          }
        }
      },
      deep: true,
      immediate: true
    },
    errorFile: {
      handler(val) {
        if (val) {
          if (this.fileList) {
            let list = val.dimensions.concat(val.measures)
            this.fileList.forEach(file => {
              let li = list.find(item => item.alias === file.alias)
              if (li && li.status === 1) {
                file.status = li.status
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
    ]),
    chartType() {
      return this.currSelected ? this.currSelected.setting.type : ''
    }
  },
  methods: {
    ...mapActions(['saveScreenData', 'updateChartData']),
    // 将拖动的维度到所选择的放置目标节点中
    async handleDropOnFilesWD(event) {
      this.isExist = false
      let dataFile = JSON.parse(event.dataTransfer.getData('dataFile'))
      // 验证字段数值类型,非数值不能修改聚合方式
      let type = 'number'
      if (
        dataFile.resourceType === 3 &&
        dataFile.dataType !== 'BIGINT' &&
        dataFile.dataType !== 'DOUBLE'
      ) {
        type = 'string'
      }
      // 模型调接口判断
      if (dataFile.resourceType === 8) {
        let res = await this.$server.screenManage.getMeasureCheck(
          dataFile.pivotschemaId
        )
        if (res.code !== 200 || !res.data) {
          type = 'string'
        }
      }
      // 根据数值类型设置初值
      if (type === 'number') {
        dataFile.polymerizationShow = this.polymerizationData.numberType
        dataFile.alias += '(求和)'
        dataFile.defaultAggregator = 'SUM'
      } else {
        dataFile.alias += '(计数)'
        dataFile.polymerizationShow = this.polymerizationData.stringType
      }
      // 设置默认排序
      // 1：升序；2：降序
      dataFile.asc = 1

      if (
        this.currSelected.datamodelId &&
        this.currSelected.datamodelId !== '0' &&
        this.currSelected.datamodelId !== dataFile.screenTableId
      ) {
        this.$message.error('一个图表只能拖入一个数据模型的字段')
        this.isdrag = false
        return false
      }

      this.fileList.push(dataFile)
      this.fileList = this.uniqueFun(this.fileList, 'alias')
      //   this.fileList[0] = dataFile
      this.handleSort()

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
    async handleSort() {
      let apiData = deepClone(this.currSelected.setting.api_data)
      apiData.options = { ...apiData.options, sort: this.fileList }
      this.$store.dispatch('SetSelfDataSource', apiData)
      this.getData()
    },
    changeSortHandle(item, key) {},
    // 修改数据聚合方式
    changePolymerization(i, item) {
      item.showMore = false
      if (item.defaultAggregator === i.value) {
        return
      }
      item.alias = item.alias.replace(/\(.*?\)/, '(' + i.name + ')')
      item.defaultAggregator = i.value
      this.handleSort()
    },
    // 修改顺序
    changeAsc(item, asc) {
      item.showMore = false
      if (item.asc === asc) {
        return
      }
      item.asc = asc
      this.handleSort()
    },
    // 删除当前维度或者度量
    deleteFile(item, index) {
      this.fileList.splice(index, 1)
      this.handleSort()
    },
    // 根据维度度量获取数据
    async getData() {
      let apiData = deepClone(this.currSelected.setting.api_data)
      let type = this.currSelected.setting.type
      let selected = this.canvasMap.find(
        item => item.id === this.currentSelected
      )
      if (type === '1') {
        if (apiData.dimensions.length === 0 || apiData.measures.length === 0) {
          return
        }
        if (
          apiData.dimensions.some(item => item.status === 1) ||
          apiData.measures.some(item => item.status === 1)
        ) {
          return
        }
      }
      if (type === '2') {
        if (apiData.measures.length === 0) {
          return
        }
        if (apiData.measures.some(item => item.status === 1)) {
          return
        }
      }
      if (type === '3') {
        if (apiData.tableList.length === 0) {
          return
        }
        if (apiData.tableList.some(item => item.status === 1)) {
          return
        }
      }

      this.updateChartData()
      let loadingInstance = Loading.service({
        lock: true,
        text: '加载中...',
        target: 'body',
        background: 'rgb(255, 255, 255, 0.6)'
      })
      let res = await this.$server.screenManage.getData(selected)
      loadingInstance.close()
      selected.setting.isEmpty = false
      // 数据源被删掉
      if (res.code === 500 && res.msg === 'IsChanged') {
        selected.setting.isEmpty = true
        this.updateChartData()
        return
      }
      if (res.code === 200) {
        // 查不到数据
        if (res.rows.length === 0) {
          // 清空数据
          apiData.source.columns = []
          apiData.source.rows = []
          this.$store.dispatch('SetSelfDataSource', apiData)
          this.updateChartData()
          return
        }
        let datas = res.rows
        // 去掉排序的数据
        if (apiData.options.sort.length) {
          let filterArr = []
          apiData.options.sort.forEach(item => {
            filterArr.push(`sort_${item.alias}`)
          })
          datas = datas.map(item => _.omit(item, filterArr))
        }
        if (this.currSelected.setting.chartType === 'v-tables') {
          let columns = []
          apiData.tableList.forEach(item => {
            columns.push({
              title: item.alias,
              dataIndex: item.alias,
              key: item.alias
            })
          })
          let rows = datas
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
            let total = sum(datas, apiData.measures[0].alias)
            let rows = [
              {
                type: apiData.measures[0].alias,
                value: total
              }
            ]
            // 环形图
            if (this.currSelected.setting.chartType === 'v-ring') {
              let keys = apiData.measures.map(measure => measure.alias)
              // 当前值段
              rows = [
                {
                  type: keys[0],
                  value: datas[0][keys[0]]
                }
              ]
              // 剩余段,目标值-当前值
              rows.push({
                type: keys[1],
                value: datas[0][keys[1]] - rows[0].value
              })
              let config = this.currSelected.setting.config
              config.chartTitle.text = rows[0].value
              this.$store.dispatch('SetSelfProperty', config)
            }
            apiData.source = {
              columns,
              rows
            }
            // 保存apidata数据
            this.$store.dispatch('SetSelfDataSource', apiData)
            let config = deepClone(this.currSelected.setting.config)
            if (this.currSelected.setting.chartType === 'v-multiPie') {
              config.chartTitle.text = rows[0].value
              this.$store.dispatch('SetSelfProperty', config)
            }
            // 如果是仪表盘，第二个度量是目标值（进度条最大值）
            if (
              this.currSelected.setting.chartType === 'v-gauge' &&
              apiData.measures[1]
            ) {
              let goalTotal = sum(datas, apiData.measures[1].alias)
              config.series.max = goalTotal
              this.$store.dispatch('SetSelfProperty', config)
            }
            //   this.updateChartData()
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
            let level = []
            // 一个维度是一层饼
            dimensionKeys.forEach(item => {
              // 根据当前维度分类得到的列表
              let list = summary(datas, item, measureKeys[0]) // 嵌套饼图度量只有一个，直接取第一个数
              rows = rows.concat(list) // 把所有维度分类出来的数组进行拼接（v-charts配置格式要求）

              level.push(list.map(obj => obj.name)) // 按维度分层
            })

            let apis = {
              level
            }
            console.log(apis)
            this.$store.dispatch('SetApis', apis)
          } else {
            datas.map((item, index) => {
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
            // 雷达图
            if (this.currSelected.setting.chartType === 'v-radar') {
              // 格式例子cloumns:[度量，青瓜，土豆，菜心]
              // rows:[{度量:度量1,青瓜，土豆，菜心},{度量2,青瓜，土豆，菜心}]
              let metricsName = apiData.dimensions[0].alias
              let newColumns = ['measure']
              let newRows = []
              apiData.measures.forEach(measure => {
                let measureName = measure.alias
                let obj = {}
                rows.forEach(row => {
                  newColumns.push(row[metricsName])
                  obj.measure = measureName
                  obj[row[metricsName]] = row[measureName]
                })
                newRows.push(obj)
              })

              columns = newColumns
              rows = newRows
            }
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

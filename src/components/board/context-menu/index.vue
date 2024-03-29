<template>
  <transition name="fade-in">
    <div
      class="dv-context-menu"
      v-if="contextMenuInfo.isShow"
      @mousedown.stop.prevent
      :style="contextMenuStyle"
      @click.stop.prevent
    >
      <div
        class="context-menu-item"
        v-for="item in menuList"
        :key="item.order"
        v-show="showMenu(item)"
        @mouseenter="item.showChildren = true"
        @mouseleave="item.showChildren = false"
        @click="handleCommand(item.order)"
      >
        <b-icon :name="item.icon"></b-icon>
        <span>{{ item.text }}</span>
        <div class="context-menu-item-children" v-if="item.showChildren">
          <div
            class="context-menu-item"
            v-for="(menu, i) in item.children"
            :key="menu.order"
            v-show="showMenu(menu)"
            @click.stop="handleCommand(menu.order, item, menu.key)"
          >
            <JsonExcel
              v-if="menu.order === 'toexcel'"
              :key="currentSelected ? currentSelected + 'index' + i : 0"
              :fetch="handleChartData"
              :name="handleFileName()"
              >{{ menu.text }}</JsonExcel
            >
            <span v-else>{{ menu.text }}</span>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import Vue from 'vue'
import JsonExcel from 'vue-json-excel'
import {
  exportImg,
  exportForFull,
  exportScreen,
  exportCsv
} from '@/utils/screenExport'
import handleReturnChartData from '@/utils/handleReturnChartData'
import { mapGetters, mapActions } from 'vuex'
import { Loading } from 'element-ui'
import chartTableData from '../chartTableData/index' // 右键菜单
import { deepClone } from '@/utils/deepClone'
import { message } from 'ant-design-vue'
const exportChartList = [
  {
    icon: 'ios-download',
    text: '导出',
    order: 'export',
    ignore: ['figure'],
    showChildren: false,
    children: [
      { text: 'excel', order: 'toexcel', ignore: ['ve-image', 'material'] },
      { text: 'csv', order: 'tocsv', ignore: ['ve-image', 'material'] },
      { text: '图片', order: 'exportImg' }
    ]
  }
]
const chartMenuList = [
  {
    icon: 'ios-download',
    text: '导出',
    order: 'export',
    ignore: ['figure'],
    showChildren: false,
    children: [
      { text: 'excel', order: 'toexcel', ignore: ['ve-image', 'material'] },
      { text: 'csv', order: 'tocsv', ignore: ['ve-image', 'material'] },
      { text: '图片', order: 'exportImg' }
    ]
  },
  { icon: 'ios-share', text: '置顶', order: 'top' },
  { icon: 'ios-download', text: '置底', order: 'bottom' },
  { icon: 'md-arrow-round-up', text: '上移一层', order: 'up' },
  { icon: 'md-arrow-round-down', text: '下移一层', order: 'down' },
  { icon: 'ios-copy', text: '复制', order: 'copy' },
  { icon: 'ios-trash', text: '删除', order: 'remove' }
]
const screenMenuList = [
  { icon: 'ios-share', text: '导出当前大屏', order: 'exportScreen' },
  { icon: 'ios-download', text: '取消', order: 'cancel' }
]

export default {
  name: 'ContextMenu',
  components: { JsonExcel },
  data() {
    return {
      menuList: [
        {
          icon: 'ios-share',
          text: '查看数据',
          order: 'showChartData',
          ignore: ['figure', 've-image', 'material']
        },
        ...chartMenuList
      ], // 菜单列表
      chartData: { rows: [] }, // 图表数据(按最后展示格式)
      chartDataForMap: null, // 同上(地图标记层)
      menuCompont: null,
      json_fields: null // 导出格式
    }
  },
  inject: ['showChartData'],
  watch: {
    'contextMenuInfo.listType'(val) {
      if (val) {
        const isMap =
          this.currSelected && this.currSelected.setting.chartType === 'v-map'
        const showTableData = isMap
          ? {
              icon: 'ios-share',
              text: '查看数据',
              order: 'showMapChartData',
              ignore: ['figure', 've-image', 'material'],
              showChildren: false,
              children: [
                {
                  text: '填充层',
                  order: 'showFillList',
                  key: 'fillList',
                  ignore: ['ve-image', 'material']
                },
                {
                  text: '标记层',
                  order: 'showLabelList',
                  key: 'labelList',
                  ignore: ['ve-image', 'material']
                }
              ]
            }
          : {
              icon: 'ios-share',
              text: '查看数据',
              order: 'showChartData',
              ignore: ['figure', 've-image', 'material']
            }
        if (val === 'exportChartList') {
          this.menuList = [showTableData, ...exportChartList]
        } else if (val === 'screenMenuList') {
          this.menuList = screenMenuList
        } else {
          this.menuList = [showTableData, ...chartMenuList]
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      'contextMenuInfo',
      'pageSettings',
      'canvasMap',
      'screenId',
      'currSelected',
      'currentSelected',
      'pageSettings',
      'canvasRange',
      'isScreen',
      'fileName',
      'polymerizeType',
      'pageList',
      'currentPageId'
    ]),
    contextMenuStyle() {
      let x =
        this.contextMenuInfo.x !== undefined
          ? parseInt(this.contextMenuInfo.x) > 0
            ? parseInt(this.contextMenuInfo.x)
            : 0
          : 0
      let y =
        this.contextMenuInfo.y !== undefined
          ? parseInt(this.contextMenuInfo.y) > 0
            ? parseInt(this.contextMenuInfo.y)
            : 0
          : 0
      let tmpObj = {}
      // 判断是否超出边界
      if (
        document.documentElement &&
        document.documentElement.clientHeight &&
        document.documentElement.clientWidth
      ) {
        let winHeight = document.documentElement.clientHeight
        let winWidth = document.documentElement.clientWidth
        if (x + 200 > winWidth) {
          tmpObj['right'] = '10px'
        } else {
          tmpObj['left'] = x + 'px'
        }
        if (y + 100 > winHeight) {
          tmpObj['bottom'] = '42px'
        } else {
          tmpObj['top'] = y + 'px'
        }
      }
      return tmpObj
    },
    chartName() {
      if (!this.currSelected) {
        return ''
      }
      return this.currSelected.setting.config.title
        ? this.currSelected.setting.config.title.content ||
            this.currSelected.setting.config.title.text
        : this.currSelected.setting.config.topTitle.content
    }
  },
  destroyed() {
    message.destroy()
  },
  methods: {
    ...mapActions(['deleteChartData']),
    // 处理文件导出的名称
    handleFileName() {
      const chartType = this.currSelected.setting.chartType
      if (chartType === 'v-sun' || chartType === 'v-heatmap') {
        return this.currSelected.setting.config.title.text
      } else if (chartType === 'v-ring') {
        return this.currSelected.setting.config.topTitle.content
      } else if (this.currSelected.setting.config.title.content) {
        return this.currSelected.setting.config.title.content
      } else {
        return this.currSelected.setting.title
      }
    },
    formatAggregator(item) {
      const fun = this.polymerizeType.find(
        x => x.value === item.defaultAggregator
      )
      if (item.role === 2) {
        return `${item.alias} (${fun.name})`
      } else {
        return item.alias
      }
    },
    // 控制是否显示菜单栏
    showMenu(item) {
      if (!this.contextMenuInfo.isShow) {
        return false
      }
      if (this.currSelected) {
        return (
          !item.ignore || !item.ignore.includes(this.currSelected.setting.name)
        )
      } else {
        return true
      }
    },
    //  执行菜单命令
    async handleCommand(order, item, mapKey) {
      if (item) {
        item.showChildren = false
      }
      if (order === 'export') {
        return
      }
      if (order === 'remove') {
        // 如果是删除操作则弹出一个对话框来确认
        // this.$EventBus.$emit('context/menu/delete')
        this.deleteOne()
      } else if (
        order === 'showChartData' ||
        order === 'showFillList' ||
        order === 'showLabelList'
      ) {
        this.$store.dispatch('ToggleContextMenu')
        // 查看/导出数据
        this.handleChartData('view', mapKey)
        this.readGraphInfo()
      } else if (order === 'tocsv') {
        const datas = await this.handleChartData()
        exportCsv(datas, null, this.handleFileName())
        this.exportGraph()
      } else if (order === 'exportImg') {
        this.$store.dispatch('ToggleContextMenu')
        if (this.isScreen && this.$route.name !== 'screenEdit') {
          exportForFull(this.currSelected, this.pageSettings)
        } else {
          exportImg(this.currSelected, this.pageSettings)
        }
        this.exportGraph()
      } else if (order === 'toexcel') {
        this.exportGraph()
      } else if (order === 'exportScreen') {
        this.$store.dispatch('ToggleContextMenu')
        this.exportScreen()
      } else {
        this.$store.dispatch('ContextMenuCommand', order)
      }
    },
    // 导出大屏数据
    exportScreen() {
      // 导出大屏数据
      exportScreen(this.fileName)

      // 记录日志
      let tabName = ''
      this.pageList.forEach(item => {
        if (this.currentPageId === item.id) {
          tabName = item.name
        }
      })
      let params = {
        screenName: this.fileName,
        tabName: tabName
      }
      this.$server.screenManage.actionExportScreen(params)
    },
    startDownload() {
      this.$message.info('正在导出')
    },
    finishDownload() {
      this.$message.info('导出成功')
    },
    // 删除图表
    deleteOne() {
      this.deleteChartData()
    },
    // 处理查看/导出数据
    async handleChartData(type, mapKey) {
      // 查看图表数据
      if (
        this.currSelected.setting.api_data.source ||
        (this.currSelected.setting.chartType === 'v-map' &&
          this.currSelected.setting.config.series.length)
      ) {
        let dataList = await this.setChartData_scan(mapKey)
        // 查看数据弹出展示窗
        if (type === 'view') {
          this.showChartData(this.chartData)
          return
        }
        return dataList
      } else {
        const elmNameMap = {
          catalog: '.dv-screen',
          screenEdit: '.screen-shot'
        }
        let dom = document.querySelector(elmNameMap[this.$route.name])
        message.config({
          getContainer: () => dom
        })
        message.error('该图表没有拖入图表数据')
      }
    },
    exportGraph() {
      // 导出数据 -- 记录日志
      let tabName = ''
      this.pageList.forEach(item => {
        if (this.currSelected.tabId === item.id) {
          tabName = item.name
        }
      })
      let params = {
        id: this.currSelected.id,
        type: this.currSelected.setting && this.currSelected.setting.chartType,
        screenName: this.fileName,
        tabName: tabName,
        graphName: this.currSelected.type
      }
      this.$server.screenManage.exportGraph(params)
    },
    readGraphInfo() {
      // 查看数据 -- 记录日志
      let tabName = ''
      this.pageList.forEach(item => {
        if (this.currSelected.tabId === item.id) {
          tabName = item.name
        }
      })
      let params = {
        id: this.currSelected.id,
        type: this.currSelected.setting && this.currSelected.setting.chartType,
        screenName: this.fileName,
        tabName: tabName,
        graphName: this.currSelected.type
      }
      this.$server.screenManage.readGraphInfo(params)
    },
    // 查看/导出数据 -- 构造数据
    async setChartData_scan(mapKey) {
      let tabName = ''
      this.pageList.forEach(item => {
        if (this.currSelected.tabId === item.id) {
          tabName = item.name
        }
      })
      let params = {
        id: this.currSelected.id,
        type: this.currSelected.setting && this.currSelected.setting.chartType,
        screenName: this.fileName,
        tabName: tabName,
        graphName: this.currSelected.type
      }
      let loadingInstance = Loading.service({
        lock: true,
        text: '加载中...',
        target: 'body',
        background: 'rgb(255, 255, 255, 0.6)'
      })
      let res = await this.$server.screenManage.getGraphInfo(params)
      loadingInstance.close()
      if (res.code !== 200) {
        this.$message.error(res.msg || '请重新操作')
        return
      }

      let source = res.data || []

      let columns = []
      let rows = []
      let tableName = []
      let exportList = []

      if (this.currSelected.setting.chartType === 'v-map') {
        if (mapKey) {
          let aliasKeys = this.handleTableColumns(
            Object.keys(source[mapKey][0]),
            mapKey
          )
          columns = aliasKeys
          let type = '填充'
          let row = []
          if (mapKey === 'fillList') {
            row = await handleReturnChartData(
              source[mapKey],
              this.currSelected.setting,
              false,
              aliasKeys.filter(item => item.role === 2)
            )
          } else if (mapKey === 'labelList') {
            row = await handleReturnChartData(
              source[mapKey],
              this.currSelected.setting,
              true,
              aliasKeys.filter(item => item.role === 2)
            )
          }
          rows = row
          let aliasObj = {}
          aliasKeys.forEach((alias, index) => {
            aliasObj['name' + index] = alias['colName']
          })
          let cunstomRow = source[mapKey].map(row => {
            let obj = {}
            aliasKeys.forEach((alias, index) => {
              obj['name' + index] = row[alias['colName']]
            })
            return obj
          })
          let titleRow = { name0: type, name1: '', name2: '' }
          cunstomRow = [titleRow, aliasObj].concat(cunstomRow)
          exportList = cunstomRow.concat(exportList)
        } else {
          await Promise.all(
            Object.keys(source).map(async item => {
              if (source[item]) {
                let aliasKeys = this.handleTableColumns(
                  Object.keys(source[item][0]),
                  item
                )
                columns.push(aliasKeys)
                let row = []
                if (item === 'fillList') {
                  row = await handleReturnChartData(
                    source[item],
                    this.currSelected.setting,
                    false,
                    aliasKeys.filter(item => item.role === 2)
                  )
                } else if (item === 'labelList') {
                  row = await handleReturnChartData(
                    source[item],
                    this.currSelected.setting,
                    true,
                    aliasKeys.filter(item => item.role === 2)
                  )
                }
                let type = item === 'fillList' ? '填充' : '标记点'
                rows.push(row)
                tableName.push(type)
                let aliasObj = {}
                aliasKeys.forEach((alias, index) => {
                  aliasObj[''.padEnd(index + 1, ' ')] = alias['colName']
                })
                let cunstomRow = source[item].map(row => {
                  let obj = {}
                  aliasKeys.forEach((alias, index) => {
                    obj[''.padEnd(index + 1, ' ')] = row[alias['colName']]
                  })
                  return obj
                })
                let titleRow = { ' ': type, '  ': '', '   ': '' }
                cunstomRow = [titleRow, aliasObj].concat(cunstomRow)
                exportList = cunstomRow.concat(exportList)
              }
            })
          )
        }
      } else {
        // 处理空数据
        columns = this.handleTableColumns(Object.keys(source[0]))
        source = await handleReturnChartData(
          source,
          this.currSelected.setting,
          false,
          columns.filter(item => item.role === 2)
        )
        rows = source
        exportList = source
      }
      this.chartData = {
        columns,
        rows,
        tableName
      }
      return exportList
    },
    // 处理表头, 按拖入的维度度量顺序排列
    handleTableColumns(keys, label) {
      const apiData = this.currSelected.setting.api_data
      let fieldList = []
      if (label && label === 'labelList') {
        // 地图 -- 标记点数据
        fieldList = []
          .concat(apiData.labelDimensions)
          .concat(apiData.labelMeasures)
      } else {
        fieldList = [].concat(apiData.dimensions).concat(apiData.measures)
      }
      const column = []
      fieldList.map(item => {
        // 数据库为NULL的字段现在不返回, 所以不能用第一行的keys初始化表头
        // if (keys.includes(item.alias)) {
        column.push({
          alias: item.alias,
          colName: this.formatAggregator(item),
          role: item.role
        })
        // }
      })
      return column
    }
  }
}
</script>

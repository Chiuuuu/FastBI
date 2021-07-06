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
        @mouseenter="item.showChildren = true"
        @mouseleave="item.showChildren = false"
        @click="handleCommand(item.order)"
      >
        <b-icon :name="item.icon"></b-icon>
        <span>{{ item.text }}</span>
        <div class="context-menu-item-children" v-show="item.showChildren">
          <div
            class="context-menu-item"
            v-for="(menu, i) in item.children"
            :key="menu.order"
            @click.stop="handleCommand(menu.order, item)"
          >
            <JsonExcel
              v-if="i < 2"
              :fetch="setChartData"
              :name="currSelected ? currSelected.name || 'test' : 'test'"
              :type="i === 0 ? 'xls' : 'csv'"
              >{{ menu.text }}</JsonExcel
            >
            <span v-if="i === 2">{{ menu.text }}</span>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import Vue from 'vue'
import JsonExcel from 'vue-json-excel'
import { exportImg, exportForFull, exportScreen } from '@/utils/exportImg'
import { mapGetters, mapActions } from 'vuex'
import { Loading } from 'element-ui'
import chartTableData from '../chartTableData/index' // 右键菜单
const exportChartList = [
  { icon: 'ios-share', text: '查看数据', order: 'showChartData' },
  {
    icon: 'ios-download',
    text: '导出',
    order: 'export',
    showChildren: false,
    children: [
      { text: 'excel', order: 'toexcel' },
      { text: 'csv', order: 'tocsv' },
      { text: '图片', order: 'exportImg' }
    ]
  }
]
const chartMenuList = [
  { icon: 'ios-share', text: '查看数据', order: 'showChartData' },
  {
    icon: 'ios-download',
    text: '导出',
    order: 'export',
    showChildren: false,
    children: [
      { text: 'excel', order: 'toexcel' },
      { text: 'csv', order: 'tocsv' },
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
      menuList: chartMenuList, // 菜单列表
      chartData: { rows: [] }, // 图表数据(按最后展示格式)
      chartDataForMap: null, // 同上(地图标记层)
      menuCompont: null
    }
  },
  inject: ['showChartData'],
  watch: {
    // currentSelected(val) {
    //   if (val) {
    //     this.setChartData()
    //   }
    // },
    'contextMenuInfo.listType'(val) {
      if (val) {
        this.menuList = eval(val)
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
      'fileName'
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
    }
  },
  methods: {
    ...mapActions(['saveScreenData', 'deleteChartData']),
    //  执行菜单命令
    handleCommand(order, item) {
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
      } else if (order === 'showChartData') {
        // 查看图表数据
        if (this.currSelected.setting.api_data.source) {
          this.setChartData()
          this.$store.dispatch('ToggleContextMenu')
          this.viewChartData()
        } else {
          this.$message.error('该图表没有拖入图表数据')
        }
      } else if (order === 'exportImg') {
        this.$store.dispatch('ToggleContextMenu')
        if (this.isScreen) {
          exportForFull(
            this.currentSelected,
            this.currSelected,
            this.pageSettings,
            this.canvasRange
          )
        } else {
          exportImg(
            this.currentSelected,
            this.currSelected,
            this.pageSettings,
            this.canvasRange
          )
        }
      } else if (order === 'exportScreen') {
        this.$store.dispatch('ToggleContextMenu')
        this.exportScreen()
      } else {
        this.$store.dispatch('ContextMenuCommand', order)
      }
    },
    // 查看数据
    viewChartData() {
      const _Menu = Vue.extend(chartTableData)
      this.menuCompont = new _Menu({
        propsData: {
          chartData: this.chartData
        }
      }).$mount()
      const currentParentName = this.isScreen ? '.dv-screen' : '.board-layout'
      document
        .querySelector(currentParentName)
        .appendChild(this.menuCompont.$el)
    },
    // 导出大屏数据
    exportScreen() {
      setTimeout(() => {
        exportScreen(this.screenId, this.fileName)
      }, 0)
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
    // 构造查看数据/导出表格
    setChartData() {
      if (!this.currSelected.setting.api_data.source) {
        this.$message.error('该图表没有拖入图表数据')
        return
      }
      let loadingInstance = Loading.service({
        lock: true,
        text: '加载中...',
        target: 'body',
        background: 'rgb(255, 255, 255, 0.6)'
      })
      let type = this.currSelected.setting.type
      if (this.currSelected.setting.chartType === 'v-map') {
        let fillrows = this.currSelected.setting.api_data.returnDataFill || []
        let labelrows = this.currSelected.setting.api_data.returnDataLabel || []
        if (fillrows.length) {
          this.chartData = { columns: Object.keys(fillrows[0]), fillrows }
        }
        if (labelrows.length) {
          this.chartDataForMap = {
            columns: Object.keys(labelrows[0]),
            labelrows
          }
        }
      } else if (type === '1') {
        this.chartData = this.currSelected.setting.api_data.source
      } else if (type === '2') {
        let rows = this.currSelected.setting.api_data.returnData
        this.chartData = { columns: Object.keys(rows[0]), rows }
      } else {
        let rows = this.currSelected.setting.api_data.source.rows
        this.chartData = { columns: Object.keys(rows[0]), rows }
      }
      loadingInstance.close()
      return this.chartData.rows
    }
  }
}
</script>

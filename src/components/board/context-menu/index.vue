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
            v-for="menu in item.children"
            :key="menu.order"
            @click.stop="handleCommand(menu.order)"
          >
            <span>{{ menu.text }}</span>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'ContextMenu',
  data() {
    return {
      menuList: [
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
      ],
      show: false // 图表数据弹窗
    }
  },
  inject: ['showChartData', 'exportImg'],
  computed: {
    ...mapGetters([
      'contextMenuInfo',
      'pageSettings',
      'canvasMap',
      'screenId',
      'currSelected'
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
    handleCommand(order) {
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
          this.showChartData()
          this.$store.dispatch('ToggleContextMenu')
        } else {
          this.$message.error('该图表没有拖入图表数据')
        }
      } else if (order === 'exportImg') {
        this.exportImg()
        this.$store.dispatch('ToggleContextMenu')
      } else {
        this.$store.dispatch('ContextMenuCommand', order)
      }
    },
    // 删除图表
    deleteOne() {
      this.deleteChartData()
    }
  }
}
</script>

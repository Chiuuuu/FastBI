<template>
  <div class="pagination">
    <div
      v-for="page in pages"
      :key="page.name"
      class="page"
      @click="toOtherPage(page.name)"
      @contextmenu.prevent="showMore=true"
    >{{page.name}}</div>
    <a-icon @click="addPage" type="plus-square" />
    <a-dropdown :trigger="['contextmenu']" v-model="showMore">
      <a-icon class="icon-more" type="caret-down" />
      <a-menu slot="overlay">
        <a-menu-item key="1">复制</a-menu-item>
        <a-menu-item key="2">重命名</a-menu-item>
        <a-menu-item key="3">删除</a-menu-item>
      </a-menu>
    </a-dropdown>
  </div>
</template>

<script>
import { addResizeListener, removeResizeListener } from 'bin-ui/src/utils/resize-event'
import { mapActions, mapGetters } from 'vuex'

export default {
  data () {
    return {
      showMore: false,
      pages: [{ name: '页面1' }, { name: '页面2' }, { name: '页面3' }, { name: '页面4' }],
      wrapStyle: {},
      screenStyle: {},
      range: 0.5
    }
  },
  mounted () {
  },
  beforeDestroy () {
  },
  methods: {
    ...mapActions(['SetCanvasRange']),
    // transform点击事件
    cancelSelected () {
      if (this.contextMenuInfo.isShow) {
        this.$store.dispatch('ToggleContextMenu')
        return
      }
      this.$store.dispatch('SingleSelected', null)
    },
    addPage () {
      this.pages.push({ name: 'test' })
    },
    toOtherPage (id) {
      this.$router.replace({
        name: 'screenEdit',
        params: {
          id: this.screenId,
          did: id
        }
      })
    },
    // 外层区域关闭右键菜单
    hideContextMenu () {
      this.$store.dispatch('ToggleContextMenu')
    }
  },
  computed: {
    ...mapGetters(['pageSettings', 'canvasRange', 'contextMenuInfo', 'screenId']),
    // 画布面板的样式
    canvasPanelStyle () {
      return {
        width: `${this.pageSettings.width}px`,
        height: `${this.pageSettings.height}px`,
        transform: `scale(${this.canvasRange}) translate3d(0px, 0px, 0)`,
        background: this.pageSettings.backgroundType === '1' ? this.pageSettings.backgroundColor : `url(${this.pageSettings.backgroundSrc}) 0% 0% / 100% 100% no-repeat`

        // backgroundColor: this.pageSettings.backgroundColor
      }
    }
  },
  components: { DropPanel, EditSlider }
}
</script>

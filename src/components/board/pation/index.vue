<template>
  <div class="pagination">
    <div
      v-for="(page, index) in pages"
      :key="page.name"
      @click="toOtherPage(page.name)"
      @contextmenu.prevent="showMore = true"
    >
      <a-dropdown :trigger="['contextmenu']" v-model="showMore">
        <span class="page">{{ page.name }}</span>
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="copyTab(page)">复制</a-menu-item>
          <a-menu-item key="2" @click="renameTab(page)">重命名</a-menu-item>
          <a-menu-item
            key="3"
            @click="deleteTab(index)"
            :style="{ color: pages.length > 1 ? 'black' : 'grey' }"
            >删除</a-menu-item
          >
        </a-menu>
      </a-dropdown>
    </div>
    <a-icon class="page-icon" @click="addPage" type="plus-square" />
  </div>
</template>

<script>
import {
  addResizeListener,
  removeResizeListener
} from 'bin-ui/src/utils/resize-event'
import { mapActions, mapGetters } from 'vuex'

export default {
  data() {
    return {
      showMore: false,
      pages: [{ name: '页面1' }],
      wrapStyle: {},
      screenStyle: {},
      range: 0.5
    }
  },
  mounted() {},
  beforeDestroy() {},
  methods: {
    ...mapActions(['SetCanvasRange']),
    // transform点击事件
    cancelSelected() {
      if (this.contextMenuInfo.isShow) {
        this.$store.dispatch('ToggleContextMenu')
        return
      }
      this.$store.dispatch('SingleSelected', null)
    },
    addPage() {
      if (this.pages.length < 10) {
        this.pages.push({ name: 'test' })
      } else {
        this.$message.error('最多只能添加10个页签')
      }
    },
    toOtherPage(id) {
      this.$router.replace({
        name: 'screenEdit',
        params: {
          id: this.screenId,
          did: id
        }
      })
    },
    copyTab(page) {},
    renameTab(page) {},
    deleteTab(index) {
      if (this.pages.length === 1) {
        return
      }
      this.pages.splice(index, 1)
    }
  },
  computed: {
    ...mapGetters([
      'pageSettings',
      'canvasRange',
      'contextMenuInfo',
      'screenId'
    ]),
    // 画布面板的样式
    canvasPanelStyle() {
      return {
        width: `${this.pageSettings.width}px`,
        height: `${this.pageSettings.height}px`,
        transform: `scale(${this.canvasRange}) translate3d(0px, 0px, 0)`,
        background:
          this.pageSettings.backgroundType === '1'
            ? this.pageSettings.backgroundColor
            : `url(${
                this.pageSettings.backgroundSrc
              }) 0% 0% / 100% 100% no-repeat`

        // backgroundColor: this.pageSettings.backgroundColor
      }
    }
  }
}
</script>

<template>
  <div
    class="canvas-main"
    ref="canvasMain"
    @contextmenu.stop.prevent="hideContextMenu($event)"
  >
    <div
      class="canvas-panel-wrap"
      :style="wrapStyle"
      @click.stop.prevent="cancelSelected"
    >
      <b-scrollbar style="height:100%;">
        <div class="screen-shot" :style="screenStyle" ref="screenInner">
          <div
            class="canvas-panel"
            :style="canvasPanelStyle"
            @click.stop.prevent="cancelSelected"
            :data-spm-anchor-id="$route.params.id"
          >
            <drop-panel>
              <slot></slot>
            </drop-panel>
          </div>
        </div>
      </b-scrollbar>
    </div>
    <edit-slider v-model="range"></edit-slider>
    <pation canEdit></pation>
  </div>
</template>

<script>
import {
  addResizeListener,
  removeResizeListener
} from 'bin-ui/src/utils/resize-event'
import EditSlider from './components/edit-slider'
import Pation from '../pation/index' // 分页栏
import DropPanel from '../../drop/drop-panel'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'CanvasMain',
  data() {
    return {
      wrapStyle: {},
      screenStyle: {},
      range: 0.65
    }
  },
  mounted() {
    this.$nextTick(this._calcStyle)
    addResizeListener(this.$refs.canvasMain, this._calcStyle)
  },
  beforeDestroy() {
    removeResizeListener(this.$refs.canvasMain, this._calcStyle)
  },
  methods: {
    ...mapActions(['SetCanvasRange']),
    _calcStyle() {
      const wrap = this.$refs.canvasMain
      if (!wrap) return
      // 计算wrap样式
      this.wrapStyle = {
        width: wrap.clientWidth - 10 + 'px',
        height: wrap.clientHeight - 61 + 'px'
      }
      this.screenStyle = {
        width: `${this.pageSettings.width * this.range + 120}px`,
        height: `${Math.max(
          this.pageSettings.height * this.range + 120,
          wrap.clientHeight - 61
        )}px`
      }
      // 计算缩放比例
      // let range = ((this.pageSettings.width) / 1920)
      // range = Math.round(range * 100) / 100
      // if (range < 0.3) {
      //   range = 0.3
      // }
      // this.range = range
    },
    // transform点击事件
    cancelSelected() {
      if (this.contextMenuInfo.isShow) {
        this.$store.dispatch('ToggleContextMenu')
        return
      }
      this.$store.dispatch('SingleSelected', null)
    },
    // 外层区域关闭右键菜单
    hideContextMenu(event) {
      //   this.$store.dispatch('ToggleContextMenu')
      let info = {
        x: event.pageX + 10,
        y: event.pageY + 10,
        listType: 'screenMenuList'
      }
      this.$store.dispatch('ToggleContextMenu', info)
    }
  },
  watch: {
    range(val) {
      const wrap = this.$refs.canvasMain
      this.screenStyle = {
        width: `${this.pageSettings.width * val + 120}px`,
        height: `${Math.max(
          this.pageSettings.height * val + 120,
          wrap.clientHeight - 61
        )}px`
      }
      this.SetCanvasRange(val)
    },
    // 页面尺寸变化，背景板自适应
    'pageSettings.width'(val) {
      if (val) {
        this._calcStyle()
      }
    },
    'pageSettings.height'(val) {
      if (val) {
        this._calcStyle()
      }
    }
    // pageSettings: {
    //   handler(val) {
    //     console.log(val)
    //   },
    //   deep: true,
    //   immediate: true
    // }
  },
  computed: {
    ...mapGetters(['pageSettings', 'canvasRange', 'contextMenuInfo']),
    // 画布面板的样式
    canvasPanelStyle() {
      return {
        width: `${this.pageSettings.width}px`,
        height: `${this.pageSettings.height}px`,
        transform: `scale(${this.canvasRange}) translate3d(-50%, -50%, 0)`,
        background:
          this.pageSettings.backgroundType === '1'
            ? this.pageSettings.backgroundColor
            : `url(${
                this.pageSettings.backgroundSrc
              }) 0% 0% / 100% 100% no-repeat`

        // backgroundColor: this.pageSettings.backgroundColor
      }
    }
  },
  components: { DropPanel, EditSlider, Pation }
}
</script>

<template>
  <div class="dv-screen" allowfullscreen="true" :style="wrapStyle" ref="dvScreen">
    <div :style="canvasPanelStyle">
      <b-scrollbar style="height:100%">
        <div class="canvas-panel">
          <template v-for="transform in canvasMap">
            <preview-box :key="transform.id" :item="transform">
              <!-- 文本 -->
              <chart-text
                v-if="transform.setting.name === 've-text'"
                :config="transform.setting.config"
                :background="transform.setting.background"
              ></chart-text>

              <!-- 图片 -->
              <chart-image
                v-else-if="transform.setting.name === 've-image'"
                :config="transform.setting.config"
                :background="transform.setting.background"
              ></chart-image>

              <!-- 表格 -->
              <chart-tables
                v-else-if="transform.setting.name === 've-tables'"
                :config="transform.setting.config"
                :api-data="transform.setting.api_data"
                :background="transform.setting.background"
              ></chart-tables>
              <charts-factory
                v-else
                :type-name="transform.setting.name"
                :chart-type="transform.setting.chartType"
                :type="transform.setting.type"
                :config="transform.setting.config"
                :api-data="transform.setting.api_data"
                :apis="transform.setting.apis"
                :background="transform.setting.background"
              ></charts-factory>
            </preview-box>
          </template>
        </div>
      </b-scrollbar>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex"
import { getPageSettings } from "../api/app/app-request"
import { getCanvasMaps } from "../api/canvasMaps/canvas-maps-request"
import ChartsFactory from "../components/charts/charts-factory"
import PreviewBox from "../components/preview/preview-box"
import ChartText from "@/components/tools/Text"
import ChartImage from "@/components/tools/Image"
import ChartTables from "@/components/tools/Tables"

import {
  addResizeListener,
  removeResizeListener,
} from "bin-ui/src/utils/resize-event"

export default {
  name: "screen",
  components: { ChartsFactory, PreviewBox, ChartText, ChartImage, ChartTables },
  props: {},
  data () {
    return {
      wrapStyle: {},
      range: "",
    }
  },
  computed: {
    ...mapGetters([
      "canvasMap",
      "pageSettings",
      "screenId",
      "orginPageSettings",
    ]),
    // 画布面板的样式
    canvasPanelStyle () {
      return {
        width: `${this.pageSettings.width}px`,
        height: `${this.pageSettings.height}px`,
        transform: `scale(${this.range}) translate3d(0px, 0px, 0)`,
        transformOrigin: "0 0",
        background:
          this.pageSettings.backgroundType === "1"
            ? this.pageSettings.backgroundColor
            : `url(${this.pageSettings.backgroundSrc}) 0% 0% / 100% 100% no-repeat`,
      }
    },
  },
  watch: {
    screenId: {
      handler (val) {
        if (val) {
          this.getScreenData()
        }
      },
      deep: true,
      immediate: true,
    },
  },
  created () {
    // this.getScreenData()
  },
  mounted () {
    this.$nextTick(this._calcStyle)
    addResizeListener(this.$refs.dvScreen, this._calcStyle)
  },
  beforeDestroy () {
    removeResizeListener(this.$refs.dvScreen, this._calcStyle)
  },
  methods: {
    ...mapActions(["getScreenDetail", 'handleRefreshData']),
    // 获取大屏数据
    getScreenData () {
      // 获取页面配置之前先重置
      this.$store.dispatch("SetPageSettings", this.orginPageSettings)
      this.$store.dispatch("InitCanvasMaps", [])
      this.getScreenDetail(this.screenId);
      // this.$server.screenManage
      //   .getScreenDetailById(this.screenId)
      //   .then((res) => {
      //     if (res.code === 200) {
      //       // 页面配置信息
      //       this.$store.dispatch(
      //         "SetPageSettings",
      //         res.data ? res.data.setting : {}
      //       )

      //       this.$store.commit(
      //         "common/SET_PRIVILEGES",
      //         res.data ? res.data.privileges : []
      //       )
      //       // 页面canvasMapss
      //       this.$store.dispatch("InitCanvasMaps", {
      //         maps: res.data ? res.data.screenGraphs : [],
      //         idList: res.data ? res.data.setting.idList : [],
      //       })
      //     }
      //   })
    },
    _calcStyle () {
      const wrap = this.$refs.dvScreen
      if (!wrap) return
      // 计算wrap样式
      this.wrapStyle = {
        width: wrap.clientWidth + "px",
        height: wrap.clientHeight - 30 + "px",
      }
      // 计算缩放比例(当前元素占位跟画板默认长度的比例,也就是大小画板的比例)
      let range = wrap.clientWidth / this.orginPageSettings.width
      range = Math.round(range * 100) / 100
      if (range < 0.4) {
        range = 0.4
      }
      this.range = range
    },
    // 刷新大屏
    refreshData () {
      if (!this.screenId) {
        this.$message.error("暂无数据可刷新，请先添加数据")
        return
      }
      let params = {
        id: this.screenId,
      }
      this.$server.screenManage.actionRefreshScreen({ params }).then((res) => {
        if (res.code === 200) {
          let dataItem = res.data
          let keys = Object.keys(dataItem)
          keys.forEach(item => {
            let newData = dataItem[item]
            let chart = this.canvasMap.find(chart => chart.id + '' === item)
            this.handleRefreshData({ chart, newData })
          })
          this.$server.screenManage.saveAllChart(this.canvasMap)
          this.$message.success("刷新成功")
        } else {
          res.msg && this.$message.error(res.msg)
        }
      })
    },
  },
}
</script>

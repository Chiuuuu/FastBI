<template>
  <div class="dv-screen" allowfullscreen="true" :style="wrapStyle" ref="dvScreen">
    <div :style="canvasPanelStyle">
      <b-scrollbar style="height:100%;">
        <div class="canvas-panel"  >
          <template v-for="transform in canvasMap">
            <preview-box :key="transform.id" :item="transform">
              <!-- 文本 -->
              <chart-text v-if="transform.packageJson.name === 've-text'"
                          :config="transform.packageJson.config"
                          :background="transform.packageJson.background"></chart-text>

              <!-- 图片 -->
              <chart-image v-else-if="transform.packageJson.name === 've-image'"
                          :config="transform.packageJson.config"
                          :background="transform.packageJson.background"></chart-image>

              <!-- 表格 -->
              <chart-tables v-else-if="transform.packageJson.name === 've-tables'"
                            :config="transform.packageJson.config"
                            :api-data="transform.packageJson.api_data"
                            :background="transform.packageJson.background"></chart-tables>
              <charts-factory v-else
                      :type-name="transform.packageJson.name"
                      :chart-type="transform.packageJson.chartType"
                      :type="transform.packageJson.type"
                      :config="transform.packageJson.config"
                      :api-data="transform.packageJson.api_data"
                      :apis="transform.packageJson.apis"
                      :background="transform.packageJson.background"
                      ></charts-factory>
            </preview-box>
          </template>
        </div>
      </b-scrollbar>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { getPageSettings } from '../api/app/app-request'
  import { getCanvasMaps } from '../api/canvasMaps/canvas-maps-request'
  import ChartsFactory from '../components/charts/charts-factory'
  import PreviewBox from '../components/preview/preview-box'
  import ChartText from '@/components/tools/Text'
  import ChartImage from '@/components/tools/Image'
  import ChartTables from '@/components/tools/Tables'

  import { addResizeListener, removeResizeListener } from 'bin-ui/src/utils/resize-event'

  export default {
    name: 'screen',
    components: { ChartsFactory, PreviewBox, ChartText, ChartImage, ChartTables },
    props: {

    },
    data () {
      return {
        wrapStyle: {},
        range: ''
      }
    },
    computed: {
      ...mapGetters(['canvasMap', 'pageSettings', 'screenId', 'orginPageSettings']),
      // 画布面板的样式
      canvasPanelStyle () {
        return {
          width: `${this.pageSettings.width}px`,
          height: `${this.pageSettings.height}px`,
          transform: `scale(${this.range}) translate3d(0px, 0px, 0)`,
          transformOrigin: '0 0',
          background: this.pageSettings.backgroundType === '1' ? this.pageSettings.backgroundColor : `url(${this.pageSettings.backgroundSrc}) 0% 0% / 100% 100% no-repeat`
        }
      }
    },
    watch: {
      screenId: {
        handler(val) {
          if (val) {
            this.getScreenData()
          }
        },
        deep: true,
        immediate: true
      }
    },
    created () {
      // this.getScreenData()
    },
    mounted() {
      this.$nextTick(this._calcStyle)
      addResizeListener(this.$refs.dvScreen, this._calcStyle)
    },
    beforeDestroy () {
      removeResizeListener(this.$refs.dvScreen, this._calcStyle)
    },
    methods: {
      // 获取大屏数据
      getScreenData() {
        // 获取页面配置之前先重置
        this.$store.dispatch('SetPageSettings', this.orginPageSettings)
        this.$store.dispatch('InitCanvasMaps', [])
        this.$server.screenManage.getScreenDetailById(this.screenId).then(res => {
          if (res.code === 200) {
            let json = res.data ? res.data.setting : {}
            // 页面配置信息
            this.$store.dispatch('SetPageSettings', json.setting)
            // 页面canvasMaps
            this.$store.dispatch('InitCanvasMaps', json.components)
            this.$store.dispatch('SetPrivileges', res.data.privileges || [])
          }
        })
      },
      _calcStyle () {
        const wrap = this.$refs.dvScreen
        if (!wrap) return
        // 计算wrap样式
        this.wrapStyle = {
          width: wrap.clientWidth + 'px',
          height: (wrap.clientHeight - 30) + 'px'
        }
        // 计算缩放比例(当前元素占位跟画板默认长度的比例,也就是大小画板的比例)
        let range =  wrap.clientWidth / this.orginPageSettings.width
        range = Math.round(range * 100) / 100
        if (range < 0.4) {
          range = 0.4
        }
        this.range = range
      },
      // 刷新大屏
      refreshData() {
        if (!this.screenId) {
          this.$message.error('暂无数据可刷新，请先添加数据')
          return
        }
        let params = {
          id: this.screenId
        }
        this.$server.screenManage.actionRefreshScreen({ params }).then(res => {
          if (res.code === 200) {
            let screenDataList = res.data.screenDataList
            for (let item of screenDataList) {
              for (let item2 of this.canvasMap) {
                if (item2.id === item.id) {
                  item2.packageJson.api_data.source.rows = item.value
                }
              }
            }
            this.$message.success('刷新成功')
          } else {
            res.msg && this.$message.error(res.msg)
          }
        })
      }
    }
  }
</script>

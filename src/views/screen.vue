<template>
  <div class="dv-screen" :style="wrapStyle" ref="dvScreen">
    <div :style="canvasPanelStyle">
      <b-scrollbar style="height:100%">
        <div class="canvas-panel">
          <template v-for="transform in canvasMap">
            <preview-box :key="transform.id" :item="transform">
              <!--数据模型不存在-->
              <chart-nodata
                v-if="transform.setting.isEmpty"
                :config="transform.setting.config"
              ></chart-nodata>
              <!--素材库-->
              <ChartMaterial
                v-else-if="transform.setting.name === 'material'"
                :url="transform.setting.url"
              ></ChartMaterial>
              <!--进度条-->
              <SteepBar
                v-else-if="transform.setting.name === 'steepBar'"
                :config="transform.setting.config"
                :background="transform.setting.background"
                :api-data="transform.setting.api_data"
              ></SteepBar>
              <!-- 文本 -->
              <chart-text
                v-else-if="transform.setting.name === 've-text'"
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
                ref="tables"
                v-else-if="transform.setting.name === 've-tables'"
                :config="transform.setting.config"
                :api-data="transform.setting.api_data"
                :background="transform.setting.background"
                :chartSize="transform.setting.view"
              ></chart-tables>
              <charts-factory
                v-else
                :id="transform.id"
                ref="chart"
                :type-name="transform.setting.name"
                :chart-type="transform.setting.chartType"
                :type="transform.setting.type"
                :config="transform.setting.config"
                :api-data="transform.setting.api_data"
                :apis="transform.setting.apis"
                :background="transform.setting.background"
                @linkage="setLinkageData"
                @resetOriginData="resetOriginData"
              ></charts-factory>
            </preview-box>
          </template>
        </div>
      </b-scrollbar>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { getPageSettings } from '../api/app/app-request'
import { getCanvasMaps } from '../api/canvasMaps/canvas-maps-request'
import ChartsFactory from '../components/charts/charts-factory'
import PreviewBox from '../components/preview/preview-box'
import ChartText from '@/components/tools/Text'
import ChartImage from '@/components/tools/Image'
import ChartTables from '@/components/tools/Tables'
import ChartNodata from '@/components/tools/Nodata'
import ChartMaterial from '@/components/tools/Material'
import SteepBar from '@/components/tools/SteepBar'
import { Loading } from 'element-ui'

import {
  addResizeListener,
  removeResizeListener
} from 'bin-ui/src/utils/resize-event'

import throttle from 'lodash/throttle'

export default {
  name: 'screen',
  components: {
    ChartsFactory,
    PreviewBox,
    ChartText,
    ChartImage,
    ChartTables,
    ChartNodata,
    ChartMaterial,
    SteepBar
  },
  props: {},
  data() {
    return {
      wrapStyle: {},
      range: '',
      chartTimer: null,
      timer: null
    }
  },
  computed: {
    ...mapGetters([
      'canvasMap',
      'pageSettings',
      'screenId',
      'orginPageSettings',
      'isPublish'
    ]),
    // 画布面板的样式
    canvasPanelStyle() {
      return {
        width: `${this.pageSettings.width}px`,
        height: `${this.pageSettings.height}px`,
        transform: `scale(${this.range}) translate3d(0px, 0px, 0)`,
        transformOrigin: '0 0',
        background:
          this.pageSettings.backgroundType === '1'
            ? this.pageSettings.backgroundColor
            : `url(${
                this.pageSettings.backgroundSrc
              }) 0% 0% / 100% 100% no-repeat`
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
  created() {
    // this.getScreenData()
  },
  mounted() {
    this.$nextTick(this._calcStyle)
    addResizeListener(this.$refs.dvScreen, this._calcStyle)
  },
  beforeDestroy() {
    removeResizeListener(this.$refs.dvScreen, this._calcStyle)
    clearInterval(this.timer)
    this.timer = null
    clearInterval(this.chartTimer)
    this.chartTimer = null
  },
  methods: {
    ...mapActions(['getScreenDetail', 'refreshScreen']),
    getTableSize(transform) {
      return {
        x: transform.setting.view.width,
        y: transform.setting.view.height
      }
    },
    // 获取大屏数据
    getScreenData() {
      // 获取页面配置之前先重置
      this.$store.dispatch('SetPageSettings', this.orginPageSettings)
      this.$store.dispatch('InitCanvasMaps', [])
      let loadingInstance = Loading.service({
        lock: true,
        text: '加载中...',
        target: document.querySelector('.screen-manage')
      })
      // 先获取大屏对应的页签信息
      this.$server.screenManage.getScreenTabs(this.screenId).then(res => {
        if (res.code === 200) {
          let pages = res.rows.map(item =>
            Object.assign(item, { showDropDown: false, isFocus: false })
          )
          this.$store.dispatch('SetPageList', pages)
          this.$store.dispatch('SetPageId', pages[0].id)
          if (!this.screenId) {
            loadingInstance.close()
            return
          }
          // 默认显示大屏第一个页签的数据
          this.getScreenDetail({
            id: this.screenId,
            tabId: pages[0].id,
            needRefresh: true
          }).then(res => {
            loadingInstance.close()
            if (res) {
              this.setTimer()
              if (this.isPublish === 1) {
                this.getShareData()
              }
            }
          })
        } else {
          res.msg && this.$message.error(res.msg)
          loadingInstance.close()
        }
      })
    },
    // 设置定时器
    setTimer() {
      if (this.timer) {
        clearInterval(this.timer)
        this.timer = null
      }
      if (this.chartTimer) {
        clearInterval(this.chartTimer)
        this.chartTimer = null
      }
      if (
        this.pageSettings.refresh.isRefresh &&
        this.pageSettings.refresh.unit &&
        this.pageSettings.refresh.frequency > 0
      ) {
        let count = 0
        if (this.pageSettings.refresh.unit === 'min') {
          count = this.pageSettings.refresh.frequency * 60 * 1000
        } else if (this.pageSettings.refresh.unit === 'hour') {
          count = this.pageSettings.refresh.frequency * 60 * 60 * 1000
        }
        this.timer = setInterval(() => {
          this.refreshData()
        }, count)
      }
      for (let item of this.canvasMap) {
        let refresh = item.setting.api_data.refresh
        if (refresh.isRefresh && refresh.unit && refresh.frequency > 0) {
          let count = 0
          if (refresh.unit === 'min') {
            count = refresh.frequency * 60 * 1000
          } else if (refresh.unit === 'hour') {
            count = refresh.frequency * 60 * 60 * 1000
          }
          let self = this
          this.chartTimer = (function() {
            setInterval(() => {
              self.refreshData()
            }, count)
          })(item)
        }
      }
    },
    // 获取分享信息
    getShareData() {
      if (!this.screenId) {
        return false
      }
      return this.$server.screenManage
        .showScreenRelease(this.screenId)
        .then(res => {
          if (res.code === 200) {
            this.$emit('getShareData', res.data)
            // this.releaseObj = res.data
            return true
          } else {
            this.$message.error(res.msg)
            return false
          }
        })
    },
    _calcStyle() {
      const wrap = this.$refs.dvScreen
      if (!wrap) return
      // 计算wrap样式
      this.wrapStyle = {
        width: wrap.clientWidth + 'px',
        height: wrap.clientHeight - 30 + 'px'
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
    refreshData: throttle(
      function() {
        this.refreshScreen({
          charSeted: false,
          needLoading: true
        })
      },
      1000,
      {
        leading: true,
        trailing: false
      }
    ),
    // 设置联动的图标的数据
    setLinkageData(id, e) {
      // 没有联动图表不进行操作
      let selected = this.canvasMap.find(item => item.id === id)
      //   if (!selected.bindList) {
      //     return
      //   }
      let bindCharts = selected.bindList
      // 测试数据
      bindCharts = ['540314407381487645']
      for (let chartId of bindCharts) {
        let chart = this.canvasMap.find(item => item.id === chartId)
        let apiData = chart.setting.api_data
        // 维度不相同无法联动
        if (
          apiData.dimensions[0].id !==
          selected.setting.api_data.dimensions[0].id
        ) {
          continue
        }
        // 构造联动选择的数据，找到点击的维度数据
        this.$set(apiData, 'selectData', {
          columns: apiData.source.columns,
          rows: apiData.source.rows.filter(
            item => item[apiData.dimensions[0].alias] === e.name
          )
        })
      }

      console.log('linkage')
    },
    // 重置被联动的图标数据
    resetOriginData(id) {
      let selected = this.canvasMap.find(item => item.id === id)
      let bindCharts = selected.bindList
      // 测试数据
      bindCharts = ['540314407381487645']
      for (let chartId of bindCharts) {
        let chart = this.canvasMap.find(item => item.id === chartId)
        let apiData = chart.setting.api_data
        // 删除联动数据
        this.$delete(apiData, 'selectData')
      }
    }
  }
}
</script>

<template>
  <!-- 3D饼图和柱状图 -->
  <div class="dvs-high">
    <div class="container" ref="container" :style="styleObj" @click.capture="resetBindData"></div>
  </div>
</template>
<script>
import { DEFAULT_COLORS } from '@/utils/defaultColors'
import { mapGetters } from 'vuex'
import { setLinkageData, resetOriginData } from '@/utils/setDataLink'
export default {
  name: 'hightCharts',
  props: {
    chartId: {
      type: String,
      default: '0'
    },
    transform: {
      type: Object
    },
    setting: {
      type: Object,
      required: true
    },
    apiData: {
      type: Object,
      required: true
    },
    config: {
      type: Object
      // required: true,
    }
  },
  data() {
    return {
      chart: null,
      styleObj: {},
      currentIndex: '' // 记录当前选择的度量数据(图表联动)
    }
  },
  computed: {
    ...mapGetters(['canvasMap']),
    // 是否开启图表联动
    isClickLink() {
      return this.apiData.interactive && this.apiData.interactive.clickLink
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.getBackgroundColor(this.setting.background)
      this.setting.config.plotOptions.series.events.click = this.clickEvent
      this.mychart = this.$highCharts.chart(
        this.$refs.container,
        this.setting.config
      )
    },
    resetBindData() {
      if (this.currentIndex !== '') {
        resetOriginData(this.chartId, this.canvasMap)
      }
    },
    clickEvent(e) {
      let self = this
      // 判断是否启用了联动
      if (!self.isClickLink) {
        return
      }
      self.$nextTick(() => {
        // 重复选择数据，进行重置
        if (self.currentIndex === e.point.index) {
          self.currentIndex = ''
          // 强行渲染
          self.key++
          resetOriginData(self.chartId, self.canvasMap)
          return
        }
        // if (typeof params.target === 'undefined') {
        //     // 重置数据颜色样式
        //     const series = self.config.series
        //     if (
        //       series.itemStyle &&
        //       series.itemStyle.normal &&
        //       series.itemStyle.normal.color
        //     ) {
        //       delete self.config.series.itemStyle.normal.color
        //     }
        //     resetOriginData(self.chartId, self.canvasMap)
        //     self.currentIndex = ''
        //   }
        // 记录当前选择数据的index
        self.currentIndex = e.point.index
        // self.setChartClick()
        // 兼容echarts处理, echarts的e.name就是维度值
        e.name = e.point.name
        setLinkageData(self.chartId, e, self.canvasMap)
      })
    },
    // 添加图表点击事件，可以点击非数据区域
    setChartClick() {
      this.$nextTick(() => {
        let self = this
        this.mychart.getZr().on('click', function(params) {
          if (typeof params.target === 'undefined') {
            // 重置数据颜色样式
            const series = self.config.series
            if (
              series.itemStyle &&
              series.itemStyle.normal &&
              series.itemStyle.normal.color
            ) {
              delete self.config.series.itemStyle.normal.color
            }
            resetOriginData(self.chartId, self.canvasMap)
            self.currentIndex = ''
          }
        })
      })
    },
    getBackgroundColor(objcolor) {
      // this.styleObj = {};
      let type = objcolor.backgroundType
      this.styleObj = {
        background:
          type === '1'
            ? objcolor.backgroundColor
            : `url(${objcolor.backgroundImage})`,
        //  backgroundColor: val.backgroundColor,
        'border-color': objcolor.borderColor,
        'border-width': objcolor.borderWidth + 'px',
        'border-style': objcolor.borderStyle,
        'border-radius': objcolor.borderRadius + 'px'
      }
      // for (const key in objcolor) {
      //     let _key = key
      //       .replace(/::/g, '/')
      //       .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
      //       .replace(/([a-z\d])([A-Z])/g, '$1_$2')
      //       .replace(/_/g, '-')
      //       .toLowerCase();
      //     this.$set(this.styleObj,_key,
      //       key == 'backgroundImage' ? `url(${objcolor[key]})` : (typeof objcolor[key])==='number'?`${objcolor[key]}px`:objcolor[key]
      //     )
      //   }
    }
  },
  watch: {
    setting: {
      handler(val) {
        val.config.chart.width = val.view.width
        val.config.chart.height = val.view.height
        // this.$highCharts.chart(this.$refs.container, val.config);
        this.getBackgroundColor(val.background)
        this.mychart.update(val.config)
      },
      deep: true
      // immediate:true
    },
    config: {
      handler(val) {},
      deep: true
    },
    apiData: {
      handler(val) {
        /*
        dimensions //维度（name）
        measures//度量(value)
      */
        // 单维度
        if (val.dimensions.length === 0 && val.measures.length === 0) {
          this.mychart = this.$highCharts.chart(
            this.$refs.container,
            this.setting.config
          )
          return
        }
        if (
          !val.source |
          (val.dimensions.length === 0) |
          (val.measures.length === 0)
        ) {
          return
        }
        if (val.source.rows.length === 0) {
          this.setting.config.series = []
        } else {
          let _dimensions = val.dimensions[0].alias
          // 判断是否单度量和多度量
          let _measure = val.measures.map(item => item.alias)
          let series = []

          let rows = val.source.rows
          if (val.selectData) {
            rows = val.selectData.rows
          }

          _measure.forEach(key => {
            series.push({
              name: key,
              data: rows.map(x => ({
                name: x[_dimensions],
                y: x[key]
              }))
            })
          })
          if (series.length === 0) {
            return
          }
          this.setting.config.series = [...series]
        }
        this.mychart = this.$highCharts.chart(
          this.$refs.container,
          this.setting.config
        )
        // this.mychart.update(this.setting.config);//只能更新原来的一个或两个series，哪怕多加series，也不会起作用
      },
      deep: true
    }
  }
}
</script>
<style lang="less" scoped>
.dvs-high {
  width: 100%;
  height: 100%;
  .container {
    display: table-cell;
    position: absolute;
    width: 100%;
    height: 100%;
    ::v-deep .highcharts-container {
      width: 100% !important;
      height: 100% !important;
    }
  }
}
</style>

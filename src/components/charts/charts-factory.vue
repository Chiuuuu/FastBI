<template>
  <div
    class="dv-charts"
    style="width: 100%;height:100%;"
    :style="backgroundStyle"
    ref="wrap"
  >
    <div
      class="titles"
      ref="titles"
      v-if="config.title && config.title.show"
      :style="titleStyle"
    >
      <span>{{ config.title.content }}</span>
    </div>
    <component
      :key="key"
      v-if="
        chartData.columns &&
          chartData.columns.length > 0 &&
          typeName !== 've-map'
      "
      v-bind:is="typeName"
      :events="chartEvents"
      :data="chartData"
      :width="width"
      :height="height"
      ref="chart"
      :legend-visible="legendVisible"
      :after-config="afterConfig"
      :title="chartType === 'v-ring' ? config.chartTitle : {}"
      :extend="chartExtend"
      :options="chartOptions"
      :settings="chartSettings"
    ></component>
    <component
      v-else
      v-bind:is="typeName"
      :events="chartEvents"
      :data="chartData"
      :width="width"
      :height="height"
      ref="chart"
      :legend-visible="legendVisible"
      :after-config="afterConfig"
      :title="chartType === 'v-ring' ? config.chartTitle : {}"
      :extend="chartExtend"
      :options="chartOptions"
      :settings="chartSettings"
      :series="chartSeries"
      :geo="geo"
      :tooltip="mapToolTip"
    ></component>
    <!-- <div v-else class="dv-charts-null">
      <a-icon  type="pie-chart" style="font-size:50px;" />
    </div> -->
  </div>
</template>

<script>
import {
  addResizeListener,
  removeResizeListener
} from 'bin-ui/src/utils/resize-event'
import { formatData, convertData } from '../../utils/formatData'
import { deepClone } from '@/utils/deepClone'
import guangzhou from '@/utils/guangdong.json'
import omit from 'lodash/omit'
import { DEFAULT_COLORS } from '@/utils/defaultColors'

export default {
  name: 'ChartsFactory',
  props: {
    id: {
      type: String,
      default: '0'
    },
    typeName: {
      type: String,
      required: true
    },
    chartType: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    apiData: {
      type: Object,
      required: true
    },
    apis: {
      type: Object,
      required: true
    },
    config: {
      type: Object,
      required: true
    },
    background: {
      type: Object,
      required: true
    }
  },
  data() {
    let self = this
    this.chartEvents = {
      click: function(e) {
        self.name = e.name
        self.$nextTick(() => {
          let chart = self.$refs.chart.echarts
          // 鼠标单击时选中,选中颜色不变，其余变暗
          if (self.typeName === 've-bar' || self.typeName === 've-histogram') {
            self.chartExtend.series.itemStyle.normal.color = function(params) {
              return params.dataIndex === e.dataIndex
                ? DEFAULT_COLORS[params.seriesIndex]
                : self.hexToRgba(DEFAULT_COLORS[params.seriesIndex], 0.4)
            }
            self.key++
          } else if (self.typeName === 've-pie') {
            self.chartExtend.series.itemStyle.normal.color = function(params) {
              return params.dataIndex === e.dataIndex
                ? DEFAULT_COLORS[params.dataIndex]
                : self.hexToRgba(DEFAULT_COLORS[params.dataIndex], 0.4)
            }
            // 强行渲染，非数据变动不会自动重新渲染
            self.key++
          }
          self.$emit('linkage', self.id, e)
          chart.off('click')
          self.setChartClick()
        })
      }
    }
    return {
      wrapStyle: {},
      width: '500px',
      height: '400px',
      chartData: {
        columns: ['x', 'y'],
        rows: [{ x: 'x', y: 100 }]
      },
      tooltipVisible: true,
      legendVisible: true,
      // chart扩展配置项
      chartExtend: {},
      chartOptions: {},
      chartSettings: {},
      chartSeries: {},
      backgroundStyle: {},
      colors: [],
      geo: {},
      mapToolTip: {},
      key: 0
    }
  },
  watch: {
    config: {
      handler(val) {
        if (val) {
          // 图例
          this.legendVisible = val.legend && val.legend.show
          // this.chartExtend = { ...val }

          if (this.typeName === 've-map') {
            this.chartExtend = { ...omit(val, ['series']) }
            this.chartSeries = val.series
            // if (
            //   !this.chartSeries[0].label.formatter ||
            //   this.chartSeries[0].label.formatter === '{b} ：{c}'
            // ) {
            //   // 添加标签格式回调
            //   this.chartSeries[0].label.formatter = function(params) {
            //     return params.data.value[2].toFixed(2)
            //   }
            // }
            this.geo = val.geo
            this.mapToolTip = val.tooltip
            // if (
            //   !this.mapToolTip.formatter ||
            //   this.mapToolTip.formatter === '{b} ：{c}'
            // ) {
            //   // 添加格式回调函数
            //   this.mapToolTip.formatter = function(params) {
            //     let data = params.data
            //     return `${params.seriesName}<br />${data.name}：${
            //       data.value[2]
            //     }`
            //   }
            // }
          } else {
            this.chartExtend = { ...val }
          }
          // this.colors = [...val.colors]
          this.$log.primary('========>chartExtend')
          this.$print(this.chartExtend)
        }
      },
      deep: true,
      immediate: true
    },
    apiData: {
      handler(val) {
        if (val) {
          // 只有度量的情况
          if (this.type === '2') {
            if (val.measures && val.measures.length > 0) {
              if (!val.source) {
                return
              }
              this.chartData = val.source
              if (this.chartType === 'v-ring') {
                this.chartExtend.chartTitle.text = val.source.rows
                  ? val.source.rows[0].value
                  : ''
              }
              return
            }
          }
          if (val.dimensions && val.measures) {
            // 缺维度或者缺度量都不改变数据
            if (val.dimensions.length === 0 || val.measures.length === 0) {
              return
            }
            if (
              val.dimensions.length > 0 &&
              val.measures.length > 0 &&
              val.source
            ) {
              if (!val.source) {
                return
              }
              // 如果有联动，显示联动的数据
              this.chartData = val.selectData ? val.selectData : val.source
              return
            }
          }
          this.chartData.columns = val.columns
          this.chartData.rows = val.rows
        }
      },
      deep: true,
      immediate: true
    },
    apis: {
      handler(val) {
        if (val) {
          this.chartSettings = { ...val }
          this.$log.primary('========>chartSettings')
          this.$print(this.chartSettings)
        }
      },
      deep: true,
      immediate: true
    },
    background: {
      handler(val) {
        if (val) {
          this.backgroundStyle = {
            background:
              val.backgroundType === '1'
                ? val.backgroundColor
                : `url(${val.backgroundSrc})`,
            //  backgroundColor: val.backgroundColor,
            borderColor: val.borderColor,
            borderWidth: val.borderWidth + 'px',
            borderStyle: val.borderStyle,
            borderRadius: val.borderRadius + 'px'
          }
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this._calcStyle()
    addResizeListener(this.$refs.wrap, this._calcStyle)
    this.setChartClick()
  },
  beforeDestroy() {
    removeResizeListener(this.$refs.wrap, this._calcStyle)
  },
  methods: {
    afterConfig(options) {
      return options
    },
    // 添加图表点击事件，可以点击非数据区域
    setChartClick() {
      this.$nextTick(() => {
        let self = this
        this.$refs.chart.echarts.getZr().on('click', function(params) {
          if (typeof params.target === 'undefined') {
            // 重置数据颜色样式
            delete self.chartExtend.series.itemStyle.normal.color
            // 强行渲染，非数据变动不会自动重新渲染
            self.key++
            self.$emit('resetOriginData', self.id)
          }
        })
      })
    },
    _calcStyle() {
      const wrap = this.$refs.wrap
      const title = this.$refs.titles
      if (!wrap) return
      let width = wrap.clientWidth
      let height = wrap.clientHeight
      if (this.config.title && this.config.title.show) {
        height -= title.clientHeight
      }
      this.width = width + 'px'
      this.height = height + 'px'
    },
    // 颜色转透明色，用于选中图表转换显示颜色
    hexToRgba(hex, opacity) {
      return hex && hex.replace(/\s+/g, '').length === 7
        ? 'rgba(' +
            parseInt('0x' + hex.slice(1, 3)) +
            ',' +
            parseInt('0x' + hex.slice(3, 5)) +
            ',' +
            parseInt('0x' + hex.slice(5, 7)) +
            ',' +
            opacity +
            ')'
        : ''
    }
  },
  computed: {
    titleStyle() {
      return {
        padding: '20px 10px',
        color: this.config.title.textStyle.color,
        fontSize: this.config.title.textStyle.fontSize + 'px',
        textAlign: this.config.title.textAlign,
        fontFamily: this.config.title.textStyle.fontFamily,
        fontWeight: this.config.title.textStyle.fontWeight,
        height: 'auto'
      }
    }
  }
}
</script>
<style lang="less" scoped>
.chart-event {
  pointer-events: auto !important;
}
</style>

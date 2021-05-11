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
    <div class="warningvalue" v-show="chartType === 'v-gauge'">
      <span :style="{ opacity: config.warningValue ? 1 : 0 }"
        >预警值：{{ config.warningValue }}</span
      >
    </div>
    <div class="warningvalue" v-show="chartType === 'v-gauge'">
      <span :style="{ opacity: config.targetValue ? 1 : 0 }"
        >目标值：{{ config.targetValue }}</span
      >
    </div>
    <component
      v-if="chartData.columns && chartData.columns.length > 0"
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
import { DEFAULT_COLORS } from '@/utils/defaultColors'

export default {
  name: 'ChartsFactory',
  props: {
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
    var self = this
    this.chartEvents = {
      click: function(e) {
        self.name = e.name
        console.log(e)
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
      backgroundStyle: {},
      colors: [],
      key: 0 // 修改颜色格式后重新渲染图表
    }
  },
  watch: {
    config: {
      handler(val) {
        if (val) {
          // 图例
          this.legendVisible = val.legend && val.legend.show
          this.chartExtend = { ...val }
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
            if (
              (val.dimensions.length === 0 && val.measures.length > 0) ||
              (val.dimensions.length > 0 && val.measures.length === 0)
            ) {
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
              this.chartData = val.source
              return
            }
          }
          this.chartData.columns = val.columns
          this.chartData.rows = val.rows
          // 折线图，柱状图，饼图，条形图考虑预警颜色
          this.setWarningColor(this.apiData)

          // if (val.source) {
          //   let data = formatData(val.source)
          //   // let data = val.source
          //   this.chartData.columns = [...data.columns]
          //   this.chartData.rows = [...data.rows]
          //   this.$log.primary('========>chartData')
          //   this.$print(this.chartData)
          // }
        }
      },
      deep: true,
      immediate: true
    },
    apis: {
      handler(val) {
        if (val) {
          this.chartSettings = { ...val }
          // this.$log.primary('========>chartSettings')
          // this.$print(this.chartSettings)
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
    // 折线图，柱状图，饼图，条形图考虑预警颜色
    this.setWarningColor(this.apiData)
    addResizeListener(this.$refs.wrap, this._calcStyle)
  },
  beforeDestroy() {
    removeResizeListener(this.$refs.wrap, this._calcStyle)
  },
  methods: {
    afterConfig(options) {
      if (this.typeName === 've-map') {
        let data = [...options.series[0].data]
        options.series[0].data = convertData(data)
      }
      return options
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
    // 设置预警颜色
    setWarningColor(val) {
      if (
        !this.chartType === 'v-line' &&
        !this.chartType === 'v-histogram' &&
        !this.chartType === 'v-pie' &&
        !this.chartType === 'v-bar'
      ) {
        return
      }
      // 按预警格式化显示颜色
      if (!val.warning) {
        return
      }
      if (val.warning.length === 0) {
        // 重置数据颜色样式
        delete this.chartExtend.series.itemStyle.normal.color
        // 强行渲染
        this.key++
        return
      }
      val.warning.forEach((item, index) => {
        switch (item.condition) {
          case 'range':
            this.setColorFormatter(
              item.warnColor,
              val => val >= item.firstValue && val < item.secondValue
            )
            break
          case 'more':
            this.setColorFormatter(item.warnColor, val => val > item.firstValue)
            break
          case 'less':
            this.setColorFormatter(item.warnColor, val => val < item.firstValue)
            break
          case 'moreOrEqual':
            this.setColorFormatter(
              item.warnColor,
              val => val >= item.firstValue
            )
            break
          case 'lessOrEqual':
            this.setColorFormatter(
              item.warnColor,
              val => val <= item.firstValue
            )
            break
          case 'equal':
            this.setColorFormatter(
              item.warnColor,
              val => val === item.firstValue
            )
            break
          case 'notEqual':
            this.setColorFormatter(
              item.warnColor,
              val => val !== item.firstValue
            )
            break
        }
      })
      // 强行渲染
      this.key++
    },
    setColorFormatter(color, fn) {
      // 符合条件变为预警颜色，其余保持原有颜色
      if (this.typeName === 've-bar' || this.typeName === 've-histogram') {
        // 柱状图折线图数据颜色体现在度量，用seriesIndex
        this.chartExtend.series.itemStyle.normal.color = function(params) {
          return fn(params.data) ? color : DEFAULT_COLORS[params.seriesIndex]
        }
      } else if (this.typeName === 've-pie') {
        // 饼图数据颜色体现在维度，用dataIndex
        this.chartExtend.series.itemStyle.normal.color = function(params) {
          return fn(params.data.value)
            ? color
            : DEFAULT_COLORS[params.dataIndex]
        }
      }
    }
  },
  computed: {
    titleStyle() {
      return {
        padding: '20px 10px',
        color: this.config.title.textStyle.color,
        fontSize: this.config.title.textStyle.fontSize + 'px',
        textAlign: this.config.title.textAlign,
        height: 'auto'
      }
    }
  }
}
</script>

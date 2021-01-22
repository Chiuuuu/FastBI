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
      v-if="this.chartData.columns.length > 0"
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
      colors: []
    }
  },
  watch: {
    config: {
      handler(val) {
        if (val) {
          // 图例
          this.legendVisible = val.legend && val.legend.show
          this.chartExtend = { ...val }

          // this.colors = [...val.colors]
          // this.$log.primary('========>chartExtend')
          // this.$print(this.chartExtend)
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
              this.chartData = val.source
              return
            }
          }
          this.chartData.columns = val.columns
          this.chartData.rows = val.rows

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

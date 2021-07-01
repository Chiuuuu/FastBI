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
        // 判断是否启用了联动
        if (!self.isClickLink) {
          return
        }
        self.$nextTick(() => {
          let chart = self.$refs.chart.echarts
          // 重复选择数据，进行重置
          if (self.currentIndex === e.dataIndex) {
            // 重置数据颜色样式
            delete self.chartExtend.series.itemStyle.normal.color
            // 强行渲染
            self.key++
            self.$emit('resetOriginData', self.id)
            return
          }
          // 鼠标单击时选中,选中颜色不变，其余变暗
          if (self.typeName === 've-bar' || self.typeName === 've-histogram') {
            // 柱状图折线图数据颜色体现在度量，用seriesIndex
            self.chartExtend.series.itemStyle.normal.color = function(params) {
              return params.dataIndex === e.dataIndex
                ? DEFAULT_COLORS[params.seriesIndex]
                : self.hexToRgba(DEFAULT_COLORS[params.seriesIndex], 0.4)
            }
          } else if (self.typeName === 've-pie') {
            // 饼图数据颜色体现在维度，用dataIndex
            self.chartExtend.series.itemStyle.normal.color = function(params) {
              return params.dataIndex === e.dataIndex
                ? DEFAULT_COLORS[params.dataIndex]
                : self.hexToRgba(DEFAULT_COLORS[params.dataIndex], 0.4)
            }
          }
          // 记录当前选择数据的index
          self.currentIndex = e.dataIndex
          // 强行渲染
          self.key++
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
      chartLegend:{},
      key: 0,
      currentIndex: '' // 记录当前选择的度量数据(图表联动)
    }
  },
  watch: {
    config: {
      handler(val) {
        if (val) {
          // 图例
          this.legendVisible = val.legend && val.legend.show
          if (this.typeName === 've-map') {
            this.chartExtend = { ...omit(val, ['series']) }
            this.chartSeries = deepClone(val.series)
            // this.setMapFormatter()
          } else {
            this.chartExtend = deepClone(val)
            // 保留两位小数
            if (this.typeName !== 've-gauge' && this.typeName !== 've-ring') {
              let type = this.typeName
              let chartType = this.chartType
              this.chartExtend.series.label.formatter = function(params) {
                if (type === 've-line') {
                  return params.data[1].toFixed(2)
                } else if (type === 've-pie') {
                  // 嵌套饼图不需要拼接显示内容
                  if (chartType === 'v-multiPie') {
                    return params.data.value.toFixed(2)
                  }
                  let list = val.series.label.formatterSelect
                  let str = []
                  list.forEach(item => {
                    let val = params[item]
                    if (typeof val === 'number') {
                      val = +parseFloat(val).toFixed(2)
                    }
                    if (item === 'percent') {
                      val += '%'
                    }
                    str.push(val)
                  })
                  return str.join(' ')
                } else if (type === 've-radar') {
                  return params.value.toFixed(2)
                } else {
                  return params.data.toFixed(2)
                }
              }
            }
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
            // 没有删完维度度量的时候不改变图表
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
    // 添加了图表联动的图表也要添加重置图表事件
    if (this.isClickLink) {
      this.setChartClick()
    }
  },
  beforeDestroy() {
    removeResizeListener(this.$refs.wrap, this._calcStyle)
  },
  methods: {
    afterConfig(options) {
      options = deepClone(options);
      console.log('op', options)
      // 散点图
      if(this.typeName === 've-scatter'){
        // tooltip显示
        options.tooltip.formatter = function(params){
          let val= params.value;
          if(val.length<6){ return ''};
          return `${params.marker}<br/>
                  ${val[5]}：${val[2]}<br/>
                  ${val[3]}：${val[0]}<br/>
                  ${val[4]}：${val[1]}<br/>
                  `;
        }
        options.series.forEach(item=>{
          // 图形属性 -- 散点颜色 -- 单色
          this.apis.scatterColor === '0' ? item.color = '#68ABDA' : delete item.color

          // 散点图大小设置
          let scatterSize = this.apis.scatterSize;
          if(scatterSize){
            let max = scatterSize === '0' ? this.apis.xMax:this.apis.yMax;
            item.symbolSize = function(val){
              let num = val[scatterSize];
              return max === 0 ? 8:(20/max)*num+8;
            }
          }
        })
        
      }
      
      
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
    // 地图显示内容格式拼接
    setMapFormatter() {
      for (let series of this.chartSeries) {
        // 指标内容
        let orient = series.label.normal.orient
        series.label.normal.formatter = function(params) {
          if (!params.data) {
            return params.name
          }
          let str = []
          series.pointShowList.forEach(item => {
            let val = params.data[item]
            if (typeof val === 'number') {
              val = +parseFloat(val).toFixed(2)
            }
            str.push(val)
          })
          str = orient === 'vertical' ? str.join('\n') : str.join(':')
          return str
        }
        series.tooltip.formatter = function(params) {
          if (!params.data) {
            return params.name
          }
          let str = []
          series.tooltipShowList.forEach(item => {
            let val = params.data[item]
            if (typeof val === 'number') {
              val = +parseFloat(val).toFixed(2)
            }
            str.push(val)
          })
          return str.join(':')
        }
      }
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
        ? `rgba(${parseInt('0x' + hex.slice(1, 3))},${parseInt(
            '0x' + hex.slice(3, 5)
          )},${parseInt('0x' + hex.slice(5, 7))},${opacity})`
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
    },
    // 是否开启图表联动
    isClickLink() {
      return this.apiData.interactive && this.apiData.interactive.clickLink
    }
  }
}
</script>
<style lang="less" scoped>
.chart-event {
  pointer-events: auto !important;
}
</style>

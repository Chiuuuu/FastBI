<template>
  <!-- 3D饼图和柱形图 -->
  <div class="dvs-high">
    <div class="container" ref="container"></div>
  </div>
</template>
<script>
export default {
  props: {
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
      chart: null
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.chart = this.$highCharts.chart(
        this.$refs.container,
        this.setting.config
      )
    }
  },
  watch: {
    setting: {
      handler(val) {
        val.config.chart.width = val.view.width
        val.config.chart.height = val.view.height
        // this.$highCharts.chart(this.$refs.container, val.config);
        this.chart.update(val.config)
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
        //单维度
        if (!val.source) {
          return
        }
        let _dimensions = val.dimensions[0].alias
        //判断是否单度量和多度量
        let _measure = val.measures.map(item => item.alias),
          series = []

        _measure.forEach(key => {
          series.push({
            name: key,
            data: val.source.rows.map(x => ({
              name: x[_dimensions],
              y: x[key]
            }))
          })
        })
        if (series.length == 0) {
          return
        }
        this.setting.config.series = [...series]
        this.chart = this.$highCharts.chart(
          this.$refs.container,
          this.setting.config
        )
        //this.chart.update(this.setting.config);//只能更新原来的一个或两个series，哪怕多加series，也不会起作用
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

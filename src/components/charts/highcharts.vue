<template>
  <!-- 3D饼图和柱形图 -->
  <div class="dvs-high">
    <div id="container"></div>
  </div>
</template>
<script>
export default {
  props:{
    setting:{
      type: Object,
      required: true,
    }
  },
  data() {
    return {}
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.$highCharts.chart('container', this.setting.config)
    },
  },
  watch: {
    setting:{
      handler(val){
        val.config.chart.width=val.view.width;
        val.config.chart.height=val.view.height;
        this.$highCharts.chart('container', val.config)
      },
      deep:true,
      // immediate:true
    }
  },
}
</script>
<style lang="less" scoped>
.dvs-high {
  width: 100%;
  height: 100%;
  #container {
    display: table-cell;
    position:absolute;
    width:100%;
    height: 100%;
    ::v-deep .highcharts-container {
      width: 100% !important;
      height: 100% !important;
    }
  }
}
</style>
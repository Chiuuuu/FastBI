<template>
  <!-- 3D饼图和柱形图 -->
  <div class="dvs-high">
    <div class="container" ref="container"></div>
  </div>
</template>
<script>
export default {
  props:{
    setting:{
      type: Object,
      required: true,
    },
    apiData: {
      type: Object,
      required: true
    },
  },
  data() {
    return {
      chart:null,
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.chart = this.$highCharts.chart(this.$refs.container, this.setting.config);
    },
  },
  watch: {
    setting:{
      handler(val){
        val.config.chart.width=val.view.width;
        val.config.chart.height=val.view.height;
        // this.chart.options.chart.width = val.view.width
        // this.chart.options.chart.height = val.view.height
        // this.chart.options = Object.assign(this.chart.options,val.config);
        this.$highCharts.chart(this.$refs.container, val.config)
        // this.chart.redraw(false);
      },
      deep:true,
      // immediate:true
    },
    apiData:{
      handler(val){
       /* 
        dimensions //维度（name）
        measures//度量(value)
      */
        let obj = {
          key:val.dimensions[0].alias,
          val:val.measures[0].alias
        };
        let _source = val.source.rows.map(item=>({
          name:item[obj.key]==null?'':item[obj.key],
          y:item[obj.val]==null?0:item[obj.val]
        }));
        this.setting.config.series[0].data = [..._source];
        this.$highCharts.chart(this.$refs.container, this.setting.config)
      }
    }
  },
}
</script>
<style lang="less" scoped>
.dvs-high {
  width: 100%;
  height: 100%;
  .container {
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
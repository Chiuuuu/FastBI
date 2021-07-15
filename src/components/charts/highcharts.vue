<template>
  <!-- 3D饼图和柱状图 -->
  <div class="dvs-high">
    <div class="container" ref="container" :style="styleObj"></div>
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
      chart: null,
      styleObj: {}
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.getBackgroundColor(this.setting.background);
      this.chart = this.$highCharts.chart(
        this.$refs.container,
        this.setting.config
      )
    },
    getBackgroundColor(objcolor){
      // this.styleObj = {};
      let type = objcolor.backgroundType;
      this.styleObj = {
        background:type === '1'? objcolor.backgroundColor: `url(${objcolor.backgroundImage})`,
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
        val.config.chart.width = val.view.width;
        val.config.chart.height = val.view.height;
        // console.log('background',val.background);
        // this.$highCharts.chart(this.$refs.container, val.config);
        this.getBackgroundColor(val.background);
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
        if((val.dimensions.length==0&&val.measures.length==0)){
          this.chart = this.$highCharts.chart(
            this.$refs.container,
            this.setting.config
          );
          return;
        }
        if (!val.source|val.dimensions.length==0|val.measures.length==0) {
          return
        }
        if(val.source.rows.length==0){
          this.setting.config.series = [];
        }else{
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
        }
        
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

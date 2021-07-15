<template>
  <!-- 矩形热力图 -->
  <div class="dvs-heat" ref="dvsheat" :style="styleObj"></div>
</template>
<script>
export default {
  props: {
    config: {
      type: Object,
      required: true
    },
    apiData: {
      type: Object,
      required: true
    },
    view: {
      type: Object
    },
    background: {
      type: Object
    }
  },
  data() {
    return {
      mychart: null,
      option: {},
      styleObj: {}
    }
  },
  mounted() {
    this.Init()
  },
  methods: {
    Init(val) {
      this.option = val ? val : this.config
      this.mychart = this.$echarts.init(this.$refs.dvsheat)
      this.mychart.setOption(val ? val : this.config,true)
    }
  },
  watch: {
    config: {
      handler(val) {
        // if(val.title.text!=="矩形热力图"){
        //   debugger
        //   let max = val.series.data.map(item=>item.value);
        //   val.visualMap.max = Math.max(...max)
        // }
        this.Init(val)
      },
      deep: true
      //   immediate:true
    },
    view: {
      handler(val) {
        if (this.mychart !== null) {
          this.mychart.resize()
        }
      },
      deep: true,
      immediate: true
    },
    apiData: {
      handler(val) {
        if (val.source) {
          if (!val.source.rows) {
            return
          }
          let list = val.source.rows;
          //判断是否为旭日图
          if (this.config.title.text === '旭日图') {
            let max = list.map(item=>item.value);
            this.option.visualMap.max = Math.max(...max)
            this.option.series.data = [...list];
            this.mychart.setOption(this.option);
          } else {
            //维度
            let dim = val.dimensions.map((x) => x.alias);
            //度量
            let mea = val.measures.map((y) => y.alias);
            if(dim.length==0|mea.length==0){
              return;
            }
            //获取度量数组
            let meaarr = list.map((h) => h[mea[0]])
            let _series = list.map((item) => [
              item[dim[0]],
              item[dim[1]],
              item[mea[0]],
            ])
            if (this.mychart != null) {
              //   this.option.xAxis.data = val.source.rows.map(x=>(x[dim[0]]));
              this.option.visualMap.max = Math.max(...meaarr)
              this.option.series.data = [..._series]
              this.mychart.setOption(this.option);
            }
            // console.clear();
          }
        }
      },
      deep: true,
      // immediate: true,
    },
    background: {
      handler(objcolor) {
        let type = objcolor.backgroundType;
        this.styleObj = {
          background:type === '1'? objcolor.backgroundColor: `url(${objcolor.backgroundImage})`,
              //  backgroundColor: val.backgroundColor,
          'border-color': objcolor.borderColor,
          'border-width': objcolor.borderWidth + 'px',
          'border-style': objcolor.borderStyle,
          'border-radius': objcolor.borderRadius + 'px'
        }
        // for (const key in val) {
        //   let _key = key
        //     .replace(/::/g, '/')
        //     .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
        //     .replace(/([a-z\d])([A-Z])/g, '$1_$2')
        //     .replace(/_/g, '-')
        //     .toLowerCase();
        //   this.$set(
        //     this.styleObj,
        //     _key,
        //     key == 'backgroundImage' ? `url(${val[key]})` : (typeof val[key])==='number'?`${val[key]}px`:val[key]
        //   )
        //   // this.styleObj[_key] = val[key];
        // }
      },
      deep: true,
      immediate: true
    }
  }
}
</script>
<style lang="less" scoped>
.dvs-heat {
  width: 100%;
  height: 100%;
  min-height: 400px;
}
</style>

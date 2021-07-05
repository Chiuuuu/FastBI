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
      this.mychart.setOption(val ? val : this.config)
    }
  },
  watch: {
    config: {
      handler(val) {
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
        if (val.source.rows) {
          //维度
          let dim = val.dimensions.map(x => x.alias)
          //度量
          let mea = val.measures.map(y => y.alias)
          //获取度量数组
          let meaarr = val.source.rows.map(h => h[mea[0]])
          let _series = val.source.rows.map(item => [
            item[dim[0]],
            item[dim[1]],
            item[mea[0]]
          ])
          if (this.mychart != null) {
            //   this.option.xAxis.data = val.source.rows.map(x=>(x[dim[0]]));
            this.option.visualMap.max = Math.max(...meaarr)
            this.option.series.data = [..._series]
            this.mychart.setOption(this.option)
          }
        }
      },
      deep: true,
      immediate: true
    },
    background: {
      handler(val) {
        for (const key in val) {
          let _key = key
            .replace(/::/g, '/')
            .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
            .replace(/([a-z\d])([A-Z])/g, '$1_$2')
            .replace(/_/g, '-')
            .toLowerCase()
          this.$set(
            this.styleObj,
            _key,
            key == 'backgroundImage' ? `url(${val[key]})` : val[key]
          )
          // this.styleObj[_key] = val[key];
        }
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

<template>
  <div class="dv-text" style="width: 100%;height:100%;" ref="wrap">
    <div class="titles" ref="titles" v-if="config.title" :style="titleStyle">
      <span>{{ config.title.content }}</span>
    </div>
    <!-- <el-input type="textarea"></el-input> -->
    <!-- <div :style="[width,height]"></div> -->
    <!-- <div style="border:1px solid;" ></div> -->
     <!-- <b-input type="textarea" :rows="4" placeholder="禁用拖动，默认4行" no-resize  @click.native.stop.prevent="divClick"></b-input> -->
  </div>
</template>

<script>
  import { addResizeListener, removeResizeListener } from 'bin-ui/src/utils/resize-event'
  import { formatData, convertData } from '../../utils/formatData'

  export default {
    name: 'ChartsText',
    props: {
      config: {
        type: Object,
        required: true
      }
    },
    data () {
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
        colors: []
      }
    },
    mounted () {
      this._calcStyle()
      addResizeListener(this.$refs.wrap, this._calcStyle)
    },
    beforeDestroy () {
      removeResizeListener(this.$refs.wrap, this._calcStyle)
    },
    methods: {
      afterConfig (options) {
        if (this.typeName === 've-map') {
          let data = [...options.series[0].data]
          options.series[0].data = convertData(data)
        }
        return options
      },
      _calcStyle () {
        const wrap = this.$refs.wrap
        // const title = this.$refs.titles
        if (!wrap) return
        let width = wrap.clientWidth
        let height = wrap.clientHeight
        // if (this.config.title) {
        //   height -= title.clientHeight
        // }
        this.width = width + 'px'
        this.height = height + 'px'
      },
      divClick() {
        console.log(123)
      }
    },
    computed: {
      titleStyle () {
        return {
          padding: '0 10px',
          color: this.config.title.textStyle.color,
          fontSize: this.config.title.textStyle.fontSize + 'px',
          textAlign: this.config.title.textAlign
        }
      }
    }
  }
</script>

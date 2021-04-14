<template>
  <div class="dv-steep-bar" ref="wrap" :style="backgroundStyle">
    <!--底部条-->
    <div class="background-bar" :style="barStyle">
      <!--数值条-->
      <div class="value-bar" :style="contentStyle"></div>
    </div>
  </div>
</template>

<script>
import {
  addResizeListener,
  removeResizeListener
} from 'bin-ui/src/utils/resize-event'

export default {
  name: 'SteepBar',
  props: {
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
    return {
      width: '400px',
      height: '200px',
      chartData: {
        columns: ['x', 'y'],
        rows: [{ x: 'x', y: 100 }]
      },
      backgroundStyle: {},
      barStyle: {},
      contentStyle: {}
    }
  },
  watch: {
    config: {
      handler(val) {
        if (val) {
          this.barStyle = {
            height: val.common.height + 'px',
            background: val.buttonBar.background,
            borderRadius: val.buttonBar.borderRadius
          }
          this.contentStyle = {
            height: val.common.height + 'px',
            background: val.valueBar.background,
            borderRadius: val.valueBar.borderRadius
          }
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
      return options
    },
    _calcStyle() {
      const wrap = this.$refs.wrap
      if (!wrap) return
      let width = wrap.clientWidth
      let height = wrap.clientHeight
      this.width = width + 'px'
      this.height = height + 'px'
    }
  }
}
</script>
<style lang="less" scoped>
.dv-steep-bar {
  width: 100%;
  height: 100%;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  .background-bar {
    position: relative;
    width: 100%;
    overflow: hidden;
    .value-bar {
      position: absolute;
      left: 0;
      right: 0;
    }
  }
}
</style>

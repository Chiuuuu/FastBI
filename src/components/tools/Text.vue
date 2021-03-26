<template>
  <a-textarea
    class="dv-text"
    :key="key"
    placeholder="点击以输入文本内容，输入*按键可插入度量"
    v-model="selfConfig.title.content"
    ref="text"
    :style="titleStyle"
    :disabled="true"
    :autoSize="{ minRows: 2, maxRows: 50 }"
    @blur="textChange"
  />
  <!-- <div class="dv-text" style="width: 100%;height:100%;" ref="wrap">
    <div class="titles" ref="titles" v-if="config.title" :style="titleStyle">
      <span>{{ config.title.content }}</span>
    </div>
  </div>-->
</template>

<script>
import { deepClone } from '@/utils/deepClone'
import { mapActions } from 'vuex'
export default {
  name: 'ChartsText',
  props: {
    config: {
      type: Object,
      required: true
    },
    background: {
      type: Object,
      required: true
    },
    id: {
      default: 0
    }
  },
  watch: {
    config: {
      handler(val) {
        console.log(val)
        if (val) {
          this.selfConfig = val
        }
      },
      deep: true,
      immediate: true
    }
  },
  data() {
    return {
      selfConfig: {},
      key: 0
    }
  },
  created() {
    this.selfConfig = deepClone(this.config)
  },
  mounted() {},
  methods: {
    ...mapActions(['saveScreenData', 'updateChartData']),
    // 实时保存文本
    textChange() {
      this.$store.dispatch('SetSelfProperty', this.selfConfig)
      this.updateChartData()
    }
  },
  computed: {
    titleStyle() {
      return {
        padding: '0 10px',
        color: this.config.title.textStyle.color,
        fontSize: this.config.title.textStyle.fontSize + 'px',
        textAlign: this.config.title.textAlign,
        fontFamily: this.config.title.textStyle.fontFamily,
        background: 'none',
        border: 'none',
        ...this.background
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
// .dv-text{
//     resize:none;
// }

// .dv-text:hover{

//   border-right:none !important;

// }

// .dv-text:focus{

//   border-right:none !important;

// }
</style>

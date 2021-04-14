<template>
  <div class="text-box" :style="backgroundStyle">
    <div
      :class="['dv-text', { 'cursor-text': canEdit }]"
      ref="text"
      :contenteditable="canEdit"
      v-html="innerText ? `<p>${innerText}</p>` : ''"
      :style="contentStyle"
      placeholder="点击以输入文本内容"
      @mousedown.stop
      @focus="locked = true"
      @blur="locked = false"
      @input="textChange"
    ></div>
  </div>
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
    },
    canEdit: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    config: {
      handler(val) {
        if (val) {
          this.selfConfig = val
          if (!this.locked) {
            this.innerText = this.selfConfig.title.text
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
  data() {
    return {
      selfConfig: {},
      backgroundStyle: {},
      key: 0,
      innerText: '',
      locked: false
    }
  },
  created() {
    this.selfConfig = deepClone(this.config)
  },
  mounted() {},
  methods: {
    ...mapActions(['saveScreenData', 'updateChartData']),
    // 实时保存文本
    textChange(e) {
      this.selfConfig.title.text = e.target.innerText
      this.$store.dispatch('SetSelfProperty', this.selfConfig)
      this.updateChartData()
    }
  },
  computed: {
    contentStyle() {
      return {
        padding: '0 10px',
        color: this.config.title.textStyle.color,
        fontSize: this.config.title.textStyle.fontSize + 'px',
        textAlign: this.config.title.textAlign,
        fontFamily: this.config.title.textStyle.fontFamily,
        fontWeight: this.config.title.textStyle.fontWeight
      }
    }
  }
}
</script>

<style lang="less" scoped>
.text-box {
  height: 100%;
  pointer-events: auto !important;
  overflow: hidden;
  word-wrap: break-word;
  word-break: break-all;
}
.dv-text {
  resize: none;
  padding: 2px 5px 10px 5px;
  min-height: 30%;
  cursor: default;
  &.cursor-text {
    cursor: text;
  }
  &[contenteditable='true'] {
    &:empty:before {
      content: attr(placeholder);
      display: block;
    }
  }
}

// .dv-text:hover{

//   border-right:none !important;

// }

// .dv-text:focus{

//   border-right:none !important;

// }
</style>

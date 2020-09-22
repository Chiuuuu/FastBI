<template>
<a-textarea class="dv-text" placeholder="点击以输入文本内容，输入*按键可插入度量" v-model="config.title.content" ref="text" :style="titleStyle" :autoSize="true" :disabled="true" />
  <!-- <div class="dv-text" style="width: 100%;height:100%;" ref="wrap">
    <div class="titles" ref="titles" v-if="config.title" :style="titleStyle">
      <span>{{ config.title.content }}</span>
    </div>
  </div> -->
</template>

<script>

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
        type: Number,
        default: 0
      }
    },
    data () {
      return {
      }
    },
    mounted () {
    },
    methods: {
    },
    computed: {
      titleStyle () {
        return {
          padding: '0 10px',
          color: this.config.title.textStyle.color,
          fontSize: this.config.title.textStyle.fontSize + 'px',
          textAlign: this.config.title.textAlign,
          background: 'none',
          border: 'none',
          ...this.background
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>
.dv-text:hover{
  border-right:none !important;
}
.dv-text:focus{
  border-right:none !important;
}
</style>

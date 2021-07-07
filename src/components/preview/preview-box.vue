<template>
  <div class="preview-box" :style="contentStyles">
    <div class="preview-wrap" :style="dvWrapperStyles">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  created() {
    this.transformData = { ...this.item.setting.view }
  },
  watch: {
    item: {
      handler(val) {
        if (val) {
          this.transformData = { ...val.setting.view }
        }
      },
      deep: true
    }
  },
  computed: {
    ...mapGetters(['currentSelected']),
    contentStyles() {
      let result
      if (this.dragScale) {
        result = {
          width: this.transformData.width / this.dragScale.x + 'px',
          height: this.transformData.height / this.dragScale.y + 'px'
        }
      }
      result = {
        width: this.transformData.width + 'px',
        height: this.transformData.height + 'px'
      }
      if (this.item.setting.config.title === '直线') {
      }
      result.transform = `translate3d(${this.transformData.x}px,${
        this.transformData.y
      }px,0)`
      return result
    },
    dvWrapperStyles() {
      let result
      if (this.dragScale) {
        result = {
          width: this.transformData.width / this.dragScale.x + 'px',
          height: this.transformData.height / this.dragScale.y + 'px'
        }
      }
      result = {
        width: this.transformData.width + 'px',
        height: this.transformData.height + 'px'
      }
      result.transform = `translateZ(0) rotate(${this.transformData.rotate ||
        0}deg)`
      if (this.item.setting.config.title === '直线') {
        result.transformOrigin = this.transformData.origin
      }
      return result
    }
  }
}
</script>

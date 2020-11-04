<template>
  <a-modal
    :visible="isShow"
    title="编辑描述"
    @ok="handleSave"
    @cancel="handleClose"
  >
    <a-textarea
      v-model="describe"
      placeholder="请输入描述内容"
      style="height:200px;resize:unset"
    />
  </a-modal>
</template>

<script>
export default {
  name: 'describeSetting',
  props: {
    isShow: Boolean,
    description: String
  },
  data() {
    return {
      describe: this.description
    }
  },
  watch: {
    isShow: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.describe = this.description
        }
      }
    }
  },
  methods: {
    handleSave() {
      this.$set(this.$parent.detailInfo, 'description', this.describe)
      this.handleClose()
    },
    handleClose() {
      this.$emit('close')
    }
  }
}
</script>

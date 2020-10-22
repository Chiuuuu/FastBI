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
  props: {
    isShow: Boolean,
    description: String
  },
  computed: {
    describe: {
      get() {
        return this.description
      },
      set(value) {
        this.$set(this.$parent.detailInfo, 'description', value)
      }
    }
  },
  methods: {
    handleSave() {
      this.handleClose()
    },
    handleClose() {
      this.$emit('close')
    }
  }
}
</script>

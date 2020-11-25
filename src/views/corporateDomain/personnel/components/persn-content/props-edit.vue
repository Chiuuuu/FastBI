<template>
  <span v-if="activeIndex !== index">
    {{ title }} <a-icon class="edit-icon" type="form" @click="handleEditProp" />
  </span>
  <div v-else>
    <a-input style="width:120px" v-model="editValue"></a-input>
    <a style="margin-right:5px" @click="handleSave">保存</a>
    <a @click="handleCancel">取消</a>
  </div>
</template>

<script>
export default {
  name: 'propsEdit',
  props: {
    title: String,
    activeIndex: Number,
    index: Number
  },
  data() {
    return {
      editValue: this.title
    }
  },
  methods: {
    handleValidateIndex() {
      if (this.activeIndex === -1) {
        return true
      } else {
        this.$message.error('请完成操作')
        return false
      }
    },
    handleEditProp() {
      if (this.handleValidateIndex()) {
        this.$emit('changePropsEdit', this.index)
      }
    },
    handleSave() {
      this.$emit('savePropsEdit', this.index, this.editValue)
    },
    handleCancel() {
      this.$emit('cancelPropsEdit')
    }
  }
}
</script>

<style>

</style>

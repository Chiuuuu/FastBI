<template>
  <a-modal
    title="添加自定义SQL视图"
    :visible="isShow"
    destroyOnClose
    @ok="handleSave"
    @cancel="handleClose"
  >
    <a-form-model
      :form="form"
      :rules="rules"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 20 }"
    >
      <a-form-model-item label="视图名称" prop="name">
        <a-input placeholder="请输入视图名称" v-model="form.name"></a-input>
      </a-form-model-item>
      <a-form-model-item label="SQL语句" prop="content">
        <a-textarea style="height:200px;resize:unset" v-model="form.content" />
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
export default {
  props: {
    isShow: Boolean,
    sqlForm: Object
  },
  data() {
    return {
      form: {
        name: '',
        content: ''
      },
      rules: {
        name: [
          {
            required: true,
            message: '请输入视图名称'
          }
        ],
        content: [
          {
            required: true,
            message: '请输入SQL语句'
          }
        ]
      }
    }
  },
  watch: {
    isShow(newValue, oldValue) {
      if (newValue) {
        this.form = Object.assign(this.form, this.sqlForm)
      }
    }
  },
  methods: {
    handleClose() {
      this.$emit('close')
    },
    handleSave() {
      this.handleClose()
    }
  }
}
</script>

<style>

</style>

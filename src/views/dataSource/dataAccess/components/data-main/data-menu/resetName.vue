<template>
  <a-modal
    :visible="visible"
    :title="resetName.type === 'reset' ? '文件夹重命名' : '新建文件夹'"
    cancelText="取消"
    okText="确定"
    :afterClose="handleAfterClose"
    @cancel="
      () => {
        $emit('cancel');
      }
    "
    @ok="handleOk"
  >
    <a-form-model :model="form" :rules="rules" ref="resetNameForm" class="resetNameForm">
      <a-form-model-item label="文件夹名称" prop="name">
        <a-input v-model="form.name" />
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>
<script>
export default {
  name: 'resetName',
  props: ['visible', 'resetName'],
  data() {
    return {
      form: {
        name: ''
      },
      rules: {
        name: [
          {
            required: true,
            message: '请填写名称'
          },
          {
            type: 'string',
            min: 1,
            max: 20,
            message: '长度在1~20内'
          }
        ]
      }
    }
  },
  watch: {
    visible(newValue, oldValue) {
      if (newValue) {
        const type = this.resetName.type
        const name = type === 'reset' ? this.resetName.item.name : ''
        this.$set(this.form, 'name', name)
      }
    }
  },
  methods: {
    /**
     * 弹出框完成关闭后
    */
    handleAfterClose() {
      this.$refs.resetNameForm.resetFields()
    },
    handleOk() {
      this.$refs.resetNameForm.validate()
        .then(res => {
          this.$emit('create', this.form)
        })
        .catch(err => err)
    }
  }
}
</script>
<style lang="less" scoped>
/deep/ .resetNameForm .ant-form-explain {
  margin-left: 0;
}
</style>

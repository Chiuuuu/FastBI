<template>
  <a-modal
    :visible="visible"
    title="新建文件夹"
    cancelText="取消"
    okText="确定"
    :afterClose="handleAfterClose"
    @cancel="
      () => {
        $emit('cancel');
      }
    "
    @ok="
      () => {
        $emit('create');
      }
    "
  >
    <a-form layout="vertical" :form="form" class="resetNameForm">
      <a-form-item label="文件夹名称">
        <a-input
          v-decorator="[
            'name',
            {
              rules: [
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
          ]"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script>
export default {
  name: 'resetName',
  props: ['visible'],
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: 'form_in_modal' })
  },
  methods: {
    /**
     * 弹出框完成关闭后
    */
    handleAfterClose() {
      this.form.resetFields()
    }
  }
}
</script>
<style lang="less" scoped>
/deep/ .resetNameForm .ant-form-explain {
  margin-left: 0;
}
</style>

<template>
  <a-modal
    width="600px"
    :title="!isNew ? '修改标签' : '新建标签'"
    :visible="visible"
    :bodyStyle="bodyStyle"
    :maskClosable="false"
    :keyboard="false"
    :confirmLoading="loading"
    @cancel="handleClose"
    @ok="handleSaveForm"
  >
    <a-form-model
      class="form-label"
      labelAlign="left"
      ref="form"
      :model="form"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-model-item label="标签名称" prop="name">
        <a-input v-model="form.name" placeholder="请填写标签名称"></a-input>
      </a-form-model-item>
      <a-form-model-item label="标签描述" prop="description">
        <a-textarea v-model="form.description" placeholder="请填写标签描述"></a-textarea>
      </a-form-model-item>
      <a-form-model-item label="版本号" prop="userVersion">
        <a-input v-model="form.userVersion" placeholder="请填写版本号"></a-input>
        <!-- <span>{{ form.version }}</span> -->
      </a-form-model-item>
      <a-form-model-item v-if="!isNew" class="form-not-required" label="修改原因" prop="reason">
        <a-input v-model="form.reason" placeholder="选填"></a-input>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
import formMixin from '../mixins/form'
export default {
  name: 'labelForm',
  mixins: [formMixin],
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    rowData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      bodyStyle: { padding: '10px 24px', 'max-height': 'calc(100vh - 240px)', 'overflow-y': 'auto' },
      form: {
        name: '',
        description: '',
        userVersion: '1',
        version: 1,
        reason: ''
      },
      rules: {
        name: [
          { required: true, message: '请填写标签名称' },
          { max: 10, message: '请填写小于10字的标签名称' }
        ],
        description: [
          { required: true, message: '请填写标签描述' },
          { max: 50, message: '请填写小于50字的标签描述' }
        ],
        userVersion: [
          { required: true, message: '请填写版本号' },
          { pattern: /^\d+$/, message: '请填写数字' }
        ],
        reason: [
          { max: 50, message: '请填写小于50字的修改原因' }
        ]
      }
    }
  },
  computed: {
    isNew() {
      return !this.rowData.id
    }
  },
  methods: {
    handleResetForm() {
      this.form = this.$options.data().form
      this.reason = ''
      this.$refs.form && this.$refs.form.resetFields()
    },
    handleSaveForm() {
      this.$refs.form.validate(async (ok, obj) => {
        if (ok) {
          this.loading = true
          const params = {
            ...this.form
          }

          let res = null
          if (!this.isNew) {
            params.id = this.rowData.id
            res = await this.$server.label.putLabel(params)
              .finally(() => {
                this.loading = false
              })
          } else {
            res = await this.$server.label.addLabel(params)
              .finally(() => {
                this.loading = false
              })
          }

          if (res.code === 200) {
            this.$message.success(this.isNew ? '新建标签成功' : '修改标签成功')
            this.$emit('refresh')
            this.handleClose()
          } else {
            this.$message.error(res.msg)
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import url("../common");
</style>

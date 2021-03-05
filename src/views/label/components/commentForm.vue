<template>
  <a-modal
    width="600px"
    title="标签评估"
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
      <a-form-model-item class="form-not-required" label="标签名称" prop="name">
        <span>{{ form.name }}</span>
      </a-form-model-item>
      <a-form-model-item label="评估" prop="content">
        <a-textarea v-model="form.content" placeholder="请填写评估内容"></a-textarea>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
import formMixin from '../mixins/form'
export default {
  name: 'commentForm',
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
        content: ''
      },
      rules: {
        content: [
          { required: true, message: '请填写评估内容' },
          { max: 50, message: '请填写小于50字的评估内容' }
        ]
      }
    }
  },
  methods: {
    handleSaveForm() {
      this.$refs.form.validate(async (ok, obj) => {
        if (ok) {
          const params = {
            tagId: this.rowData.id,
            content: this.form.content
          }

          this.loading = true
          const res = await this.$server.label.addLabelComment(params)
            .finally(() => {
              this.loading = false
            })

          if (res.code === 200) {
            this.$message.success('添加评估成功')
            this.$emit('refresh')
            this.handleClose()
          } else {
            this.$message.error(res.msg || '请求错误')
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

<template>
  <a-modal
    width="600px"
    title="标签审批"
    :visible="visible"
    :bodyStyle="bodyStyle"
    :maskClosable="false"
    :keyboard="false"
    :confirmLoading="loading"
    @cancel="handleClose"
  >
    <a-form-model
      class="form-label"
      labelAlign="left"
      ref="form"
      :model="form"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-model-item label="标签名称" prop="name">
        <span>{{ form.name }}</span>
      </a-form-model-item>
      <a-form-model-item label="标签描述" prop="description">
        <span>{{ form.description }}</span>
      </a-form-model-item>
      <a-form-model-item label="版本号" prop="version">
        <span>{{ form.version }}</span>
      </a-form-model-item>
    </a-form-model>
    <div slot="footer">
      <a-button type="danger" @click="handleReject">驳回</a-button>
      <a-button type="primary" @click="handlePass">通过</a-button>
    </div>
  </a-modal>
</template>

<script>
import formMixin from '../mixins/form'
export default {
  name: 'examForm',
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
        version: ''
      }
    }
  },
  methods: {
    handlePass() {
      this.handleExam(true)
    },
    handleReject() {
      this.handleExam(false)
    },
    async handleExam(accept) {
      const params = {
        id: this.rowData.id,
        version: this.rowData.version,
        accept
      }
      this.loading = true
      const res = await this.$server.label.putLabelState(params)
        .finally(() => {
          this.loading = false
        })

      if (res.code === 200) {
        this.$message.success('审核成功')
        this.$emit('refresh')
        this.handleClose()
      } else {
        this.$message.error(res.msg || '请求错误')
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import url("../common");
</style>

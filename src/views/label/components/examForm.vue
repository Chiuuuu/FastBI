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
      <a-form-model-item label="标签名称">
        <span>{{ rowData.name }}</span>
      </a-form-model-item>
      <a-form-model-item label="标签描述">
        <span>{{ rowData.description }}</span>
      </a-form-model-item>
      <a-form-model-item label="版本号">
        <span>{{ rowData.userVersion }}</span>
      </a-form-model-item>
      <a-form-model-item label="更新时间">
        <span v-if="rowData.updateTime === 0">每日</span>
        <span v-else-if="rowData.updateTime === 1">每周</span>
        <span v-else-if="rowData.updateTime === 2">每月</span>
        <span v-else-if="rowData.updateTime === 3">不更新</span>
        <span v-else></span>
      </a-form-model-item>
      <a-form-model-item label="达标模型">
        <span>{{ rowData.modelName }}</span>
      </a-form-model-item>
      <a-form-model-item label="达标规则">
        <span>{{ formatCondition(rowData) }}</span>
      </a-form-model-item>
      <a-form-model-item label="创建人">
        <span>{{ rowData.creUserName }}</span>
      </a-form-model-item>
      <a-form-model-item label="创建时间">
        <span>{{ rowData.gmtCreate }}</span>
      </a-form-model-item>
      <a-form-model-item label="修改人">
        <span>{{ rowData.modUserName }}</span>
      </a-form-model-item>
      <a-form-model-item label="修改时间">
        <span>{{ rowData.gmtModified }}</span>
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
  inject: ['formatCondition'],
  data() {
    return {
      bodyStyle: {
        padding: '10px 24px',
        'max-height': 'calc(100vh - 240px)',
        'overflow-y': 'auto'
      },
      form: {
        name: '',
        description: '',
        userVersion: ''
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
        userVersion: this.rowData.userVersion,
        version: this.rowData.version,
        accept
      }
      this.loading = true
      const res = await this.$server.label.putLabelState(params).finally(() => {
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
@import url('../common');
.ant-form-item {
  margin-bottom: 0;
}
</style>

<template>
  <a-modal
    width="600px"
    title="标签详情"
    :visible="visible"
    :bodyStyle="bodyStyle"
    :maskClosable="false"
    :keyboard="false"
    :footer="null"
    @cancel="$emit('close')"
  >
    <a-form-model
      class="form-label"
      labelAlign="left"
      ref="form"
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
  inject: ['formatCondition'],
  data() {
    return {
      bodyStyle: { padding: '10px 24px', 'max-height': 'calc(100vh - 240px)', 'overflow-y': 'auto' },
      form: {
        name: '',
        description: '',
        userVersion: 1,
        version: 1,
        reason: ''
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import url("../common");
.ant-form-item {
  margin-bottom: 0;
}
</style>

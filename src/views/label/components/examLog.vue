<template>
  <a-modal
    width="70vw"
    title="审批日志"
    :visible="visible"
    :bodyStyle="bodyStyle"
    :footer="null"
    :maskClosable="false"
    :keyboard="false"
    @cancel="handleClose"
  >
    <div class="main main-padding">
      <a-form-model ref="form" :model="form" layout="inline">
        <a-form-model-item label="标签名称" prop="name">
          <a-input v-model="form.name" placeholder="请输入标签名称"></a-input>
        </a-form-model-item>
        <a-form-model-item>
          <a-button type="primary" @click="handleGetData">查询</a-button>
        </a-form-model-item>
        <a-form-model-item>
          <a-button type="default" @click="handleResetForm">重置</a-button>
        </a-form-model-item>
      </a-form-model>

      <a-table
        rowKey="id"
        :columns="listColumn"
        :loading="listLoading"
        :data-source="listData"
        :pagination="false"
        :scroll="{ x: 'calc(70vw - 50px)', y: 'calc(100vh - 420px)' }"
      >
        <template #number="list, record, index">
          <span>{{ (pagination.current - 1) * pagination.pageSize + (index + 1) }}</span>
        </template>
      </a-table>

      <div class="list-pagination">
        <a-pagination
          v-if="listData.length > 0"
          showQuickJumper
          showSizeChanger
          :current="pagination.current"
          :pageSize="pagination.pageSize"
          :total="pagination.total"
          :show-total="total => `共${total}条记录`"
          @change="handlePageChange"
          @showSizeChange="handleSizeChange"
        ></a-pagination>
      </div>
    </div>
  </a-modal>
</template>

<script>
import paginationMixin from '../mixins/pagination'

const listColumn = [
  {
    title: '序号',
    width: 50,
    dataIndex: 'number',
    scopedSlots: { customRender: 'number' }
  },
  {
    title: '标签名称',
    width: 200,
    ellipsis: true,
    dataIndex: 'tagName'
  },
  {
    title: '版本号',
    dataIndex: 'userVersion',
    width: 120,
    ellipsis: true
  },
  {
    title: '审批情况',
    width: 100,
    ellipsis: true,
    dataIndex: 'type'
  },
  {
    title: '审批人',
    width: 100,
    ellipsis: true,
    dataIndex: 'creUserName'
  },
  {
    title: '审批时间',
    dataIndex: 'gmtCreate',
    width: 180,
    ellipsis: true
  }
]

export default {
  name: 'examLog',
  mixins: [paginationMixin],
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
      bodyStyle: { padding: '0 10px', height: 'calc(100vh - 240px)', 'overflow-y': 'auto' },
      form: {
        name: ''
      },
      listLoading: false,
      listColumn,
      listData: []
    }
  },
  mounted() {
    this.handleGetData()
  },
  methods: {
    handleClose() {
      this.handleResetForm()
      this.$emit('close')
    },
    async handleGetData() {
      this.listLoading = true

      const params = {
        current: this.pagination.current,
        pageSize: this.pagination.pageSize,
        name: this.form.name
      }

      const result = await this.$server.label.getExamLogList(params)
        .finally(() => {
          this.listLoading = false
        })
      if (result.code === 200) {
        this.listData = [].concat(result.rows)

        Object.assign(this.pagination, {
          current: params.current,
          total: result.total
        })
      } else {
        this.$message.error(result.msg || '请求错误')
      }
    },
    handleResetForm() {
      this.form = this.$options.data().form
      this.$refs.form && this.$refs.form.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
@import url("../common");
</style>

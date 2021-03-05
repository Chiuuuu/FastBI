<template>
  <a-modal
    width="70vw"
    title="标签评估记录"
    :visible="visible"
    :bodyStyle="bodyStyle"
    :footer="null"
    :maskClosable="false"
    :keyboard="false"
    @cancel="handleClose"
  >
    <div class="main main-padding">
      <a-table
        rowKey="id"
        :columns="listColumn"
        :loading="listLoading"
        :data-source="listData"
        :pagination="false"
        :scroll="{ x: 'calc(70vw - 50px)', y: 'calc(100vh - 400px)' }"
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
    title: '评估内容',
    width: 400,
    ellipsis: true,
    dataIndex: 'content'
  },
  {
    title: '评估人',
    width: 100,
    ellipsis: true,
    dataIndex: 'creUserName'
  },
  {
    title: '评估时间',
    dataIndex: 'gmtCreate',
    width: 180,
    ellipsis: true
  }
]

export default {
  name: 'commentLog',
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
      bodyStyle: { padding: '0', height: 'calc(100vh - 240px)', 'overflow-y': 'auto' },
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
        id: this.rowData.id
      }
      const result = await this.$server.label.getLabelCommentList(params)
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

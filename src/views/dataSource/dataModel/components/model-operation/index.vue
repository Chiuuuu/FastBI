<template>
  <div class="operation-wrap">
    <a-form-model class="searchForm" ref="form" layout="inline" :model="searchForm">
      <a-form-model-item label="关键词">
        <a-input
          placeholder="搜索关键词"
          v-model="searchForm.keyword"
          style="width: 240px"
        ></a-input>
      </a-form-model-item>
      <a-form-model-item>
        <a-button type="primary" @click="() => handleGetData()" style="margin-right:5px;">查询</a-button>
        <a-button type="default" @click="handleResetForm">重置</a-button>
      </a-form-model-item>
    </a-form-model>
    <a-table
      rowKey="gmtOperate"
      class="tableList"
      :loading="listLoading"
      :columns="listColumn"
      :pagination="pagination"
      :data-source="listData"
      :scroll="{ x: '100%', y: 'calc(100vh - 360px)' }"
      @change="handleChangeTable"
      >
      </a-table>
  </div>
</template>
<script>
const listColumn = [
  {
    title: '操作时间',
    width: 200,
    dataIndex: 'gmtOperate'
  },
  {
    title: '操作者',
    dataIndex: 'name',
    width: 250,
    ellipsis: true
  },
  {
    title: '操作账号',
    dataIndex: 'username',
    width: 80,
    ellipsis: true
  },
  {
    title: '操作类型',
    dataIndex: 'type',
    width: 200
  }
]

export default {
  name: 'DataModelOperation',
  data() {
    return {
      searchForm: {
        keyword: ''
      },
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      listLoading: false,
      listColumn,
      listData: []
    }
  },
  methods: {
    async handleGetData(pagination) {
      const params = {
        modelId: this.$store.state.dataModel.modelId,
        keyword: this.searchForm.keyword,
        pageSize: this.pagination.pageSize,
        current: pagination ? pagination.current : this.$options.data().pagination.current
      }

      const result = await this.$server.dataModel.getDataModelRecord(params)
      if (result.code === 200) {
        this.listData = result.rows
        this.pagination.current = params.current
        this.pagination.total = result.total
      } else {
        this.$message.error(result.msg || '获取记录失败')
      }
    },
    handleResetForm() {
      this.searchForm = this.$options.data().searchForm
      this.$nextTick(() => {
        this.handleGetData()
      })
    },
    handleChangeTable(pagination) {
      this.handleGetData(pagination)
    }
  }
}
</script>
<style lang="less" scoped>
.operation-wrap {
  color: rgba(0, 0, 0, 0.65);
  .searchForm {
    padding: 10px 20px 10px 20px;
  }
  .tableList {
    padding: 0 20px 10px 20px;
  }
}
</style>

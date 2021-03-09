<template>
  <div class="operation-wrap">
    <a-form-model class="searchForm" ref="form" layout="inline" :model="searchForm">
      <a-form-model-item label="关键词">
        <a-input
          placeholder="搜索关键词"
          v-model="searchForm.searchWord"
          style="width: 240px"
        ></a-input>
      </a-form-model-item>
      <a-form-model-item>
        <a-button type="primary" @click="() => handleGetData()" style="margin-right:5px;">查询</a-button>
        <a-button type="default" @click="handleResetForm">重置</a-button>
      </a-form-model-item>
    </a-form-model>
    <a-table
      class="tableList"
      rowKey="id"
      :loading="listLoading"
      :columns="listColumn"
      :pagination="pagination"
      :data-source="listData"
      :scroll="{ x: '100%', y: 'calc(100vh - 360px)' }"
      @change="handleChangeTable"
      >
        <template #type="text">{{getType(text)}}</template>
      </a-table>
  </div>
</template>
<script>
const listColumn = [
  {
    title: '操作时间',
    width: 200,
    dataIndex: 'time'
  },
  {
    title: '操作者',
    dataIndex: 'author',
    width: 250,
    ellipsis: true
  },
  {
    title: '操作账号',
    dataIndex: 'account',
    width: 80,
    ellipsis: true
  },
  {
    title: '操作类型',
    dataIndex: 'type',
    width: 200,
    scopedSlots: { customRender: 'type' }
  }
]

const listData = []
for (let i = 0; i < 20; i++) {
  listData.push({
    id: i,
    time: '2021-03-22 11:27:43',
    author: '系统管理员' + i,
    account: 'admin',
    type: 1
  })
}
export default {
  name: 'DataModelOperation',
  data() {
    return {
      searchForm: {
        searchWord: ''
      },
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      listLoading: false,
      listColumn,
      listData
    }
  },
  methods: {
    handleGetData(pagination) {
      const params = {
        searchWord: this.searchForm.searchWord,
        pageSize: this.pagination.pageSize,
        current: pagination ? pagination.current : this.$options.data().pagination.current
      }
      console.log('获取数据', params)
      this.pagination.current = params.current
    },
    handleResetForm() {
      this.searchForm = this.$options.data().searchForm
    },
    getType(type) {
      switch (type) {
        case 1:
          return '修改'
        case 2:
          return '新建'
      }
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

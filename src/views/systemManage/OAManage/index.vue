<template>
  <div class="oa-container">
    <!-- title和项目列表 -->
    <OAHeader :projectId.sync="projectId" />

    <!-- 搜索栏 -->
    <OASearch @search="handleSearch" />

    <!-- 表格 -->
    <OATable :list="screenList" @refresh="handleGetData" />

    <!-- 分页器 -->
    <a-pagination
      class="oa-pagination"
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
</template>

<script>
import OAHeader from './components/OAHeader.vue'
import OASearch from './components/OASearch.vue'
import OATable from './components/OATable.vue'
import paginationMixin from '@/mixins/pagination'
export default {
  name: '',
  mixins: [paginationMixin],
  data() {
    return {
      spinning: false,
      lastPagination: {
        current: 1,
        pageSize: 30,
        total: 0
      }, // 记录变化前的分页器数据
      searchForm: {}, // 搜索栏表单
      screenList: [], // 表格数据
      projectId: '' // 当前项目
    }
  },
  components: {
    OAHeader,
    OASearch,
    OATable
  },
  watch: {
    projectId() {
      this.handleGetData()
    }
  },
  created () {
    this.handleGetData()
  },
  methods: {
    // 更新查询表单
    handleSearch(searchForm) {
      this.searchForm = searchForm
      this.handleGetData()
    },
    // 获取数据列表
    async handleGetData() {
      this.spinning = true
      const result = await this.$server.screenManage
        .getOAScreenList({
          ...this.searchForm,
          projectId: this.projectId,
          current: this.pagination.current,
          pageSize: this.pagination.pageSize
        })
        .finally(() => {
          this.spinning = false
        })
      if (result.code === 200) {
        this.screenList = result.rows
        this.pagination.total = result.total
        this.lastPagination = this.pagination
      } else {
        this.$message.error(result.msg || '查询失败')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.oa-container {
  display: flex;
  flex-direction: column;
  background: #fff;
  height: 100%;
  width: 100%;

  .oa-pagination {
    width: 100%;
    height: 32px;
    margin-top: 15px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>

<template>
  <div class="oa-container">
    <!-- title和项目列表 -->
    <OAHeader :projectId.sync="projectId" />

    <!-- 搜索栏 -->
    <OASearch @search="handleSearch" />

    <!-- 表格 -->
    <OATable :list="screenList" />

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
      // this.spinning = true
      // const result = await this.$server.screenMaterial
      //   .getMaterialList({
      //     ...this.searchForm,
      //     projectId: this.projectId,
      //     current: this.pagination.current,
      //     pageSize: this.pagination.pageSize
      //   })
      //   .finally(() => {
      //     this.spinning = false
      //   })
      // if (result.code === 200) {
      //   this.screenList = result.rows
      //   this.pagination.total = result.total
      // } else {
      //   this.$message.error(result.msg || '查询失败')
      // }
      this.screenList = [
        {
          name: '2021年9月政企大屏',
          createTime: '2021-10-15 14:00:21',
          project: '项目1',
          isTop: true,
          status: 1,
          url: '47.115.14.69:8081/share/ieE7fe',
          password: 'z11111'
        },
        {
          name: '2021年8月政企大屏',
          createTime: '2021-10-15 14:00:21',
          project: '项目1',
          isTop: true,
          status: 1,
          url: '47.115.14.69:8081/share/ieE7fe',
          password: 'z11111'
        },
        {
          name: '2021年7月政企大屏',
          createTime: '2021-10-15 14:00:21',
          project: '项目1',
          isTop: true,
          status: 2,
          url: '47.115.14.69:8081/share/ieE7fe',
          password: 'z11111'
        },
        {
          name: '2021年6月政企大屏',
          createTime: '2021-10-15 14:00:21',
          project: '项目1',
          isTop: false,
          status: 1,
          url: '47.115.14.69:8081/share/ieE7fe',
          password: ''
        },
        {
          name: '2021年5月政企大屏',
          createTime: '2021-10-15 14:00:21',
          project: '项目1',
          isTop: false,
          status: 3,
          url: '47.115.14.69:8081/share/ieE7fe',
          password: ''
        },
        {
          name: '2021年4月政企大屏',
          createTime: '2021-10-15 14:00:21',
          project: '项目1',
          isTop: false,
          status: 2,
          url: '47.115.14.69:8081/share/ieE7fe',
          password: ''
        }
      ]
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

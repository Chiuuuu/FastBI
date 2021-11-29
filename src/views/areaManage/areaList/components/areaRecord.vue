<template>
  <div class="table-area">
    <div class="area-searchbar"></div>
    <a-table class="area-table"></a-table>
    <a-pagination
      class="area-pagination"
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
import paginationMixin from '@/mixins/pagination'
export default {
  name: 'areaRecord',
  mixins: [paginationMixin],
  data() {
    return {

    }
  },
  created () {
    this.handleGetData()
  },
  methods: {
    async handleGetData() {

    }
  }
}
</script>

<style lang="less" scoped>
@import '../main.less';
</style>

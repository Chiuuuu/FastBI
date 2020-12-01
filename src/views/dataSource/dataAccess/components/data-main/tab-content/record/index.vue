<template>
  <div class="tab-panel">
    <!-- <div class="search_bar">
      <a-input placeholder="请输入关键词" class="search_input" style="width:60%">
        <a-icon slot="prefix" type="search" />
      </a-input>
    </div> -->
    <div class="tab-scroll scrollbar">
      <a-table
        rowKey="id"
        :columns="column"
        :data-source="datas"
        :loading="loading"
        :pagination="pagination"
        :scroll="{ y: 'calc(100vh - 350px)' }"
        @change="handleChangeTable"
        >
        <template #time="text">
          <span>{{ text | formatTime }}</span>
        </template>
      </a-table>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import moment from 'moment'

const column = [
  {
    title: '操作时间',
    dataIndex: 'gmtOperate',
    scopedSlots: { customRender: 'time' }
  },
  {
    title: '操作者',
    dataIndex: 'nickName'
  },
  {
    title: '账号',
    dataIndex: 'userName'
  },
  {
    title: '操作类型',
    dataIndex: 'type'
  }
]

export default {
  name: 'tabContentRecord',
  data() {
    return {
      column,
      datas: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      loading: false
    }
  },
  computed: {
    ...mapState({
      modelId: state => state.dataAccess.modelId
    })
  },
  filters: {
    formatTime(time) {
      return moment(time).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  methods: {
    async handleGetData(pagination) {
      this.loading = true
      const params = {
        sourceId: this.modelId,
        pageSize: this.pagination.pageSize,
        current: pagination ? pagination.current : this.$options.data().pagination.current
      }
      const res = await this.$server.dataAccess.getModelRecord(params)
      if (res.code === 200) {
        this.datas = res.rows
        this.pagination.total = res.total
        this.pagination.current = params.current
      } else {
        this.$message.error(res.msg)
      }
      this.loading = false
    },
    handleChangeTable(pagination) {
      this.handleGetData(pagination)
    }
  }
}
</script>

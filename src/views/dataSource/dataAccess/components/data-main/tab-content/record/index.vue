<template>
  <div>
    <div class="search_bar">
      <!-- <a-input placeholder="请输入关键词" class="search_input" style="width:60%">
        <a-icon slot="prefix" type="search" />
      </a-input> -->
    </div>
    <!-- 暂时加一个style -->
    <div class="table" style="margin-top:0">
      <a-table rowKey="id" :columns="column" :data-source="datas" :loading="loading">
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
      console.log(moment(time).format('YYYY-MM-DD HH:mm:ss'))
      return moment(time).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  methods: {
    async handleGetData() {
      this.loading = true
      const res = await this.$server.dataAccess.getModelRecord({ sourceId: this.modelId })
      if (res.code === 200) {
        this.datas = res.rows
      } else {
        this.$message.error(res.msg)
      }
      this.loading = false
    }
  }
}
</script>

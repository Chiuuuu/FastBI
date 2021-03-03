<template>
  <div class="monitoringtab">
    <div class="search">
      <div class="searchbar">
        <a-form-model layout="inline" :model="searchForm">
          <a-form-model-item label="用户名" prop="userName">
            <a-input
              placeholder="请输入用户名"
              v-model="searchForm.userName"
              style="width: 200px"
            ></a-input>
          </a-form-model-item>
          <a-form-model-item label="姓名" prop="name">
            <a-input
              placeholder="请输入姓名"
              v-model="searchForm.name"
              style="width: 200px"
            ></a-input>
          </a-form-model-item>
          <a-form-model-item>
            <a-button type="primary" @click="getData" :disabled="loading"
              >查询</a-button
            >
          </a-form-model-item>
          <a-form-model-item>
            <a-button type="default" @click="reset" :disabled="loading"
              >重置</a-button
            >
          </a-form-model-item>
        </a-form-model>
      </div>
    </div>
    <a-table
      class="role-list-table scrollbar"
      row-key="No"
      :columns="listColumn"
      :data-source="dataList"
      :loading="loading"
      :pagination="pagination"
      :scroll="{ y: 430 }"
    >
      <template #config="text, record, index">
        <a-popconfirm
          title="是否确定删除？"
          ok-text="确定"
          cancel-text="取消"
          @confirm="del(record, index)"
        >
          <a href="#">剔除</a>
        </a-popconfirm>
      </template>
    </a-table>
  </div>
</template>
<script>
import { trimFormData } from '@/utils/form-utils'
import index from '../../../../components/board/index.vue'
const listColumn = [
  {
    title: '序号',
    width: 100,
    ellipsis: true,
    dataIndex: 'No'
  },
  {
    title: '用户名',
    width: 100,
    dataIndex: 'userName'
  },
  {
    title: '姓名',
    width: 100,
    dataIndex: 'name'
  },
  {
    title: '登录时间',
    dataIndex: 'loginTime',
    width: 200,
    ellipsis: true
  },
  {
    title: '操作',
    dataIndex: 'config',
    width: 100,
    scopedSlots: { customRender: 'config' }
  }
]
export default {
  components: { index },
  name: 'SystemMonitoring',
  data() {
    return {
      searchForm: {
        userName: '',
        name: ''
      },
      listColumn,
      loading: false,
      dataList: []
    }
  },
  computed: {
    pagination() {
      return {
        showSizeChanger: true,
        showQuickJumper: true,
        total: this.dataList.length
      }
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    async getData() {
      this.loading = true
      let res = await this.$server.systemMonitoring.showCurrentUser()
      this.loading = false
      this.dataList = res.data.map((item, index) => {
        return {
          No: index + 1,
          ...item
        }
      })
      this.searchForm = trimFormData(this.searchForm)
      if (!this.searchForm.userName && !this.searchForm.name) {
        return
      }
      // 按用户名和姓名过滤
      this.dataList = this.dataList.filter(item => {
        let isKeep = true
        if (
          this.searchForm.userName &&
          item.userName.indexOf(this.searchForm.userName) === -1
        ) {
          isKeep = false
        }
        if (
          this.searchForm.name &&
          item.name.indexOf(this.searchForm.name) === -1
        ) {
          isKeep = false
        }
        return isKeep
      })
    },
    reset() {
      this.searchForm = this.$options.data().searchForm
      this.getData()
    },
    async del(item) {
      let { No, ...params } = item
      this.loading = true
      let res = await this.$server.systemMonitoring.deleteUserData(params)
      this.loading = false
      this.dataList = res.data.data.map((item, index) => {
        return {
          No: index + 1,
          ...item
        }
      })
    }
  }
}
</script>

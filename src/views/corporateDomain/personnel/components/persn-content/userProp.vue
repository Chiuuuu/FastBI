<template>
  <div class="screen-manage">
    <div class="role-list-controller">
      <div class="searchbar">
        <a-form-model layout="inline" :model="userSearch">
          <a-form-model-item label="用户名" prop="username">
            <a-input v-model="userSearch.username" style="width: 150px"></a-input>
          </a-form-model-item>
          <a-form-model-item label="姓名" prop="name">
            <a-input v-model="userSearch.name" style="width: 150px"></a-input>
          </a-form-model-item>
          <a-button class="main-button" type="primary" @click="getUserList">查询</a-button>
          <a-button class="main-button" type="primary" @click="resetForm()">重置</a-button>
        </a-form-model>
      </div>
    </div>
    <a-table
      class="role-list-table scrollbar"
      row-key="id"
      :columns="userColumn"
      :data-source="userData"
      :loading="loading"
    >
      <template #config="text, record">
        <a-icon class="edit-icon" type="edit" theme="twoTone" two-tone-color="#8aa1ff" />
      </template>
    </a-table>
  </div>
</template>

<script>

const userData = []
for (let i = 0; i < 30; i++) {
  userData.push({
    id: i + 1,
    username: 'admin' + i,
    name: '嘿嘿嘿',
    prop1: '属性1',
    prop2: '属性2',
    prop3: '属性3'
  })
}

const userColumn = [
  {
    title: '用户名',
    dataIndex: 'username'
  },
  {
    title: '姓名',
    dataIndex: 'name'
  },
  {
    title: '属性1',
    dataIndex: 'prop1',
    width: 200,
    ellipsis: true
  },
  {
    title: '属性2',
    dataIndex: 'prop2',
    width: 200,
    ellipsis: true
  },
  {
    title: '属性3',
    dataIndex: 'prop3',
    width: 200,
    ellipsis: true
  },
  {
    title: '操作',
    dataIndex: 'config',
    scopedSlots: { customRender: 'config' }
  }
]

export default {
  name: 'userProp',
  data() {
    return {
      loading: false,
      modalData: {},
      visible1: false,
      userSearch: {
        username: '',
        name: ''
      },
      userData: [],
      userColumn
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    resetForm(tab) {
      this.userSearch = this.$options.data().userSearch
    },
    async getUserList() {
      this.loading = true
      setTimeout(() => {
        this.userData = userData
        this.loading = false
      }, 400)
    }
  }
}
</script>

<style lang="less" scoped>
@import "../../../main.less";
</style>

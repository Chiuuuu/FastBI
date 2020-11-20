<template>
  <div class="main">
    <a-spin class="main-box" :spinning="spinning">
      <div class="right">
        <a-tabs class="tabs" @change="handleChangeModule">
          <a-tab-pane key="1" tab="用户管理">
            <div class="role-list-controller">
              <div class="searchbar">
                <div class="item">
                  <span>用户名：</span>
                  <a-input v-model="userSearch.username" style="width: 150px"></a-input>
                </div>
                <div class="item">
                  <span>姓名：</span>
                  <a-input v-model="userSearch.name" style="width: 150px"></a-input>
                </div>
                <div class="item">
                  <span>用户角色：</span>
                  <a-select v-model="userSearch.role" style="width: 150px"></a-select>
                </div>
                <a-button class="main-button" type="primary" @click="getUserList">查询</a-button>
                <a-button class="main-button" type="primary" @click="resetForm(1)">重置</a-button>
              </div>
              <a-button class="main-button" type="primary" @click="showModal('add')">添加</a-button>
            </div>
            <a-table
              class="role-list-table scrollbar"
              row-key="id"
              :columns="usersColumn"
              :data-source="usersData"
              :loading="loading">
              <template #config="text, record">
                <a @click="handleEditUser(record)" style="margin-right: 20px">编辑</a>
                <a @click="handleDeleteUser(record)">删除</a>
              </template>
            </a-table>
          </a-tab-pane>
          <a-tab-pane key="2" tab="角色属性">
            <div class="role-list-controller">
              <div class="searchbar">
                <div class="item">
                  <span>用户名：</span>
                  <a-input v-model="roleSearch.username" style="width: 150px"></a-input>
                </div>
                <div class="item">
                  <span>姓名：</span>
                  <a-input v-model="roleSearch.name" style="width: 150px"></a-input>
                </div>
                <a-button class="main-button" type="primary" @click="getRoleList">查询</a-button>
                <a-button class="main-button" type="primary" @click="resetForm(2)">重置</a-button>
              </div>
            </div>
            <a-table
              class="role-list-table scrollbar"
              row-key="id"
              :columns="rolesColumn"
              :data-source="rolesData"
              :loading="loading">
            </a-table>
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-spin>
    <a-modal title="添加用户" v-model="visible" @ok="handleOk" @close="clearModal">
      <a-form-model :model="form" :rules="rules" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
        <a-form-model-item label="用户名" prop="username">
          <a-input
            mode="multiple"
            v-model="form.username"
            style="width: 100%"
            placeholder="请输入用户名"
          >
          </a-input>
        </a-form-model-item>
        <a-form-model-item label="用户角色" prop="users">
          <a-select
            mode="multiple"
            v-model="form.users"
            style="width: 100%"
            placeholder="请选择用户角色"
          >
            <a-select-option v-for="i in 25" :key="(i + 9).toString(36) + i">
              {{ (i + 9).toString(36) + i }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex'

const usersData = []
for (let i = 0; i < 30; i++) {
  usersData.push({
    id: i + 1,
    username: 'admin' + i,
    name: '嘿嘿嘿',
    phone: '12345678910',
    role: '打工人' + (i + 1) + '号',
    gmtCreate: '2020-11-19 15:09'
  })
}

const rolesData = []
for (let i = 0; i < 30; i++) {
  rolesData.push({
    id: i + 1,
    username: 'admin' + i,
    name: '嘿嘿嘿',
    prop1: '属性1',
    prop2: '属性2',
    prop3: '属性3'
  })
}

const usersColumn = [
  {
    title: '用户名',
    dataIndex: 'username'
  },
  {
    title: '姓名',
    dataIndex: 'name'
  },
  {
    title: '电话',
    dataIndex: 'phone'
  },
  {
    title: '用户角色',
    dataIndex: 'role'
  },
  {
    title: '创建时间',
    dataIndex: 'gmtCreate',
    width: 200,
    ellipsis: true
  },
  {
    title: '操作',
    dataIndex: 'config',
    scopedSlots: { customRender: 'config' }
  }
]

const rolesColumn = [
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
  }
]

export default {
  name: 'userMain',
  components: {

  },
  data() {
    return {
      currentTab: '1',
      spinning: false,
      loading: false,
      visible: false,
      modalType: '', // 判断是编辑还是新增
      userId: '', // 当前编辑的用户id
      detailInfo: {},
      form: {
        username: '',
        users: []
      },
      rules: {
        username: [
          { required: true, message: '请填写用户名' },
          {
            type: 'string',
            max: 20,
            min: 1,
            message: '长度为1~20'
          }
        ],
        users: [
          { required: true, message: '请选择用户名' }
        ]
      },
      userSearch: {
        username: '',
        name: '',
        role: ''
      },
      roleSearch: {
        username: '',
        name: ''
      },
      usersData: [],
      usersColumn,
      rolesData: [],
      rolesColumn
    }
  },
  computed: {
    ...mapState({
      roleId: state => state.projectRoles.roleId,
      formInfo: state => state.projectRoles.roleInfo
    })
  },
  created() {
    this.getUserList()
  },
  methods: {
    showModal(type) {
      this.visible = true
      this.modalType = type
    },
    clearModal() {
      this.form = this.$options.data().form
    },
    handleOk() {
      const params = this.form
      if (this.modalType === 'add') {
        // 新增保存
      } else if (this.modalType === 'edit') {
        // 编辑保存
        params.id = this.userId
      }
      this.visible = false
      this.clearModal()
    },
    handleChangeModule(key) {
      if (key === '1') {
        this.getUserList()
      } else if (key === '2') {
        this.getRoleList()
      }
    },
    resetForm(tab) {
      if (tab === 1) {
        this.userSearch = this.$options.data().userSearch
      } else {
        this.roleSearch = this.$options.data().roleSearch
      }
    },
    handleDeleteUser({ id }) {
      this.$confirm({
        title: '确认提示',
        content: '您确定要删除该用户吗',
        onOk: () => {
          console.log('删除id: ', id)
        }
      })
    },
    handleEditUser(data) {
      this.form = {
        username: data.username,
        role: data.role
      }
      this.userId = data.id
      this.showModal('edit')
    },
    async getUserList() {
      this.loading = true
      setTimeout(() => {
        this.usersData = usersData
        this.loading = false
      }, 400)
    },
    async getRoleList() {
      this.loading = true
      setTimeout(() => {
        this.rolesData = rolesData
        this.loading = false
      }, 400)
    }
  }
}
</script>

<style lang="less" scoped>
@import "../../../main.less";
</style>

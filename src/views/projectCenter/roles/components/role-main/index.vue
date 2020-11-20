<template>
  <div class="main">
    <a-empty v-if="!roleId" class="main-empty">
      <span slot="description">请新建角色或者选中左侧角色</span>
    </a-empty>
    <template v-else>
      <a-spin class="main-box" :spinning="spinning">
        <div class="right">
          <a-tabs class="tabs" @change="handleChangeModule">
            <a-tab-pane key="1" tab="权限设置">
              <div class="tab scrollbar">
                <header>
                  <div class="role-info">
                    <div>角色名称：<span></span></div>
                    <div class="line">角色描述：</div>
                  </div>
                  <a-button class="main-button" type="primary" @click="edit">编辑用户</a-button>
                </header>
                <div class="title">角色权限</div>
                <div class="content">
                  <a-tabs class="tabs scrollbar" @change="handleChangeTab">
                    <a-tab-pane style="padding-left: 16px" key="1" tab="数据大屏">
                      <role-limit role-title="数据大屏" :options="['新建数据大屏', '新建文件夹']" />
                    </a-tab-pane>
                    <a-tab-pane style="padding-left: 16px" key="2" tab="数据模型">
                      <role-limit role-title="数据模型" :options="['新建数据模型', '新建文件夹']" />
                    </a-tab-pane>
                    <a-tab-pane style="padding-left: 16px" key="3" tab="数据接入">
                      <role-limit role-title="数据接入" :options="['新建数据接入', '新建文件夹']" />
                    </a-tab-pane>
                  </a-tabs>
                </div>
                <div class="title">数据权限</div>
                <div class="content scrollbar">
                  <limit-tree />
                  <limit-tree />
                </div>
              </div>
            </a-tab-pane>
            <a-tab-pane key="2" tab="角色用户">
              <div class="role-list-controller">
                <div>
                  <span>用户名：</span>
                  <a-input style="width: 200px"></a-input>
                  <a-button class="main-button" type="primary">查询</a-button>
                </div>
                <a-button class="main-button" type="primary" @click="showModal">添加</a-button>
              </div>
              <a-table
                class="role-list-table scrollbar"
                row-key="id"
                :columns="tableColumn"
                :data-source="tableData"
                :loading="loading">
                <template #config="text, record">
                  <a @click="handleDeleteUser(record)">移除</a>
                </template>
              </a-table>
            </a-tab-pane>
          </a-tabs>
        </div>
      </a-spin>
      <a-modal title="添加用户" v-model="visible" @ok="handleAddUser" @close="clearModal">
        <a-form-model :model="form" :rules="rules" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
          <a-form-model-item label="用户名" prop="users">
            <a-select
              mode="multiple"
              v-model="form.users"
              style="width: 100%"
              placeholder="请输入用户名进行查询"
              @change="handleInputRole"
            >
              <a-select-option v-for="i in 25" :key="(i + 9).toString(36) + i">
                {{ (i + 9).toString(36) + i }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-form-model>
      </a-modal>
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import RoleLimit from '../limitTree/role-limit'
import LimitTree from '../limitTree/limit-tree'

const tableData = []
for (let i = 0; i < 30; i++) {
  tableData.push({
    id: i + 1,
    username: 'admin' + i,
    name: '嘿嘿嘿',
    gmtModify: '2020-11-19 15:09'
  })
}

const tableColumn = [
  {
    title: '用户名',
    dataIndex: 'username'
  },
  {
    title: '姓名',
    dataIndex: 'name'
  },
  {
    title: '修改时间',
    dataIndex: 'gmtModify',
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
  name: 'roleMain',
  components: {
    RoleLimit,
    LimitTree
  },
  data() {
    return {
      currentTab: '1',
      spinning: false,
      loading: false,
      visible: false,
      detailInfo: {},
      form: {
        users: []
      },
      rules: {
        users: [
          { required: true, message: '请选择用户名' }
        ]
      },
      tableData: [],
      tableColumn
    }
  },
  computed: {
    ...mapState({
      roleId: state => state.roles.roleId,
      formInfo: state => state.roles.roleInfo
    })
  },
  created() {
    if (this.roleId) {
      this.handleGetRoleInfo()
    }
  },
  methods: {
    showModal() {
      this.visible = true
    },
    handleAddUser() {
      this.visible = false
      this.clearModal()
    },
    clearModal() {
      this.form = this.$options.data().form
    },
    handleChangeModule(key) {
      if (key === '2') {
        this.getRoleTableList()
      } else {
        this.tableData = []
      }
    },
    handleChangeTab(activeKey) {
      this.currentTab = activeKey
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
    handleInputRole() {

    },
    async getRoleTableList() {
      this.loading = true
      setTimeout(() => {
        this.tableData = tableData
        this.loading = false
      }, 400)
    },
    edit() {
      // 切换至编辑模式
      this.$store.commit('roles/SET_ROLEMODE', 'edit')
      this.$router.push({
        path: '/projectCenter/roles/edit/id=' + 123
      })
    },
    async handleGetRoleInfo() {

    }
  }
}
</script>

<style lang="less" scoped>
@import "../../../main.less";
</style>

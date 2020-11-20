<template>
  <div class="main">
    <a-empty v-if="!permissionId" class="main-empty">
      <span slot="description">请新建数据权限或者选中左侧数据权限</span>
    </a-empty>
    <template v-else>
        <div class="right">
          <a-tabs class="tabs" @change="handleChangeModule">
            <a-tab-pane key="1" tab="行级权限">
              <a-spin class="main-box" :spinning="spinning">
                <div class="tab scrollbar">
                  <header>
                    <div class="permission-info">
                      <div>权限名称：<span></span></div>
                      <div class="line">权限描述：</div>
                    </div>
                    <a-button class="main-button" type="primary" @click="edit">编辑数据权限</a-button>
                  </header>
                  <div class="title">数据权限</div>
                  <div class="content scrollbar">
                  </div>
                </div>
              </a-spin>
            </a-tab-pane>
            <a-tab-pane key="2" tab="列级权限">
              <a-spin class="main-box" :spinning="spinning">
                <div class="tab scrollbar">
                  <header>
                    <div class="permission-info">
                      <div>权限名称：<span></span></div>
                      <div class="line">权限描述：</div>
                    </div>
                    <a-button class="main-button" type="primary" @click="edit">编辑数据权限</a-button>
                  </header>
                  <div class="title">数据权限</div>
                  <div class="content scrollbar">
                  </div>
                </div>
              </a-spin>
            </a-tab-pane>
          </a-tabs>
        </div>
      <a-modal title="添加用户" v-model="visible" @ok="handleAddUser" @close="clearModal">
        <a-form-model :model="form" :rules="rules" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
          <a-form-model-item label="用户名" prop="users">
            <a-select
              mode="multiple"
              v-model="form.users"
              style="width: 100%"
              placeholder="请输入用户名进行查询"
              @change="handleInputPermission"
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
  name: 'permMain',
  components: {
    
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
      permissionId: state => state.permissions.permissionId,
      formInfo: state => state.permissions.permissionInfo
    })
  },
  created() {
    if (this.permissionId) {
      this.handleGetPermissionInfo()
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
      if (key === '1') {
        this.$store.commit('permissions/SET_EDITTYPE', 'row')
      } else if (key === '2') {
        this.$store.commit('permissions/SET_EDITTYPE', 'col')
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
    handleInputPermission() {

    },
    async getPermissionTableList() {
      this.loading = true
      setTimeout(() => {
        this.tableData = tableData
        this.loading = false
      }, 400)
    },
    edit() {
      // 切换至编辑模式
      this.$store.commit('permissions/SET_PERMISSIONMODE', 'edit')
      this.$router.push({
        path: '/projectCenter/permissions/edit/id=' + 123
      })
    },
    async handleGetPermissionInfo() {

    }
  }
}
</script>

<style lang="less" scoped>
@import "../../../main.less";
.main .right .content {
  height: calc(100% - 122px);
}
</style>

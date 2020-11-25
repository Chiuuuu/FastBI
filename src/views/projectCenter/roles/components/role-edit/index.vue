<template>
  <div class="main">
    <a-spin class="main-box" :spinning="spinning">
      <div class="right edit">
        <div class="role-layout">
          <div class="tab scrollbar">
            <header>
              <span>编辑用户权限</span>
              <div>
                <a-button class="main-button" type="primary" @click="handleSave">保存</a-button>
                <a-button class="main-button" @click="back">返回</a-button>
              </div>
            </header>
            <a-form-model class="role-form" ref="form" :model="form" :rules="rules" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
              <a-form-model-item label="角色名称" prop="name">
                <a-input v-model="form.name"></a-input>
              </a-form-model-item>
              <a-form-model-item label="角色描述" prop="description">
                <a-input v-model="form.description"></a-input>
              </a-form-model-item>
            </a-form-model>
            <RoleTabeRole status="edit"></RoleTabeRole>
            <RolesTabDataPermission status="edit"></RolesTabDataPermission>
          </div>
        </div>
      </div>
    </a-spin>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import RolesTabDataPermission from '../tab-content/rolesTabDataPermission'
import RoleTabeRole from '../tab-content/rolesTabRole'

export default {
  name: 'roleEdit',
  components: {
    RolesTabDataPermission,
    RoleTabeRole
  },
  data() {
    return {
      currentTab: '1',
      spinning: false,
      form: {
        name: '',
        description: ''
      },
      rules: {
        name: [
          {
            required: true,
            message: '请输入用户名称'
          },
          {
            type: 'string',
            max: 20,
            min: 1,
            message: '长度为1~20'
          }
        ],
        description: [
          {
            type: 'string',
            max: 200,
            min: 1,
            message: '长度为1~200'
          }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      roleId: state => state.projectRoles.roleId,
      formInfo: state => state.projectRoles.roleInfo
    })
  },
  created() {
    this.handleGetRoleInfo()
  },
  beforeDestroy() {
    this.$EventBus.$off('set-tab-index', this.handleSetTab)
  },
  methods: {
    async handleGetRoleInfo() {

    },
    back() {
      // 切换回查看模式
      this.$store.commit('projectRoles/SET_ROLEMODE', 'check')
      this.$router.push({
        path: '/projectCenter/roles/list'
      })
    },
    handleSave() {
      console.log('save')
    }
  }
}
</script>

<style lang="less" scoped>
@import "../../../main";
</style>

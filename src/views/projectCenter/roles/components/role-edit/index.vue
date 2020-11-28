<template>
  <div class="main">
    <a-spin class="main-box" :spinning="spinning">
      <div class="right edit">
        <div class="role-layout">
          <div class="tab scrollbar">
            <header>
              <span>编辑用户权限</span>
              <div>
                <a-button class="main-button" type="primary" @click="handleSave">保 存</a-button>
                <a-button class="main-button" @click="back">退 出</a-button>
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
  mounted() {
    this.handleGetRoleInfo()
    this.$store.commit('projectRoles/SET_ROLEID', this.$route.params.id)
  },
  methods: {
    async handleGetRoleInfo() {
      const roleInfo = await this.$server.projectCenter.getRoleInfo(this.$route.params.id)
      // const rolePermission = await this.$server.projectCenter.getRolePermission(this.fileSelectId)
      if (roleInfo.code === 200) {
        this.$store.commit('projectRoles/SET_ROLEINFO', roleInfo.data)
        this.form.name = roleInfo.data.name
        this.form.description = roleInfo.data.description
      } else {
        this.$message.error(roleInfo.msg)
      }
      // if (rolePermission.code === 200) {
      //   this.$EventBus.$emit('setFormData')
      // } else {
      //   this.$message.error(roleInfo.msg)
      // }
    },
    back() {
      // 切换回查看模式
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

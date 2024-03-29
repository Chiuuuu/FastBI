<template>
  <div class="main">
    <a-spin class="main-box" :spinning="spinning">
      <div class="right edit">
        <div class="role-layout">
          <div class="tab scrollbar">
            <header>
              <span>编辑角色</span>
              <div>
                <a-button class="main-button" type="primary" :loading="loading" @click="handleSave">保 存</a-button>
                <a-button class="main-button" @click="back">退 出</a-button>
              </div>
            </header>
            <a-form-model class="role-form" ref="form" :model="form" :rules="rules" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
              <a-form-model-item label="角色名称" prop="name">
                <a-input v-model="form.name" placeholder="请输入角色名称"></a-input>
              </a-form-model-item>
              <a-form-model-item label="角色描述" prop="description">
                <a-input v-model="form.description" placeholder="请输入角色描述"></a-input>
              </a-form-model-item>
            </a-form-model>
            <RolesTabRole
              status="edit"
              @getChangeItem="getChangeItem"
              @getTablePermi="getTablePermi"
              @getAreaMapManagement="getAreaMapManagement"
              @setBasePrivilege="getBasePrivilege"
              @setSourceType="setSourceType"
              ></RolesTabRole>
            <!-- <RolesTabDataPermission status="edit"></RolesTabDataPermission> -->
          </div>
        </div>
      </div>
    </a-spin>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { trimFormData } from '@/utils/form-utils'
// import RolesTabDataPermission from '../tab-content/rolesTabDataPermission'
import RolesTabRole from '../tab-content/rolesTabRole'

export default {
  name: 'roleEdit',
  components: {
    // RolesTabDataPermission,
    RolesTabRole
  },
  data() {
    return {
      spinning: false,
      loading: false,
      form: {
        name: '',
        description: ''
      },
      rules: {
        name: [
          {
            required: true,
            message: '请输入角色名称'
          },
          {
            pattern: /^[\u4E00-\u9FA5\uF900-\uFA2Da-zA-Z\d]*$/g,
            message: '仅支持中英文数字名称'
          },
          {
            type: 'string',
            max: 20,
            min: 1,
            message: '请输入1-20个字的角色名称'
          }
        ],
        description: [
          {
            required: true,
            message: '请输入角色描述'
          },
          {
            type: 'string',
            max: 200,
            min: 1,
            message: '请输入200字以内的用户描述'
          }
        ]
      },
      sourceType: '',
      basePrivilege: [],
      screen: [],
      dataModel: [],
      dataSource: [],
      areaMap: [],
      areaMapManagement: {}
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
    this.$store.commit('common/SET_MENUSELECTID', this.$route.params.id)
  },
  beforeDestroy() {
    this.$store.commit('common/SET_MENUSELECTID', -1)
  },
  methods: {
    async handleGetRoleInfo() {
      const roleInfo = await this.$server.projectCenter.getRoleInfo(this.$route.params.id)
      if (roleInfo.code === 200) {
        this.$store.commit('projectRoles/SET_ROLEINFO', roleInfo.data)
        this.form.name = roleInfo.data.name
        this.form.description = roleInfo.data.description
      } else {
        this.$message.error(roleInfo.msg)
      }
    },
    back() {
      // 切换回查看模式
      this.$router.push({
        path: '/projectCenter/roles/list'
      })
    },
    getChangeItem(role, item) {
      switch (role) {
        case 1:
          role = 'screen'
          break
        case 2:
          role = 'dataModel'
          break
        case 3:
          role = 'dataSource'
          break
        case 4:
          role = 'areaMap'
          break
      }
      // 初始化时, 把有勾选的对象都插入进去(后台约定)
      if (Array.isArray(item)) {
        this[role] = this[role].concat(item)
      } else { // 改变单个对象时, 把对象修改或者插入
        const list = this[role]
        const target = list.find(t => role < 4 ? t.id === item.id : t.title === item.title)
        if (target) {
          target.permissions = item.permissions
        } else {
          list.push(item.dataRef || item)
        }
      }
    },
    // 设置数据源下的表格权限
    getTablePermi(role, item) {
      switch (role) {
        case 1:
          role = 'screen'
          break
        case 2:
          role = 'dataModel'
          break
        case 3:
          role = 'dataSource'
          break
        case 4:
          role = 'areaMap'
          break
      }
      const list = this[role]
      const target = list.find(t => t.id === item.id)
      if (target) {
        target.dataBasePri = item.dataBasePri
      } else {
        list.push(item)
      }
    },
    // 设置业务权限
    getBasePrivilege(permissions, type) {
      const target = this.basePrivilege.find(item => item.type === type)
      if (target) {
        target.permissions = permissions
      } else {
        this.basePrivilege.push({
          type,
          permissions
        })
      }
    },
    // 设置片区数据
    getAreaMapManagement(data) {
      this.areaMapManagement = data
    },
    // 设置数据源类型
    setSourceType(data) {
      this.sourceType = data
    },
    async handleSave() {
      this.loading = true
      const params = Object.assign({
        id: this.roleId,
        basePermissions: this.basePrivilege,
        screen: this.screen,
        dataModel: this.dataModel,
        dataSource: this.dataSource,
        areaMap: this.areaMap,
        areaMapManagement: this.areaMapManagement
      }, this.form)

      const promiseall = [
        this.$server.projectCenter.updateRole(trimFormData(params)),
        this.$server.projectCenter.updateRoleSourceType({
          roleId: this.roleId,
          forbiddenType: this.sourceType
        })
      ]
      Promise.all(promiseall.map(promise => promise.catch(err => err)))
        .then(res => {
          let isBack = true
          if (!res[0] || res[0].code !== 200) {
            isBack = false
            this.$message.error(res[0].msg || '保存角色权限失败')
          } else if (!res[1] || res[1].code !== 200) {
            isBack = false
            this.$message.error(res[1].msg || '保存数据源类型失败')
          }
          if (isBack) {
            this.$store.commit('common/SET_MENUSELECTID', this.roleId)
            this.$message.success('保存成功')
            this.back()
          }
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang="less" scoped>
@import "../../../main";
</style>

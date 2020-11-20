<template>
  <div class="main">
    <a-spin class="main-box" :spinning="spinning">
      <div class="right edit">
        <div class="tab scrollbar">
          <header>
            <span>编辑列级权限</span>
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
          <div class="title">数据权限</div>
          <div class="content scrollbar">
          </div>
        </div>
      </div>
    </a-spin>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'permEditCol',
  components: {
    
  },
  data() {
    return {
      currentTab: '1',
      spinning: false,
      detailInfo: {},
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
    handleChangeTab(activeKey) {
      this.currentTab = activeKey
    },
    async handleGetRoleInfo() {

    },
    back() {
      // 切换回查看模式
      this.$store.commit('projectPermissions/SET_PERMISSIONMODE', 'check')
      this.$router.push({
        path: '/projectCenter/permissions/list'
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
.main .right .content {
  height: calc(100% - 122px);
}
</style>

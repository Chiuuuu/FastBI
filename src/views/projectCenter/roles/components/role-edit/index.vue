<template>
  <div class="main">
    <a-spin class="main-box" :spinning="spinning">
      <div class="right edit">
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
      </div>
    </a-spin>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import RoleLimit from '../limitTree/role-limit'
import LimitTree from '../limitTree/limit-tree'
export default {
  name: 'roleEdit',
  components: {
    RoleLimit,
    LimitTree
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

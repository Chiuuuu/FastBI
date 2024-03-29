<template>
  <div class="middle">
    <div class="title">角色权限</div>
    <a-tabs class="tabs scrollbar" @change="handleChangeTab">
      <a-tab-pane
        forceRender
        :key="1"
        tab="数据大屏"
      >
        <a-spin :spinning="spinning1">
          <role-limit
            v-on="$listeners"
            ref="module1"
            role-title="数据大屏"
            :options="modulePermission[1] || {}"
          />
        </a-spin>
      </a-tab-pane>
      <a-tab-pane
        forceRender
        :key="2"
        tab="数据模型"
      >
        <a-spin :spinning="spinning2">
          <role-limit
            v-on="$listeners"
            ref="module2"
            role-title="数据模型"
            :options="modulePermission[2] || {}"
          />
        </a-spin>
      </a-tab-pane>
      <a-tab-pane
        forceRender
        :key="3"
        tab="数据接入"
      >
        <a-spin :spinning="spinning3">
          <role-limit
            v-on="$listeners"
            ref="module3"
            role-title="数据接入"
            :options="modulePermission[3] || {}"
          />
        </a-spin>
      </a-tab-pane>
      <a-tab-pane
        v-if="$store.state.user.selectProject == 1"
        forceRender
        :key="4"
        tab="片区管理"
      >
        <a-spin :spinning="spinning4">
          <map-permission
            v-on="$listeners"
            ref="module4"
            role-title="片区地图管理"
            :options="modulePermission[4] || {}"
          />
        </a-spin>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import RoleLimit from '../limitTree/role-limit'
import MapPermission from '../mapPermission/map-permission'
export default {
  name: 'rolesTabRole',
  provide() {
    return {
      getProvideActionList: () => this.actionList,
      getProvideTreeData: () => this.treeData,
      getCurrentRoleTab: () => this.currentTab,
      getFolderHeader: () => this.folderHeader,
      getAreaMapManagement: () => this.areaMapManagement,
      getCurrentAllPermission: () => this.moduleListAll[this.currentTab],
      getSourceTypeList: () => this.sourceTypeList,
      status: this.status
    }
  },
  props: {
    status: {
      type: String,
      requried: true,
      default: 'show'
    }
  },
  computed: {
    ...mapState({
      roleId: state => state.projectRoles.roleId
    }),
    actionList() {
      return this.moduleList[this.currentTab]
    },
    treeData() {
      return this.treeList[this.currentTab]
    }
  },
  components: {
    RoleLimit,
    MapPermission
  },
  data() {
    return {
      spinning1: false,
      spinning2: false,
      spinning3: false,
      spinning4: false,
      currentTab: 1,
      // 模块权限key: 1.大屏 2.模型 3.接入 4.片区地图
      modulePermission: {},
      // 模块对应的业务权限
      moduleList: {
        1: [],
        2: [],
        3: [],
        4: []
      },
      // 模块对应的全选业务权限(不用存后端, 只用于判断按钮状态)
      moduleListAll: {
        1: [],
        2: [],
        3: [],
        4: []
      },
      // 模块对应的树节点key: 1.大屏 2.模型 3.接入
      treeList: {},
      // 文件夹权限(各模块统一, { name: string, permission: string }[])
      folderHeader: [],
      // 黑名单机制, 为空时要传'all'
      // 根据选中的取反得出列表, [1,2,3]选中[1]则要传[2,3]
      sourceTypeList: 'all',
      // 片区数据勾选项
      areaMapManagement: {
        headOffice: [],
        section: [],
        grid: []
      }
    }
  },
  mounted() {
    this.handleGetData()
    this.$EventBus.$on('roleFileSelect', this.handleGetData)
  },
  beforeDestroy() {
    this.handleReset()
    this.$EventBus.$off('roleFileSelect', this.handleGetData)
  },
  methods: {
    handleChangeTab(activeKey) {
      this.currentTab = activeKey
    },
    handleGetFolderPermissions() {
      this.$server.projectCenter.getFolderHeader().then(res => {
        if (res.code === 200) {
          this.folderHeader = res.data
        } else {
          this.$message.error('获取文件夹权限失败')
        }
      })
    },
    handleGetSourceType() {
      this.$server.projectCenter.getRoleSourceType(this.$store.state.projectRoles.roleId)
        .then(res => {
          if (res && res.code === 200) {
            let list = 'all'
            if (res.data && res.data.forbiddenType) {
              list = res.data.forbiddenType || 'all'
            }
            this.sourceTypeList = list
            this.$emit('setSourceType', list) // 先初始化类型
          } else {
            this.$message.error(res.msg || '请求错误')
          }
        })
    },
    handleGetAreaMapChecked() {
      this.$server.projectCenter.getAreaMapChecked(this.roleId).then(res => {
        if (res.code === 200) {
          this.folderHeader = res.data
          this.areaMapManagement = {
            headOffice: res.data.headOffice || [],
            section: res.data.section || [],
            grid: res.data.grid || []
          }
          this.$emit('getAreaMapManagement', this.areaMapManagement)
        } else {
          this.$message.error('获取文件夹权限失败')
        }
      })
    },
    handleReset() {
      this.data = this.$options.data()
    },
    // 根据业务转换成文件权限
    changePermissionToFolder(permission) {
      switch (permission) {
        case 'read':
          return 'folderRead'
        case 'edit':
          return 'folderEdit'
        case 'remove':
          return 'folderRemove'
        default:
          return 'null'
      }
    },
    // 初始化模块全选栏按钮
    initAllCheckbox(index) {
      this.moduleList[index].map(({ permission }) => {
        let stop = false
        for (let i = 0; i < this.treeList[index].length; i++) {
          if (stop) break
          const item = this.treeList[index][i]
          if (item.fileType === 0) {
            const perm = this.changePermissionToFolder(permission)
            if (perm !== 'null' && !item.permissions.includes(perm)) {
              stop = true
              break
            } else if (
              item.children &&
              item.children.length &&
              item.children.length > 0
            ) {
              for (let j = 0; j < item.children.length; j++) {
                const node = item.children[j]
                if (!node.permissions.includes(permission)) {
                  stop = true
                  break
                }
              }
            }
          } else if (item.fileType === 1) {
            if (!item.permissions.includes(permission)) {
              stop = true
              break
            }
          }
        }
        if (!stop && !this.moduleListAll[index].includes(permission)) {
          this.moduleListAll[index].push(permission)
        }
      })
    },
    async handleGetData() {
      this.handleReset()
      await this.handleGetFolderPermissions()
      await this.handleGetSourceType()
      if (+this.$store.state.user.selectProject === 1) {
        await this.handleGetAreaMapChecked()
      }
      // 顺序加载
      this.spinning1 = true
      this.spinning2 = true
      this.spinning3 = true
      this.spinning4 = true
      for (let i = 1; i < 5; i++) {
        if (!this.roleId && !this.$route.params.id) {
          this.spinning1 = false
          this.spinning2 = false
          this.spinning3 = false
          this.spinning4 = false
          return
        }
        if (i === 4 && +this.$store.state.user.selectProject !== 1) return
        this.$server.projectCenter
          .getRoleTree(this.roleId || this.$route.params.id, i)
          .then(result => {
            if (result.code === 200) {
              if (result.data) {
                this.$set(this.modulePermission, i, result.data.basePrivilege || {
                  header: [],
                  permissions: []
                })
                this.$set(this.moduleList, i, [].concat(result.data.header))
                this.$set(this.treeList, i, [].concat(result.data.folder))
                this.$emit(
                  'setBasePrivilege',
                  this.modulePermission[i].permissions,
                  i + ''
                )
                // 初始化时先记录勾选过的对象
                if (this.status === 'edit') {
                  const folder = result.data.folder
                  if (Array.isArray(folder)) {
                    const list = []
                    const addItem = item => {
                      if (item.permissions.length > 0) {
                        list.push(item)
                      }
                    }
                    folder.map(item => {
                      if (item.permissions.length > 0) {
                        addItem(item)
                      }
                      if (item.children && item.children.length > 0) {
                        item.children.map(leaf => {
                          addItem(leaf)
                        })
                      }
                    })
                    this.$emit('getChangeItem', i, list)
                  }
                }
                // 初始化全选栏
                this.initAllCheckbox(i)
              }
            } else {
              this.$message.error(result.msg || '请求错误')
            }
          })
          .finally(() => {
            this['spinning' + i] = false
          })
      }
    }
  }
}
</script>

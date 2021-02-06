<template>
  <div class="middle">
    <div class="title">角色权限</div>
    <a-tabs class="tabs scrollbar" @change="handleChangeTab">
        <a-tab-pane forceRender style="padding-left: 16px" :key="1" tab="数据大屏">
            <a-spin :spinning="spinning1">
                <role-limit
                v-on="$listeners"
                role-title="数据大屏"
                :options="modulePermission[1] || {}"
                />
            </a-spin>
        </a-tab-pane>
        <a-tab-pane forceRender style="padding-left: 16px" :key="2" tab="数据模型">
            <a-spin :spinning="spinning2">
                <role-limit
                v-on="$listeners"
                role-title="数据模型"
                :options="modulePermission[2] || {}"
                />
            </a-spin>
        </a-tab-pane>
        <a-tab-pane forceRender style="padding-left: 16px" :key="3" tab="数据接入">
            <a-spin :spinning="spinning3">
                <role-limit
                v-on="$listeners"
                role-title="数据接入"
                :options="modulePermission[3] || {}"
                />
            </a-spin>
        </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import RoleLimit from '../limitTree/role-limit'
export default {
    name: 'rolesTabRole',
    provide() {
        return {
            getProvideActionList: () => this.actionList,
            getProvideTreeData: () => this.treeData,
            getCurrentRoleTab: () => this.currentTab,
            getFolderHeader: () => this.folderHeader,
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
        RoleLimit
    },
    data() {
        return {
            spinning1: false,
            spinning2: false,
            spinning3: false,
            currentTab: 1,
            modulePermission: {},
            moduleList: {},
            treeList: {},
            folderHeader: []
        }
    },
    mounted() {
        if (this.$route.params.id) {
            this.handleGetData()
        }
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
            this.$server.projectCenter.getFolderHeader()
                .then(res => {
                    if (res.code === 200) {
                        this.folderHeader = res.data
                    } else {
                        this.$message.error('获取文件夹权限失败')
                    }
                })
        },
        handleReset() {
            this.data = this.$options.data()
        },
        async handleGetData() {
            this.handleReset()
            await this.handleGetFolderPermissions()
            // 顺序加载
            this.spinning1 = true
            this.spinning2 = true
            this.spinning3 = true
            for (let i = 1; i < 4; i++) {
                const result = await this.$server.projectCenter.getRoleTree(this.roleId || this.$route.params.id, i)
                    .finally(() => {
                        this['spinning' + i] = false
                    })
                if (result.code === 200) {
                    if (result.data) {
                        this.$set(this.modulePermission, i, result.data.basePrivilege)
                        this.$set(this.moduleList, i, [].concat(result.data.header))
                        this.$set(this.treeList, i, [].concat(result.data.folder))
                        this.$emit('setBasePrivilege', this.modulePermission[i].permissions, i + '')
                        // 初始化时先记录勾选过的对象
                        if (this.status === 'edit') {
                            const folder = result.data.folder
                            if (Array.isArray(folder)) {
                                const list = []
                                const addItem = (item) => {
                                    if (item.permissions.length > 0) {
                                        list.push({
                                            id: item.id,
                                            permissions: item.permissions,
                                            name: item.title
                                        })
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
                    }
                } else {
                    this.$message.error(result.msg || '请求错误')
                }
            }
        }
    }
}
</script>

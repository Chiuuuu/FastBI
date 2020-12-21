<template>
  <div class="middle">
    <div class="title">角色权限</div>
    <a-tabs class="tabs scrollbar" @change="handleChangeTab">
        <a-tab-pane forceRender style="padding-left: 16px" key="1" tab="数据大屏">
            <a-spin :spinning="spinning1">
                <role-limit
                v-on="$listeners"
                role-title="数据大屏"
                :options="modulePermission[1] || {}"
                />
            </a-spin>
        </a-tab-pane>
        <a-tab-pane forceRender style="padding-left: 16px" key="2" tab="数据模型">
            <a-spin :spinning="spinning2">
                <role-limit
                v-on="$listeners"
                role-title="数据模型"
                :options="modulePermission[2] || {}"
                />
            </a-spin>
        </a-tab-pane>
        <a-tab-pane forceRender style="padding-left: 16px" key="3" tab="数据接入">
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
            currentTab: '1',
            modulePermission: {},
            moduleList: {},
            treeList: {}
        }
    },
    mounted() {
        if (this.$route.params.id) {
            this.handleGetData()
        }
        this.$EventBus.$on('roleFileSelect', this.handleGetData)
    },
    beforeDestroy() {
        this.$EventBus.$off('roleFileSelect', this.handleGetData)
    },
    methods: {
        handleChangeTab(activeKey) {
            this.currentTab = activeKey
        },
        async handleGetData() {
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
                    }
                } else {
                    this.$message.error(result.msg || '请求错误')
                }
            }
        }
    }
}
</script>
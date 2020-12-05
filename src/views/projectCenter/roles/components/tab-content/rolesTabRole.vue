<template>
  <div class="middle">
    <div class="title">角色权限</div>
    <a-tabs class="tabs scrollbar" @change="handleChangeTab">
        <a-tab-pane style="padding-left: 16px" key="1" tab="数据大屏">
            <role-limit
            v-on="$listeners"
            role-title="数据大屏"
            :options="modulePermission"
            />
        </a-tab-pane>
        <a-tab-pane style="padding-left: 16px" key="2" tab="数据模型">
            <role-limit
            v-on="$listeners"
            role-title="数据模型"
            :options="modulePermission"
            />
        </a-tab-pane>
        <a-tab-pane style="padding-left: 16px" key="3" tab="数据接入">
            <role-limit
            v-on="$listeners"
            role-title="数据接入"
            :options="modulePermission"
            />
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
        })
    },
    components: {
        RoleLimit
    },
    data() {
        return {
            currentTab: '1',
            modulePermission: {},
            actionList: [],
            treeData: []
        }
    },
    mounted() {
        this.handleGetData()
    },
    methods: {
        handleChangeTab(activeKey) {
            this.currentTab = activeKey
            this.handleGetData()
        },
        async handleGetData() {
            const result = await this.$server.projectCenter.getRoleTree(this.roleId || this.$route.params.id, this.currentTab)
            if (result.code === 200) {
                this.modulePermission = result.data.basePrivilege
                this.$emit('setBasePrivilege', this.modulePermission.permissions, this.currentTab)
                this.actionList = [].concat(result.data.header)
                this.treeData = [].concat(result.data.folder)
            } else {
                this.$message.error(result.msg || '请求错误')
            }
        }
    }
}
</script>

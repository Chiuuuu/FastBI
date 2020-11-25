<template>
  <div class="middle">
    <div class="title">角色权限</div>
    <a-tabs class="tabs scrollbar" @change="handleChangeTab">
        <a-tab-pane style="padding-left: 16px" key="screen" tab="数据大屏">
            <role-limit
            :status="status"
            role-title="数据大屏"
            :options="['新建数据大屏', '新建文件夹']"
            />
        </a-tab-pane>
        <a-tab-pane style="padding-left: 16px" key="model" tab="数据模型">
            <role-limit
            :status="status"
            role-title="数据模型"
            :options="['新建数据模型', '新建文件夹']"
            />
        </a-tab-pane>
        <a-tab-pane style="padding-left: 16px" key="access" tab="数据接入">
            <role-limit
            :status="status"
            role-title="数据接入"
            :options="['新建数据接入', '新建文件夹']"
            />
        </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script>
import RoleLimit from '../limitTree/role-limit'
export default {
    name: 'rolesTabRole',
    props: {
        status: {
            type: String,
            requried: true,
            default: 'show'
        }
    },
    components: {
        RoleLimit
    },
    data() {
        return {
            currentTab: 'screen',
        }
    },
    methods: {
        handleChangeTab(activeKey) {
            this.currentTab = activeKey
        }
    }
}
</script>

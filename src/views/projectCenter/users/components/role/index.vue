<template>
    <div class="user-layout">
        <div class="role-list-controller">
            <a-form-model layout="inline" :model="userMangeForm" ref="userMangeForm">
                <a-form-model-item label="用户名" prop="username">
                    <a-input v-model="userMangeForm.username" class="form-item"></a-input>
                </a-form-model-item>
                <a-form-model-item label="姓名" prop="name">
                    <a-input v-model="userMangeForm.name" class="form-item"></a-input>
                </a-form-model-item>
                <a-form-model-item>
                    <a-button type="primary" @click="handleGetData" :disabled="loading">查询</a-button>
                </a-form-model-item>
                <a-form-model-item>
                    <a-button type="primary" @click="handleRestForm" :disabled="loading">重置</a-button>
                </a-form-model-item>
            </a-form-model>
        </div>
        <div class="role-list-table scrollbar">
            <a-table
                row-key="id"
                :columns="rolesColumn"
                :data-source="rolesData"
                :loading="loading"
                :scroll="{ y: 'calc(100vh - 350px)', x: 1450 }">
            </a-table>
        </div>
    </div>
</template>
<script>
const rolesData = []
for (let i = 0; i < 30; i++) {
  rolesData.push({
    id: i + 1,
    username: 'admin' + i,
    name: '嘿嘿嘿',
    1: '属性1',
    2: '属性2',
    3: '属性3',
    4: '属性4',
    5: '属性5',
    6: '属性6'
  })
}

const rolesColumn = [
  {
    title: '用户名',
    width: 150,
    ellipsis: true,
    dataIndex: 'username'
  },
  {
    title: '姓名',
    width: 100,
    ellipsis: true,
    dataIndex: 'name'
  }
]
for (let i = 1; i < 7; i++) {
  rolesColumn.push({
    title: '属性' + i,
    dataIndex: i,
    width: 200,
    ellipsis: true
  })
}

export default {
    name: 'userRoleManage',
    data() {
        return {
            rolesData,
            rolesColumn,
            userMangeForm: { // 搜索表单
                username: '',
                name: ''
            },
            loading: false
        }
    },
    mounted() {
        this.handleGetData()
    },
    methods: {
        /** 获取数据 */
        handleGetData() {
            this.loading = true
            setTimeout(() => {
                this.rolesData = rolesData
                this.loading = false
            }, 400)
        },
        /** 重置表单 */
        handleRestForm() {
            this.$refs.userMangeForm.resetFields()
        }
    }
}
</script>

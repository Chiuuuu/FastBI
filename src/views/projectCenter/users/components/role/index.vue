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
                :loading="loading">
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
    prop1: '属性1',
    prop2: '属性2',
    prop3: '属性3'
  })
}

const rolesColumn = [
  {
    title: '用户名',
    dataIndex: 'username'
  },
  {
    title: '姓名',
    dataIndex: 'name'
  },
  {
    title: '属性1',
    dataIndex: 'prop1',
    width: 200,
    ellipsis: true
  },
  {
    title: '属性2',
    dataIndex: 'prop2',
    width: 200,
    ellipsis: true
  },
  {
    title: '属性3',
    dataIndex: 'prop3',
    width: 200,
    ellipsis: true
  }
]

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

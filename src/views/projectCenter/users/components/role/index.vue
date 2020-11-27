<template>
    <div class="user-layout">
        <div class="role-list-controller">
            <a-form-model layout="inline" :model="userMangeForm" ref="userMangeForm">
                <a-form-model-item label="用户名" prop="username">
                    <a-input v-model="userMangeForm.username" class="form-item" placeholder="请输入用户名"></a-input>
                </a-form-model-item>
                <a-form-model-item label="姓名" prop="name">
                    <a-input v-model="userMangeForm.name" class="form-item" placeholder="请输入姓名"></a-input>
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
                :scroll="{ x: `100vh`, y: `calc(100vh - 350px)`}"
                :loading="loading">
            </a-table>
        </div>
    </div>
</template>
<script>
export default {
    name: 'userRoleManage',
    data() {
        return {
            rolesData: [],
            rolesColumn: [],
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
        async handleGetData() {
            this.loading = true
            const result = await this.$server.projectCenter.getUserPropsList(this.userMangeForm).finally(() => {
                this.loading = false
            })

            if (result.code === 200) {
                const ary = []
                result.headersKeyValue.forEach((item,index) => {
                    let column = {
                        title: result.headers[index],
                        dataIndex: item,
                        width: 200,
                        ellipsis: true
                    }
                    ary.push(column)
                })
                this.rolesColumn = [].concat(ary)
                this.rolesData = [].concat(result.rows)
            } else {
                this.$message.error(result.msg || '请求错误')
            }
        },
        /** 重置表单 */
        handleRestForm() {
            this.$refs.userMangeForm.resetFields()
        }
    }
}
</script>

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
                <a-form-model-item label="用户角色" prop="role">
                    <a-select v-model="userMangeForm.role" mode="multiple" class="form-item" placeholder="请选择角色">
                        <a-select-option v-for="i in 25" :key="(i + 9).toString(36) + i">
                        {{ (i + 9).toString(36) + i }}
                        </a-select-option>
                    </a-select>
                </a-form-model-item>
                <a-form-model-item>
                    <a-button type="primary" @click="handleGetData" :disabled="loading">查询</a-button>
                </a-form-model-item>
                <a-form-model-item>
                    <a-button type="primary" @click="handleRestForm" :disabled="loading">重置</a-button>
                </a-form-model-item>
            </a-form-model>
            <a-button class="btn-add" type="primary" @click="handleShowModal('add')" :disabled="loading">添加</a-button>
        </div>
        <div class="role-list-table scrollbar">
            <a-table
                row-key="id"
                :columns="usersColumn"
                :data-source="usersData"
                :loading="loading"
                :scroll="{ y: 'calc(100vh - 350px)', x: 770 }">
                <template #config="text, record, index">
                    <a @click="handleEditUser(record)" style="margin-right: 20px">编辑</a>
                    <a-popconfirm title="是否要删除？" ok-text="确定" cancel-text="取消" @confirm="handleDeleteUser(record, index)">
                        <a href="#">删除</a>
                    </a-popconfirm>
                </template>
            </a-table>
        </div>
        <a-modal
            v-model="visible"
            :maskClosable="false"
            :title="modalType === 'add' ? '添加用户' : '编辑用户'"
            :confirmLoading="confirmLoading"
            @ok="handleModalSubmit"
            @cancel="handleModalCancel">
            <a-form-model
                ref="modalForm"
                :model="modalForm"
                :rules="rules"
                :label-col="{ span: 6 }"
                :wrapper-col="{ span: 16 }">
                <a-form-model-item label="用户名" prop="username">
                    <a-input
                        mode="multiple"
                        v-model="modalForm.username"
                        style="width: 100%"
                        placeholder="请输入用户名"
                    >
                    </a-input>
                </a-form-model-item>
                <a-form-model-item label="用户角色" prop="users">
                <a-select
                    mode="multiple"
                    v-model="modalForm.users"
                    style="width: 100%"
                    placeholder="请选择用户角色"
                >
                    <a-select-option v-for="i in 25" :key="(i + 9).toString(36) + i">
                    {{ (i + 9).toString(36) + i }}
                    </a-select-option>
                </a-select>
                </a-form-model-item>
            </a-form-model>
        </a-modal>
    </div>
</template>
<script>
const usersData = []
for (let i = 0; i < 30; i++) {
  let item
  if ([2, 4].includes(i)) {
    item = {
      id: i + 1,
      name: '嘿嘿嘿',
      phone: '12345678910',
      role: '打工人' + (i + 1) + '号',
      gmtCreate: '2020-11-19 15:09'
    }
  } else {
    item = {
      id: i + 1,
      name: '嘿嘿嘿',
      phone: '12345678910',
      role: '打工人' + (i + 1) + '号',
      username: 'admin' + i,
      gmtCreate: '2020-11-19 15:09'
    }
  }

  usersData.push(item)
}

const usersColumn = [
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
  },
  {
    title: '电话',
    width: 120,
    ellipsis: true,
    dataIndex: 'phone'
  },
  {
    title: '用户角色',
    width: 200,
    ellipsis: true,
    dataIndex: 'role'
  },
  {
    title: '创建时间',
    dataIndex: 'gmtCreate',
    width: 200,
    ellipsis: true
  },
  {
    title: '操作',
    dataIndex: 'config',
    fixed: 'right',
    width: 120,
    scopedSlots: { customRender: 'config' }
  }
]

export default {
    name: 'userManage',
    data() {
        return {
            usersData,
            usersColumn,
            userMangeForm: { // 搜索表单
                username: '',
                name: '',
                role: []
            },
            modalType: 'add', // 模态窗口的类型，添加(add)/编辑(edit)
            loading: false,
            visible: false, // 模态窗口的显示
            confirmLoading: false, // 模态窗口确定按钮 loading
            modalForm: {
                username: '',
                users: []
            },
            rules: {
                username: [
                    { required: true, message: '请填写用户名' },
                    {
                        type: 'string',
                        max: 20,
                        min: 1,
                        message: '长度为1~20'
                    },
                    {
                        pattern: new RegExp('^[a-zA-Z0-9]*$'),
                        message: '只能填英文字母和数字'
                    }
                ],
                users: [
                    { required: true, message: '请选择用户名' }
                ]
            }
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
                this.usersData = usersData
                this.loading = false
            }, 400)
        },
        /** 重置表单 */
        handleRestForm() {
            this.$refs.userMangeForm.resetFields()
        },
        handleShowModal(type) {
            this.confirmLoading = false
            this.visible = true
            this.modalType = type
        },
        /** 模态窗口确定 */
        handleModalSubmit() {
            if (this.modalType === 'add') {
                // 新增保存
            } else if (this.modalType === 'edit') {
                // 编辑保存
            }
            this.confirmLoading = true
            this.visible = false
            this.handleModalCancel()
        },
        /** 模态窗口取消 */
        handleModalCancel() {
            this.modalForm = this.$options.data().modalForm
            this.$refs.modalForm.resetFields()
        },
        /** 编辑操作 */
        handleEditUser(data) {
            this.modalForm = {
                username: data.username,
                role: ''
            }
            this.handleShowModal('edit')
        },
        /** 删除操作 */
        handleDeleteUser({ id }, index) {
            this.usersData.splice(index, 1)
        }
    }
}
</script>
<style lang="less" scoped>
@import "../../../main.less";
</style>

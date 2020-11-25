<template>
  <div class="role-layout">
    <div class="role-list-controller">
      <a-form-model layout="inline" :model="roleForm" ref="roleForm">
        <a-form-model-item label="用户名" prop="username">
          <a-input v-model="roleForm.username" class="form-item"></a-input>
        </a-form-model-item>
        <a-form-model-item>
          <a-button type="primary" @click="handleGetData" :disabled="loading"
            >查询</a-button
          >
        </a-form-model-item>
      </a-form-model>
      <a-button class="btn-add" type="primary" @click="handleShowModal"
        >添加</a-button
      >
    </div>
    <a-table
      class="role-list-table scrollbar"
      row-key="id"
      :columns="tableColumn"
      :data-source="tableData"
      :loading="loading"
    >
      <template #config="text, record, index">
        <a-popconfirm title="是否要删除？" ok-text="确定" cancel-text="取消" @confirm="handleDeleteUser(record, index)">
          <a href="#">删除</a>
        </a-popconfirm>
      </template>
    </a-table>
    <a-modal
      title="添加用户"
      v-model="visible"
      @ok="handleModalSubmit"
      @cancel="handleModalCancel"
    >
      <a-form-model
        ref="modalForm"
        :model="modalForm"
        :rules="rules"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 16 }"
      >
        <a-form-model-item label="用户名" prop="users">
          <a-select
            mode="multiple"
            v-model="modalForm.users"
            style="width: 100%"
            placeholder="请输入用户名进行查询"
            @change="handleInputRole"
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
const tableData = []
for (let i = 0; i < 30; i++) {
  tableData.push({
    id: i + 1,
    username: 'admin' + i,
    name: '嘿嘿嘿',
    gmtModify: '2020-11-19 15:09'
  })
}

const tableColumn = [
  {
    title: '用户名',
    dataIndex: 'username'
  },
  {
    title: '姓名',
    dataIndex: 'name'
  },
  {
    title: '修改时间',
    dataIndex: 'gmtModify',
    width: 200,
    ellipsis: true
  },
  {
    title: '操作',
    dataIndex: 'config',
    scopedSlots: { customRender: 'config' }
  }
]
export default {
    name: 'roleUser',
    data() {
        return {
            tableData,
            tableColumn,
            roleForm: {
                username: ''
            },
            modalForm: {
                users: []
            },
            rules: {
                users: [
                { required: true, message: '请选择用户名' }
                ]
            },
            loading: false,
            visible: false,
            confirmLoading: false
        }
    },
    mounted() {
        this.handleGetData()
    },
    methods: {
        handleGetData() {
            this.loading = true
            setTimeout(() => {
                this.tableData = tableData
                this.loading = false
            }, 400)
        },
        handleShowModal() {
            this.confirmLoading = true
            this.visible = true
        },
        /** 模态窗口确定 */
        handleModalSubmit() {
            this.confirmLoading = true
            this.visible = false
            this.handleModalCancel()
        },
        /** 模态窗口取消 */
        handleModalCancel() {
            this.modalForm = this.$options.data().modalForm
            this.$refs.modalForm.resetFields()
        },
        handleInputRole() {

        },
        handleDeleteUser({ id }, index) {
            this.tableData.splice(index, 1)
        }
    }
}
</script>

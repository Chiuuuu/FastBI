<template>
  <a-modal
    :bodyStyle="bodyStyle"
    :title="modalType === 'edit' ? '编辑用户' : '新建用户'"
    :visible="show"
    :maskClosable="false"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleModalCancel">
    <a-form-model ref="form" :model="form" :rules="rules" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
      <a-form-model-item label="用户名" prop="username">
        <a-input
          mode="multiple"
          v-model="form.username"
          style="width: 100%"
          placeholder="请输入用户名"
          :disabled="modalType === 'edit'"
        >
        </a-input>
      </a-form-model-item>
      <a-form-model-item label="密码" prop="password">
        <a-input-password
          mode="multiple"
          v-model="form.password"
          style="width: 100%"
          placeholder="请输入密码"
        >
        </a-input-password>
      </a-form-model-item>
      <a-form-model-item label="确认密码" prop="pswConfirm">
        <a-input-password
          mode="multiple"
          v-model="form.pswConfirm"
          style="width: 100%"
          placeholder="请确认密码"
        >
        </a-input-password>
      </a-form-model-item>
      <a-form-model-item label="姓名" prop="name">
        <a-input
          mode="multiple"
          v-model="form.name"
          style="width: 100%"
          placeholder="请输入姓名"
        >
        </a-input>
      </a-form-model-item>
      <a-form-model-item label="电话" prop="phone">
        <a-input
          mode="multiple"
          v-model="form.phone"
          style="width: 100%"
          placeholder="请输入电话"
        >
        </a-input>
      </a-form-model-item>
      <a-form-model-item label="所属项目" prop="project">
        <a-select
          mode="multiple"
          v-model="form.project"
          style="width: 100%"
          placeholder="请选择项目"
        >
          <a-select-option v-for="item in projectList" :key="item.id">
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="部门" prop="dept" @change="getPostList">
        <a-select
          mode="multiple"
          v-model="form.dept"
          style="width: 100%"
          placeholder="请选择岗位"
        >
          <a-select-option v-for="item in deptList" :key="item.id">
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="岗位" prop="post">
        <a-select
          mode="multiple"
          v-model="form.post"
          style="width: 100%"
          placeholder="请选择岗位"
        >
          <a-select-option v-for="item in postList" :key="item.id">
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
export default {
  name: 'personnelUserModal',
  props: {
    modalType: String,
    modalData: Object,
    show: Boolean
  },
  watch: {
    show(newValue) {
      if (newValue) {
        // 获取项目, 部门列表
        this.getProjectList()
        this.getDepartList()
      }
    },
    modalType(newValue) {
      if (newValue === 'edit') {
        this.form = Object.assign({}, this.form, this.modalData)
        this.projectList = this.projectList.concat(this.modalData.project)
        this.deptList.push(this.modalData.department)
        this.postList.push(this.modalData.post)
      } else {
        this.form = this.$options.data().form
      }
    }
  },
  data() {
    return {
      bodyStyle: { height: 'calc(100vh - 240px)', 'overflow-y': 'auto' },
      confirmLoading: false, // 模态窗口确定按钮 loading
      form: {
        username: '',
        name: '',
        password: '',
        pswConfirm: '',
        phone: '',
        project: [],
        dept: [],
        post: []
      },
      rules: {
        username: [
          { required: true, message: '请填写用户名' },
          {
            type: 'string',
            max: 20,
            min: 2,
            message: '长度为2~20'
          }
        ],
        password: [
          { required: true, message: '请填写密码' },
          {
            pattern: new RegExp('^[0-9]*$'),
            message: '只能填数字'
          },
          {
            type: 'string',
            max: 20,
            min: 6,
            message: '长度为6~20'
          },
          { validator: this.passwordValidate, trigger: 'change' }
        ],
        pswConfirm: [
          { required: true, message: '请确认密码' },
          { validator: this.confirmValidate, trigger: 'change' }
        ],
        name: [
          { required: true, message: '请填写姓名' },
          {
            type: 'string',
            max: 10,
            message: '长度为1~10'
          }
        ],
        phone: [
          { required: true, message: '请填写电话' },
          {
            pattern: new RegExp('^[0-9]*$'),
            message: '只能填数字'
          },
          {
            type: 'string',
            len: 11,
            message: '请填写11位手机号'
          }
        ],
        project: [{ required: true, message: '请选择所属项目' }]
      },
      projectList: [],
      deptList: [],
      postList: []
    }
  },
  methods: {
    async getProjectList() {
      const res = await this.$server.corporateDomain.getProjectList()
      if (res.code === 200) {
        this.projectList = res.data
      } else {
        this.projectList = []
        this.$message.error('获取岗位列表失败')
      }
    },
    async getDepartList() {
      const res = await this.$server.corporateDomain.getDeptList()
      if (res.code === 200) {
        this.deptList = res.data
        if (res.data.length > 0) {
          this.form.dept = res.data[0].id
          this.getPostList(res.data[0].id)
        }
      } else {
        this.deptList = []
        this.$message.error('获取部门列表失败')
      }
    },
    async getPostList(id) {
      const res = await this.$server.corporateDomain.getPostList(id)
      if (res.code === 200) {
        this.postList = res.data
      } else {
        this.postList = []
        this.$message.error('获取岗位列表失败')
      }
    },
    passwordValidate(rule, value, callback) {
      if (/[\u4e00-\u9fa5]/.test(value)) {
        callback(new Error('暂不支持中文密码'))
      } else if (value.length > 20 || value.length < 6) {
        callback(new Error('请输入6~20位密码'))
      } else {
        this.$refs.form.validateField('pswConfirm')
        callback()
      }
    },
    confirmValidate(rule, value, callback) {
      if (value !== this.form.password) {
        callback(new Error('2次密码输入不一致'))
      } else {
        callback()
      }
    },
    handleModalCancel() {
      this.form = this.$options.data().form
      this.$refs.form.resetFields()
      this.confirmLoading = false
      this.$emit('close')
    },
    handleOk() {
      const params = this.form
      this.confirmLoading = true
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.modalType === 'add') {
            // 新增保存
          } else if (this.modalType === 'edit') {
            // 编辑保存
          }
          this.handleModalCancel()
        } else {
            return false
        }
      })
    }
  }
}
</script>

<style>

</style>

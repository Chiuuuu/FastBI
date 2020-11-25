<template>
  <a-modal :title="modalType === 'edit' ? '编辑用户' : '新建用户'" :visible="show" @ok="handleOk" @cancel="clearModal">
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
      <a-form-model-item label="部门" prop="depart">
        <a-select
          mode="multiple"
          v-model="form.depart"
          style="width: 100%"
          placeholder="请选择岗位"
        >
          <a-select-option v-for="i in 25" :key="(i + 9).toString(36) + i">
            {{ (i + 9).toString(36) + i }}
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
          <a-select-option v-for="i in 25" :key="(i + 9).toString(36) + i">
            {{ (i + 9).toString(36) + i }}
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
    show(newValue, oldValue) {
      if (newValue) {
        this.form = Object.assign({}, this.form, this.modalData)
      }
    }
  },
  data() {
    return {
      form: {
        username: '',
        name: '',
        password: '',
        pswConfirm: '',
        phone: '',
        depart: '',
        post: ''
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
            type: 'number',
            len: 11,
            message: '请填写11位电话号码'
          }
        ]
      }
    }
  },
  methods: {
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
      if (/[\u4e00-\u9fa5]/.test(value)) {
        callback(new Error('暂不支持中文密码'))
      } else if (value.length > 20 || value.length < 6) {
        callback(new Error('请输入6~20位密码'))
      } else if (value !== this.form.password) {
        callback(new Error('2次密码输入不一致'))
      } else {
        callback()
      }
    },
    clearModal() {
      this.form = this.$options.data().form
      this.$emit('close')
    },
    handleOk() {
      const params = this.form
      if (this.modalType === 'add') {
        // 新增保存
      } else if (this.modalType === 'edit') {
        // 编辑保存
      }
      this.clearModal()
    }
  }
}
</script>

<style>

</style>

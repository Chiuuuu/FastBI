<template>
<div class="tab-datasource">
  <a-form-model
    ref="dbForm"
    :model="form"
    :rules="rules"
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
    @validate="handleValidateFiled"
  >
    <a-form-model-item label="数据源名称" prop="name">
      <a-input
        style="width:528px;"
        v-model="form.name"
        @change="handleSetTableName"
      />
    </a-form-model-item>
    <a-form-model-item label="服务器" prop="ip">
      <a-input style="width:528px;" v-model="form.ip" />
    </a-form-model-item>
    <a-form-model-item label="端口" prop="port">
      <a-input style="width:528px;" v-model.number="form.port" />
    </a-form-model-item>
    <a-form-model-item label="用户名" prop="username">
      <a-input style="width:528px;" v-model="form.username" />
    </a-form-model-item>
    <a-form-model-item label="密码" prop="password">
      <a-input-password style="width:528px;" v-model="form.password" />
    </a-form-model-item>
    <a-row>
      <a-col :span="7">
        <a-form-model-item label="连接方式" :label-col="{span: 14}" required labelAlign="left">
          <a-select default-value="servername" style="width:115px;margin-left:-4px">
            <a-select-option value="sid">
              SID
            </a-select-option>
            <a-select-option value="servername">
              ServerName
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-col>
      <a-col :span="10">
        <a-form-model-item prop="databaseName" :wrapper-col="{span:24}">
          <a-input v-model="form.databaseName" style="width:400px;"/>
        </a-form-model-item>
      </a-col>
    </a-row>
    <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
      <a-button
        :loading="connectBtn"
        type="primary"
        style="width:88px;height:30px"
        @click="handleConnect"
      >
        连接
      </a-button>
    </a-form-model-item>
  </a-form-model>
  <a-button
    type="primary"
    class="btn_sub"
    @click="handleSaveForm"
    :disabled="!connectStatus"
    :loading="saveBtn"
    >
    保存
    </a-button>
</div>
</template>
<script>
import Mysql from './mysql'
import { validateIP } from './util'
export default {
  name: 'model-oracle',
  extends: Mysql,
  data() {
    return {
      labelCol: { span: 4 },
      wrapperCol: { span: 10 },
      formId: '',
      form: {
        // 连接信息表单
        name: '', // 数据源名
        ip: '', // 服务器ip
        port: '', // 端口号
        username: '', // 用户名
        password: '', // 密码
        databaseName: '' // 数据库名称
      },
      rules: {
        name: [
          {
            required: true,
            message: '请输入数据源名称'
          },
          {
            type: 'string',
            max: 20,
            min: 1,
            message: '长度为1~20'
          }
        ],
        ip: [
          {
            required: true,
            message: '请输入服务器ip地址'
          },
          {
            validator: validateIP,
            trigger: 'blur'
          }
        ],
        port: [
          { required: true, message: '请输入端口号' },
          { type: 'integer', message: '请输入数字', min: 0 }
        ],
        username: [
          {
            required: true,
            message: '请输入用户名'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码'
          }
        ],
        databaseName: [
          {
            required: true,
            message: '请输入数据库名称'
          }
        ]
      },
      connectBtn: false,
      connectStatus: false, // 是否连接
      saveBtn: false
    }
  },
  methods: {
    /**
     * 连接数据库
     */
    handleConnect() {
      this.$refs.dbForm.validate(async valid => {
        if (valid) {
          this.connectBtn = true
          const result = await this.$server.dataAccess.actionConnect('oracle', { ...this.form })
            .finally(() => {
              this.connectBtn = false
            })

          if (result.code === 200) {
            this.connectStatus = true
            this.$message.success('连接成功')
          } else {
            this.$message.warning(result.msg)
          }
        } else {
          this.connectStatus = false
          return false
        }
      })
    },
    /**
     * 保存数据表
     */
    handleSaveForm() {
      this.$refs.dbForm.validate(async valid => {
        if (valid) {
          this.saveBtn = true
          delete this.form.dbid
          const result = await this.$server.dataAccess.saveTableInfo('/system/oracle', {
            id: this.formId,
            ...this.form
          }).finally(() => {
            this.saveBtn = false
          })
          if (result.code === 200) {
            this.$store.dispatch('dataAccess/getMenuList')
            this.$store.dispatch('dataAccess/setFirstFinished', true)
            this.$store.dispatch('dataAccess/setModelInfo', this.form)
            this.$store.dispatch('dataAccess/setModelId', result.data)
            this.formId = result.data
            this.$message.success(result.msg)
          } else {
            this.$message.error(result.msg)
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>

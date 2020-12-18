<template>
<div class="tab-datasource">
  <a-form-model
    ref="dbForm"
    class="tab-datasource-model scrollbar"
    labelAlign="left"
    :model="form"
    :rules="rules"
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
    @validate="handleValidateFiled"
  >
    <a-form-model-item label="数据源名称" prop="name">
      <a-input
        v-model="form.name"
        @change="handleSetTableName"
      />
    </a-form-model-item>
    <a-form-model-item label="连接模式" prop="linkMode">
      <a-select v-model="form.linkMode">
        <a-select-option :value="1">
          hiveserver2
        </a-select-option>
        <!-- <a-select-option :value="2">
          zookeeper
        </a-select-option> -->
      </a-select>
    </a-form-model-item>
    <a-form-model-item label="服务器" prop="ip">
      <a-input v-model="form.ip" />
    </a-form-model-item>
    <a-form-model-item label="端口" prop="port" v-if="form.linkMode === 1" :rules="[
      { required: true, message: '请输入端口号' },
      { type: 'integer', message: '请输入数字', min: 0 }
    ]">
      <a-input v-model.number="form.port" />
    </a-form-model-item>
    <a-form-model-item label="HiveServer2 IP" prop="hiveserver">
      <a-input v-model="form.hiveserver" />
    </a-form-model-item>
    <a-form-model-item label="hdfs端口" prop="hdfsPort">
      <a-input v-model.number="form.hdfsPort" />
    </a-form-model-item>
    <a-form-model-item label="命名空间" prop="namescape" v-if="form.linkMode === 2" :rules="[{
        required: true,
        message: '请输入命名空间'
      }]">
      <a-input v-model.number="form.namescape" />
    </a-form-model-item>
    <a-form-model-item label="认证方式" prop="authMethod">
      <a-select v-model="form.authMethod" @change="handleChangeMethod">
        <a-select-option :value="0">无</a-select-option>
        <!-- <a-select-option :value="1">kerberos</a-select-option> -->
        <a-select-option :value="2">用户名</a-select-option>
        <a-select-option :value="3">用户名密码</a-select-option>
      </a-select>
    </a-form-model-item>
    <template v-if="form.authMethod === 1">
      <a-form-model-item label="服务器principal" prop="server" :rules="[
      {
        required: true,
        message: '请输入服务器principal'
      },
      {
        type: 'string',
        max: 100,
        min: 1,
        message: '长度为1~100'
      }]">
        <a-input v-model="form.server" />
      </a-form-model-item>
      <a-form-model-item label="客户端principal" prop="client" :rules="[
        {
          required: true,
          message: '客户端principal'
        },
        {
          type: 'string',
          max: 100,
          min: 1,
          message: '长度为1~100'
        }]">
        <a-input v-model="form.client" />
      </a-form-model-item>
      <a-form-model-item label="keytab文件" required>
        <a-input-search disabled v-model="filename">
          <a-button slot="enterButton" @click.native="$refs.uploader.click()">上传</a-button>
        </a-input-search>
        <input ref="uploader" class="unvisible" type="file" @change="handleUploadFile">
      </a-form-model-item>
    </template>
    <a-form-model-item v-if="form.authMethod === 2 || form.authMethod === 3" label="用户名" prop="user" :rules="[{
      required: true,
      message: '请输入用户名'
    }]">
      <a-input v-model="form.user" />
    </a-form-model-item>
    <a-form-model-item v-if="form.authMethod === 3" label="密码" prop="password" :rules="[
      {
        required: true,
        message: '请输入密码'
      }
    ]">
      <a-input-password v-model="form.password" />
    </a-form-model-item>
    <a-form-model-item class="form-not-required" label="默认组" prop="databaseName" v-if="connectStatus">
      <a-select
        v-model="form.databaseName"
        :default-value="form.databaseName || databaseList[0].name"
        @change="handleDefaultDbSelect"
      >
        <a-select-option
          v-for="item in databaseList"
          :value="item.name"
          :key="item.id"
        >
          {{ item.name }}
        </a-select-option>
      </a-select>
    </a-form-model-item>
    <!-- <a-form-model-item class="form-not-required" label="初始化SQL" prop="sql">
      <a-textarea class="hive-textarea"></a-textarea>
    </a-form-model-item> -->
    <a-form-model-item :wrapper-col="{ span: 14 }">
      <a-button
        :loading="connectBtn"
        type="primary"
        style="width:88px;height:30px;margin-left:150px"
        @click="handleConnect"
        v-permission:[btnPermission]="$PERMISSION_CODE.OBJECT.datasource"
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
    v-permission:[btnPermission]="$PERMISSION_CODE.OBJECT.datasource"
    >
    保存
    </a-button>
</div>
</template>
<script>
import Mysql from './mysql'
import { validateIP } from '../util'
export default {
  name: 'model-hive',
  extends: Mysql,
  data() {
    return {
      labelCol: {
        xs: { span: 4 },
        sm: { span: 3 },
        md: { span: 3 },
        lg: { span: 3 }
      },
      wrapperCol: { span: 14 },
      formId: '',
      keyTabFile: '',
      form: {
        // 连接信息表单
        name: '', // 数据源名
        ip: '', // 服务器ip
        port: '', // 端口号
        hiveserver: '', // 服务器ip
        hdfsPort: '', // hdfs端口号
        namescape: '', // 命名空间
        user: '', // 用户名
        password: '', // 密码
        databaseName: '', // 数据库名称
        linkMode: 1, // 连接模式
        authMethod: 0 // 认证方式
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
        hiveserver: [
          {
            required: true,
            message: '请输入Hive ip地址'
          },
          {
            validator: validateIP,
            trigger: 'blur'
          }
        ],
        hdfsPort: [
          { required: true, message: '请输入端口号' },
          { type: 'integer', message: '请输入数字', min: 0 }
        ],
        linkMode: [
          { required: true, message: '请选择连接模式' }
        ],
        authMethod: [
          { required: true, message: '请选择认证方式' }
        ]
      },
      connectBtn: false,
      connectStatus: false, // 是否连接
      saveBtn: false,
      filename: '',
      databaseList: []
    }
  },
  methods: {
    /**
     * 任一表单项被校验后触发
     * prop 字段名称
     * result 是否校验成功
     * err 错误信息
     */
    handleValidateFiled(prop, result, err) {
      if (!result) {
        this.connectStatus = false
        this.$emit('on-set-tab', '1')
        let setFirstFinished = false
        if (prop === 'password' && this.modelId !== 0) {
          setFirstFinished = true
        }
        this.$store.dispatch('dataAccess/setFirstFinished', setFirstFinished)
      }
    },
    handleChangeMethod() {
      this.$refs.dbForm.clearValidate(['server', 'client', 'user', 'password'])
    },
    handleUploadFile(e) {
      const file = e.target.files[0]
      console.log(file)
      let name = file.name
      // 校验csv文件类型
      const fileType = name.slice(name.lastIndexOf('.') + 1, name.length)
      if (/keytab/.test(fileType)) {
        this.filename = name.slice(0, name.lastIndexOf('.'))
        this.keyTabFile = file
      } else {
        this.$message.error(name + '不是keytab文件')
      }

      e.target.value = ''
    },
    /**
     * 连接数据库
     */
    handleConnect() {
      this.$refs.dbForm.validate(async valid => {
        if (valid) {
          this.connectBtn = true
          const result = await this.$server.dataAccess.actionConnect({
            name: this.form.name,
            type: 3,
            property: {
              ip: this.form.ip,
              port: this.form.port,
              password: this.form.password,
              authMethod: this.form.authMethod,
              hiveserver: this.form.hiveserver,
              hdfsPort: this.form.hdfsPort,
              user: this.form.user
            }
          }).finally(() => {
            this.connectBtn = false
          })

          if (result.code === 200) {
            this.databaseList = [].concat(result.rows)
            const item = this.databaseList.find(item => item.name === this.$store.state.dataAccess.modelInfo.databaseName)
            if (item) {
              this.form.databaseName = item.name
            } else {
              this.form.databaseName = this.databaseList[0].name
            }
            this.connectStatus = true
            this.$message.success('连接成功')
          } else {
            this.$message.error(result.msg)
          }
        } else {
          this.connectStatus = false
          return false
        }
      })
    },
    /**
     * 默认选择数据库操作
     * value 选中的name
     */
    handleDefaultDbSelect(value) {
      const item = this.databaseList.filter(item => {
        return item.name === value && item
      })
      const obj = item.pop()
      // this.form.dbid = obj.id
      this.form.databaseName = obj.name

      const formInfo = Object.assign({}, this.form)
      this.$store.dispatch('dataAccess/setModelInfo', formInfo)
    },
    /**
     * 保存数据表
     */
    handleSaveForm() {
      this.$refs.dbForm.validate(async valid => {
        if (valid) {
          this.saveBtn = true
          const params = {
            id: this.$store.state.dataAccess.modelId,
            name: this.$store.state.dataAccess.modelName,
            parentId: this.$store.state.dataAccess.parentId,
            property: {
              user: this.form.user,
              ip: this.form.ip,
              hiveserver: this.form.hiveserver,
              hdfsPort: this.form.hdfsPort,
              port: this.form.port,
              password: this.form.password,
              databaseName: this.form.databaseName
            },
            type: 3
          }
          const result = await this.$server.dataAccess.saveTableInfo('/datasource/save', params)
            .finally(() => {
              this.saveBtn = false
            })
          if (result.code === 200) {
            this.$message.success('保存成功，可抽取库表')
            const formInfo = Object.assign({}, this.form)
            this.$store.dispatch('dataAccess/getMenuList')
            this.$store.dispatch('dataAccess/setFirstFinished', true)
            this.$store.dispatch('dataAccess/setModelInfo', formInfo)
            this.$store.dispatch('dataAccess/setModelName', this.form.name)
            this.$store.dispatch('dataAccess/setModelId', result.data)
            this.$store.dispatch('dataAccess/setParentId', 0)
            this.formId = result.data
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
<style scoped>
.unvisible {
  display: block;
  width: 0;
  height: 0;
  visibility: hidden;
}
.hive-textarea {
  height: 120px;
  resize: unset;
}
</style>

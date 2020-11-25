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
    <a-form-model-item label="服务器" prop="ip">
      <a-input v-model="form.ip" />
    </a-form-model-item>
    <a-form-model-item label="端口" prop="port">
      <a-input v-model.number="form.port" />
    </a-form-model-item>
    <a-form-model-item label="用户名" prop="user">
      <a-input v-model="form.user" />
    </a-form-model-item>
    <a-form-model-item label="密码" prop="password">
      <a-input-password v-model="form.password" autocomplete />
    </a-form-model-item>
    <a-form-model-item :wrapper-col="{ span: 14 }">
      <a-button
        :loading="connectBtn"
        type="primary"
        style="width:88px;height:30px;margin-left:150px"
        @click="handleConnect"
      >
        连接
      </a-button>
    </a-form-model-item>
    <a-form-model-item class="form-not-required" label="默认连接库" prop="databaseName" v-if="connectStatus">
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
import { mapState } from 'vuex'
import { validateIP } from '../util'
export default {
  name: 'model-mysql',
  data() {
    return {
      labelCol: {
        xs: { span: 4 },
        sm: { span: 3 },
        md: { span: 3 },
        lg: { span: 3 }
      },
      wrapperCol: { span: 14 },
      form: {
        // 连接信息表单
        name: '', // 数据库名
        ip: '', // 服务器ip
        port: '', // 端口号
        user: '', // 用户名
        password: '', // 密码
        // dbid: '', // 默认数据库id
        databaseName: '' // 默认数据库名称
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
        user: [
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
        ]
        // dbid: [
        //   {
        //     required: true
        //   }
        // ]
      },
      connectBtn: false,
      connectStatus: false, // 是否连接
      saveBtn: false,
      databaseList: []
    }
  },
  computed: {
    ...mapState({
      modelInfo: state => state.dataAccess.modelInfo,
      modelId: state => state.dataAccess.modelId,
      modelName: state => state.dataAccess.modelName,
      tableList: state => state.dataAccess.menuList,
      modelType: state => state.dataAccess.modelType, // 数据类型
      modelSelectType: state => state.dataAccess.modelSelectType,
      tabChangeAble: state => state.dataAccess.firstFinished // 是否完成第一部分
    })
  },
  created() {
    this.$EventBus.$on('setFormData', this.handleSetFormData)
    this.$EventBus.$on('resetForm', this.handleResetForm)
  },
  beforeDestroy() {
    this.$EventBus.$off('resetForm', this.handleResetForm)
    this.$EventBus.$off('setFormData', this.handleSetFormData)
  },
  methods: {
    handleSetFormData() {
      this.handleResetForm()
      this.form = Object.assign(this.form, this.modelInfo, { name: this.modelName })
    },
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
    /**
     * 设置表单名称
     */
    handleSetTableName() {
      this.$emit('on-set-table-name', this.form.name)
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
      this.$store.dispatch('dataAccess/setModelInfo', this.form)
    },
    /**
     * 重置表单
     */
    handleResetForm() {
      this.$refs['dbForm'] && this.$refs.dbForm.resetFields()
      this.connectStatus = false
    },
    /**
     * 连接数据库
     */
    handleConnect() {
      this.$refs.dbForm.validate(async valid => {
        if (valid) {
          this.connectBtn = true
          const result = await this.$server.dataAccess.actionConnect({
            name: this.modelName,
            type: 1,
            property: {
              ip: this.form.ip,
              port: this.form.port,
              password: this.form.password,
              user: this.form.user,
              databaseName: this.form.databaseName || 'null'
            }
          }).finally(() => {
            this.connectBtn = false
          })

          if (result.code === 200) {
            this.databaseList = [].concat(result.rows)
            const item = this.databaseList.find(item => item.name === this.$store.state.dataAccess.modelInfo.databaseName)
            if (item) {
              // this.form.dbid = item.id
              this.form.databaseName = item.name
            } else {
              this.form.databaseName = this.databaseList[0].name
              // this.form.dbid = this.databaseList[0].id
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
     * 保存数据表
     */
    handleSaveForm() {
      this.$refs.dbForm.validate(async valid => {
        if (valid) {
          // const datadbitem = this.databaseList
          //   .filter(item => item.id === this.form.dbid)
          //   .pop()
          // this.form = Object.assign(this.form, {
          //   databaseName: datadbitem.name
          // })

          this.saveBtn = true
          const params = {
            id: this.$store.state.dataAccess.modelId,
            name: this.$store.state.dataAccess.modelName,
            parentId: this.$store.state.dataAccess.parentId,
            property: {
              user: this.form.user,
              ip: this.form.ip,
              port: this.form.port,
              password: this.form.password,
              databaseName: this.form.databaseName
            },
            type: 1
          }
          const result = await this.$server.dataAccess.saveTableInfo('datasource/save', params)
            .finally(() => {
              this.saveBtn = false
            })

          if (result.code === 200) {
            this.$message.success('保存成功，可抽取库表')
            this.$store.dispatch('dataAccess/getMenuList')
            this.$store.dispatch('dataAccess/setFirstFinished', true)
            this.$store.dispatch('dataAccess/setModelInfo', this.form)
            this.$store.dispatch('dataAccess/setModelName', this.form.name)
            this.$store.dispatch('dataAccess/setModelId', result.data)
            this.$store.dispatch('dataAccess/setParentId', 0)
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

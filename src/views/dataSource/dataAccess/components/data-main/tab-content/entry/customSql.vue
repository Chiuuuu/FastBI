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
    <a-form-model-item label="数据库类型" prop="type">
      <a-select v-model="form.type" @change="handleChangeDatabaseType" :disabled="modelId">
        <a-select-option :value="1">Mysql</a-select-option>
        <a-select-option :value="2">Oracle</a-select-option>
        <a-select-option :value="5">Hive</a-select-option>
      </a-select>
    </a-form-model-item>
    <!-- 连接信息 -->
    <MysqlForm v-if="form.type === 1" :form="form" :rules="rules" @handleSetTableName="handleSetTableName" />
    <OracleForm v-if="form.type === 2" :form="form" :rules="rules" @handleSetTableName="handleSetTableName" />
    <HiveForm v-if="form.type === 5" :form="form" :rules="rules" @handleSetTableName="handleSetTableName" />
    <a-form-model-item label="自定义表名" prop="tableName">
      <a-input v-model="form.tableName"></a-input>
    </a-form-model-item>
    <a-form-model-item label="自定义SQL语句" prop="sql">
      <a-textarea v-model="form.sql" :disabled="modelId"></a-textarea>
    </a-form-model-item>
  </a-form-model>
  <a-button
    type="primary"
    class="btn_sub"
    @click="handleSaveForm"
    :disabled="!connectStatus"
    :loading="saveBtn"
    v-if="hasPermission"
    >
    保存
    </a-button>
    <a-button
      type="primary"
      style="float:right;margin-right: 20px"
      @click="handleConnect"
      :loading="connectBtn"
      v-if="hasPermission"
    >
      测试连接
    </a-button>
</div>
</template>
<script>
import Mysql from './mysql'
import MysqlForm from './databaseForm/mysqlForm.vue'
import OracleForm from './databaseForm/oracleForm.vue'
import HiveForm from './databaseForm/hiveForm.vue'
import formValidateMixin from './databaseForm/formValidateMixins'
export default {
  name: 'model-customSql',
  extends: Mysql,
  components: {
    MysqlForm,
    OracleForm,
    HiveForm
  },
  mixins: [formValidateMixin.mysql],
  data() {
    const { form, rules } = formValidateMixin.mysql.mixin.data()
    return {
      labelCol: {
        xs: { span: 4 },
        sm: { span: 3 },
        md: { span: 3 },
        lg: { span: 3 }
      },
      form: {
        ...form,
        type: 1,
        tableName: '',
        sql: ''
      },
      rules: {
        ...rules,
        type: { required: true, message: '请选择数据库类型' },
        tableName: { required: true, message: '请填写自定义表名' },
        sql: { required: true, message: '请填写自定义SQL语句' }
      },
      wrapperCol: { span: 14 },
      connectPassword: '',
      connectBtn: false,
      connectStatus: false, // 是否连接
      saveBtn: false,
      databaseList: []
    }
  },
  methods: {
    // 数据库类型的枚举值转换
    enumType(type) {
      switch (type) {
        case 1:
          return 'mysql'
        case 2:
          return 'oracle'
        case 5:
          return 'hive'
      }
    },
    // 切换了数据库类型
    handleChangeDatabaseType(type) {
      const target = formValidateMixin[this.enumType(type)]
      if (target) {
        const { form, rules } = target.mixin.data()
        this.form = {
          ...form,
          type,
          tableName: '',
          sql: ''
        }
        this.rules = {
          ...rules,
          type: { required: true, message: '请选择数据库类型' },
          tableName: { required: true, message: '请填写自定义表名' },
          sql: { required: true, message: '请填写自定义SQL语句' }
        }
      }
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
        if (prop === 'password') {
          if (this.connectPassword !== '' && this.connectPassword !== this.form[prop]) {
            this.connectStatus = true
          } else if (this.modelId !== 0) {
            setFirstFinished = true
          }
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
      this.connectPassword = ''
      this.$refs['dbForm'] && this.$refs.dbForm.resetFields()
      this.form = this.$options.data().form
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
            this.connectPassword = this.form.password
            this.databaseList = [].concat(result.rows)
            const item = this.databaseList.find(item => item.name === this.$store.state.dataAccess.modelInfo.databaseName)
            if (item) {
              // this.form.dbid = item.id
              this.form.databaseName = item.name
            } else {
              this.form.databaseName = this.databaseList[0] ? this.databaseList[0].name : ''
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

          // 保存前先校验密码是否正确
          if (this.connectPassword !== this.form.password) {

          }

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
            this.$store.dispatch('dataAccess/setDatabaseName', this.form.databaseName)
            this.$store.dispatch('dataAccess/setModelId', result.data.id)
                this.$store.commit('common/SET_MENUSELECTID', result.data.id)
            this.$store.commit('common/SET_PRIVILEGES', result.data.privileges)
            // this.$store.dispatch('dataAccess/setParentId', 0)
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

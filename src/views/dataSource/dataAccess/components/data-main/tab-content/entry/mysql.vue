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
    <!-- 连接信息 -->
    <MysqlForm :form="form" :rules="rules" @handleSetTableName="handleSetTableName" />
    <a-form-model-item :wrapper-col="{ span: 14 }">
      <a-button
        :loading="connectBtn"
        type="primary"
        style="width:88px;height:30px;margin-left:150px"
        @click="handleConnect"
        v-if="hasPermission"
      >
        连接
      </a-button>
    </a-form-model-item>
    <a-form-model-item class="form-not-required" label="默认连接库" prop="databaseName" v-if="connectStatus">
      <a-select
        v-model="form.databaseName"
        :default-value="form.databaseName || databaseList[0] ? databaseList[0].name : ''"
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
    v-if="hasPermission"
    >
    保存
    </a-button>
</div>
</template>
<script>
import { mapState } from 'vuex'
import { hasPermission } from '@/utils/permission'
import MysqlForm from './databaseForm/mysqlForm.vue'
import formValidateMixin from './databaseForm/formValidateMixins'
export default {
  name: 'model-mysql',
  components: {
    MysqlForm
  },
  mixins: [formValidateMixin.mysql.mixin],
  inject: ['accessInstance'],
  data() {
    return {
      labelCol: {
        xs: { span: 4 },
        sm: { span: 3 },
        md: { span: 3 },
        lg: { span: 3 }
      },
      wrapperCol: { span: 14 },
      connectPassword: '',
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
      parentId: state => state.dataAccess.parentId,
      modelName: state => state.dataAccess.modelName,
      tableList: state => state.dataAccess.menuList,
      modelType: state => state.dataAccess.modelType, // 数据类型
      modelSelectType: state => state.dataAccess.modelSelectType,
      privileges: state => state.common.privileges,
      tabChangeAble: state => state.dataAccess.firstFinished // 是否完成第一部分
    }),
    hasPermission() {
      return hasPermission(this.privileges, this.$PERMISSION_CODE.OPERATOR.edit)
    }
  },
  watch: {
    modelName(newValue, oldValue) {
      this.form.name = newValue
    }
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
    validateSavePassword(rule, value, callback) {
      if (this.connectPassword !== '' && this.connectPassword !== value) {
        callback(new Error('请输入正确地密码'))
      } else {
        callback()
      }
    },
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
      this.form.databaseName = obj ? obj.name : ''

      const formInfo = Object.assign({}, this.form)
      this.$store.dispatch('dataAccess/setModelInfo', formInfo)
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
            type: this.sourceType,
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
            type: this.sourceType
          }
          const result = await this.$server.dataAccess.saveTableInfo('datasource/save', params)
            .finally(() => {
              this.saveBtn = false
            })

          if (result.code === 200) {
            this.$message.success('保存成功，可抽取库表')
            this.$store.dispatch('dataAccess/getMenuList', this.accessInstance.$refs.menu)
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

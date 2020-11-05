<template>
  <a-modal
    title="添加自定义SQL视图"
    :visible="isShow"
    destroyOnClose
    :confirmLoading="loading"
    :ok-button-props="{ props: { disabled: okProps } }"
    @ok="handleSave"
    @cancel="handleClose"
  >
    <a-spin :spinning="spinning">
      <a-form-model
        ref="form"
        :model="form"
        :rules="rules"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 20 }"
      >
        <a-form-model-item label="视图名称" prop="name">
          <a-input placeholder="请输入视图名称" v-model="form.name"></a-input>
        </a-form-model-item>
        <a-form-model-item label="SQL语句" prop="cloneSql">
          <a-textarea style="height:200px;resize:unset" v-model="cloneSql" @blur.native.prevent.stop="handleValidateSql" />
        </a-form-model-item>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
import assign from 'lodash/assign'
export default {
  name: 'sqlSetting',
  props: {
    isShow: Boolean,
    status: {
      type: String,
      default: 'new'
    },
    getFetchParam: Function
  },
  data() {
    return {
      loading: false,
      okProps: false,
      spinning: false,
      params: {},
      isEqual: true, // 判断上一次跟当前是否相同
      form: {
        name: '',
        sql: ''
      },
      rules: {
        name: [
          {
            required: true,
            message: '请输入视图名称'
          },
          {
            pattern: new RegExp('^[a-zA-Z]*$'),
            message: '只能填写字母'
          },
          {
            max: 20,
            message: '不得超过20个字符'
          }
        ],
        cloneSql: [
          {
            required: true,
            validator: this.validateCloneSql,
            trigger: ['change', 'blur']
          }
        ]
      },
      result: ''
    }
  },
  computed: {
    cloneSql: {
      get() {
        return this.form.sql
      },
      set(val, a) {
        this.isEqual = val === this.form.sql
        this.form.sql = val
      }
    }
  },
  watch: {
    isShow: {
      immediate: true,
      handler(newValue) {
        if (newValue) {
          this.form = assign(this.form, this.$options.data().form)
          this.okProps = false
        }
      }
    }
  },
  methods: {
    validateCloneSql(rule, value, callback) {
      if (this.form.sql === '') {
        /*eslint-disable*/
        callback('请输入SQL语句')
      }
      callback()
    },
    async handleValidateSql() {
      if (!this.isEqual && this.form.sql) {
        this.$emit('get-fetch-param')
        const params = this.doWithParams()
        const result = await this.$server.dataModel.actionValidateCustomSql(params).finally(() => {
          this.isEqual = true
        })
        if (result.code !== 200) {
          this.$message.error(result.msg)
          this.okProps = true
        } else {
          this.okProps = false
        }
      }
    },
    handleClose() {
      this.$emit('close')
    },
    pushFetchParam(param) {
      this.params = {}
      this.params = assign(this.params, param)
    },
    async handleGetDetail(item) {
      this.spinning = true
      this.result = await this.$server.dataModel.getCustomSqlDetail(item.id).finally(() => {
        this.spinning = false
      })
      if (this.result.code === 200) {
        this.form = assign(this.form, {
          sql: this.result.data.sql,
          name: this.result.data.name
        })
      } else {
        this.$message.error(this.result.msg)
      }
    },
    doWithParams() {
      const params = assign(this.form, this.params, {
        tableId: this.status === 'new' ? 0 : this.result.data.id
      })
      return params
    },
    async handleSave() {
      setTimeout(() => {
        if (this.okProps) return
        this.$emit('get-fetch-param')
        this.$refs.form.validate(async valid => {
          if (valid) {
            this.loading = true
            const params = this.doWithParams()
            const result = await this.$server.dataModel.saveCustomSql(params).finally(() => {
              this.loading = false
            })
            if (result.code === 200) {
              this.$emit('success', result.data)
            } else {
              this.isEqual = true
              this.$message.error(result.msg)
            }
          } else {
            return false
          }
        })
      }, 500)
    }
  }
}
</script>

<style>

</style>

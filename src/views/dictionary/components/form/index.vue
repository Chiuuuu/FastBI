<template>
  <a-modal :title="type === 'add' ? '新增代码' : '更新代码'" :visible="visible" @cancel="handleClose" @ok="handleOk">
    <a-form-model ref="form" :model="form" :rules="rules" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
      <a-form-model-item label="代码" prop="dictValue">
        <a-input
          placeholder="代码"
          v-model="form.dictValue"
        ></a-input>
      </a-form-model-item>
      <a-form-model-item label="代码名称" prop="dictName">
        <a-input
          placeholder="代码名称"
          v-model="form.dictName"
        ></a-input>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
export default {
  name: 'codeForm',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    menuId: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'add'
    },
    rowData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  watch: {
    visible(newValue) {
      if (newValue) {
        if (this.type === 'update') {
          for (const key in this.form) {
            this.form[key] = this.rowData[key]
          }
        }
      }
    }
  },
  data() {
    return {
      form: {
        dictValue: '',
        dictName: ''
      },
      rules: {
        dictValue: [
          { required: true, message: '请输入代码' },
          { pattern: /^\d{1,12}$/, message: '请输入12位数字以内的代码' }
        ],
        dictName: [
          { required: true, message: '请输入代码名称' },
          { max: 12, message: '请输入12个字以内的代码名称' }
        ]
      }
    }
  },
  methods: {
    handleClose() {
      this.$refs.form.resetFields()
      this.form = this.$options.data().form
      this.$nextTick(() => {
        this.$emit('update:visible', false)
        this.$emit('update:rowData', {})
      })
    },
    handleOk() {
      this.$refs.form.validate(async (ok, obj) => {
        if (ok) {
          if (this.type === 'add') {
            this.handleAdd()
          } else if (this.type === 'update') {
            this.handleUpdate()
          }
        }
      })
    },
    async handleAdd() {
      const res = await this.$server.dataDictionary.addDataDictionary({
        catalogId: this.menuId,
        dictName: this.form.dictName,
        dictValue: this.form.dictValue
      })
      if (res.code === 200) {
        this.$message.success('新增成功')
        this.$emit('refresh')
        this.handleClose()
      } else {
        this.$message.error(res.msg || '请求错误')
      }
    },
    async handleUpdate() {
      const res = await this.$server.dataDictionary.putDataDictionary({
        id: this.rowData.id,
        dictName: this.form.dictName,
        dictValue: this.form.dictValue
      })
      if (res.code === 200) {
        this.$message.success('修改成功')
        this.$emit('refresh')
        this.handleClose()
      } else {
        this.$message.error(res.msg || '请求错误')
      }
    }
  }
}
</script>

<style scoped>

</style>

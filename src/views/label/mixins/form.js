export default {
  data() {
    return {
      loading: false,
      labelCol: {
        xs: { span: 4 },
        sm: { span: 3 },
        md: { span: 3 },
        lg: { span: 3 }
      },
      wrapperCol: { span: 14 }
    }
  },
  created () {
    if (this.rowData.id) {
      this.handleSetForm()
    }
  },
  methods: {
    handleClose() {
      this.handleResetForm()
      this.$emit('close')
    },
    handleResetForm() {
      this.form = this.$options.data().form
      this.$refs.form && this.$refs.form.resetFields()
    },
    // 给表单赋值
    handleSetForm() {
      for (const key in this.form) {
        this.form[key] = this.rowData[key] || ''
      }
    }
  }
}

<template>
  <a-form-model
    ref="form"
    :model="form"
    :rules="rules"
  >
    <a-row>
        <a-col :span="20">
            <a-form-model-item prop="name" class="item-name">
                <a-input :disabled="isEdit" v-model="form.name"/>
            </a-form-model-item>
        </a-col>
        <a-col :span="4" class="text-center">
            <a-button type="link" v-show="isEdit" @click="handleEdit" :disabled="isDisabled">编辑</a-button>
            <a-popconfirm
                title="是否要删除？"
                ok-text="确定"
                cancel-text="取消"
                @confirm="handleDelete"
            >
                <a-button v-show="isEdit" type="link" style="margin-left:5px;">删除</a-button>
            </a-popconfirm>
            <a-button type="link" v-show="!isEdit" @click="handleSave">保存</a-button>
            <a-button type="link" v-show="!isEdit" @click="handleCancel" style="margin-left:5px;">取消</a-button>
        </a-col>
    </a-row>
  </a-form-model>
</template>
<script>
export default {
  name: 'ModalForm',
  props: {
      index: {
          type: Number,
          default: 0
      },
      activeIndex: {
          type: Number,
          default: -1
      },
      status: {
          type: String,
          default: 'show'
      },
      data: {
          type: Object,
          default: () => {
            name: ''
          }
      }
  },
  data() {
    return {
      form: Object.assign({}, this.data),
      rules: {
        name: { required: true, message: '请填写名称' }
      }
    }
  },
  computed: {
      isEdit() {
          return this.activeIndex !== this.index
      },
      isDisabled() {
          if (this.activeIndex === -1) {
              return false
          } else {
              return this.activeIndex !== this.index
          }
      }
  },
  methods: {
      handleEdit() {
        this.$emit('edit', this.index)
      },
      handleSave() {
          this.$refs.form.validate(valid => {
            if (valid) {
                this.$emit('save', this.form, this.index)
            } else {
                return false
            }
          })
      },
      handleDelete() {
          this.$emit('delete', this.data, this.index)
      },
      handleCancel() {
          this.$emit('cancel', this.data)
      }
  }
}
</script>
<style lang="less" scoped>
@deep: ~">>>";
@{deep} .ant-btn-link {
    color: #617bff;
    padding: 0;
}
@{deep} .ant-btn-link[disabled] {
    color: rgba(0, 0, 0, 0.25);
}
@{deep} .ant-form-inline .ant-form-item-with-help {
  margin-bottom: 0;
}
@{deep} .ant-form-item-control {
    line-height: inherit;
}
</style>

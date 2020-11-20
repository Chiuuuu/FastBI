<template>
  <a-popover v-model="visible" trigger="click">
    <div slot="content" class="popover-delete-button">
        <span>{{title}}</span>
        <a-button type="link" @click="hide">取消</a-button>
        <a-button type="link" @click="handleSubmit">确定</a-button>
    </div>
    <a>删除</a>
  </a-popover>
</template>
<script>
export default {
  name: 'deleteButton',
  props: {
      title: {
          type: String,
          default: '是否确定删除?'
      }
  },
  data() {
    return {
      visible: false
    }
  },
  methods: {
    hide() {
      this.visible = false
    },
    handleSubmit() {
        this.hide()
        this.$emit('delete')
    }
  }
}
</script>
<style lang="less" scoped>
@deep: ~'>>>';
.popover-delete-button {
    @{deep} .ant-btn-link {
        color: #617bff;
        margin-left: 5px;
    }
    @{deep} .ant-btn {
        padding: 0;
    }
}
</style>

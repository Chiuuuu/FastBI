<template>
  <a-modal
    title="部门管理"
    :maskClosable="false"
    :bodyStyle="bodyStyle"
    :visible="show"
    :footer="null"
    destroyOnClose
    @cancel="handleClose">
    <a-button class="add-button" type="primary" @click="handleAddItem">添加部门</a-button>
    <div ref="scroll" class="form-list scrollbar">
      <div v-for="(depart, index) in list" :key="depart.name">
        <ModalForm
          :index="index"
          :data="depart"
          :activeIndex="activeIndex"
          @edit="handleModalFormEdit"
          @save="handleModalFormSave"
          @cancel="handleModalFormCancel"
          @delete="handleModalFormDelete"></ModalForm>
      </div>
    </div>
  </a-modal>
</template>

<script>
import modalMixin from './modalMixin'

export default {
  name: 'personnelDepartModal',
  mixins: [modalMixin],
  data() {
    return {
      list: []
    }
  },
  methods: {
    async handleGetData() {
      const res = await this.$server.corporateDomain.getDeptList()
      if (res.code === 200) {
        this.list = res.data
      } else {
        this.list = []
        this.$message.error('获取部门列表失败')
      }
    },
    /** 保存 */
    async handleModalFormSave(formData, index) {
      const res = await this.$server.corporateDomain.addDept(formData.name)
      if (res.code === 200) {
        this.$message.success('保存成功')
        this.list.splice(index, 1, {
          ...formData
        })
        this.activeIndex = -1
      } else {
        this.$message.error(res.msg)
      }
    },
    /** 删除 */
    handleModalFormDelete(data, index) {
      this.list.splice(index, 1)
      this.activeIndex = -1
    },
    /** 取消编辑 */
    handleModalFormCancel(data) {
      this.activeIndex = -1
      if (!data.id) {
        this.list.shift()
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import "./modal-common.less";
.form-list {
  height: calc(100% - 50px);
}
</style>

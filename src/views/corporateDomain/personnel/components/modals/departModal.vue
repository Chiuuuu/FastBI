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
  props: {
    deptList: Array
  },
  data() {
    return {
      list: []
    }
  },
  watch: {
    deptList(newValue, oldValue) {
      this.list = [].concat(newValue)
    }
  },
  methods: {
    /** 保存 */
    handleModalFormSave(formData, index) {
      if (formData.id) {
        this.handleModalFormUpdate(formData, index)
      } else {
        this.handleModalFormAdd(formData, index)
      }
    },
    handleModalFormEdit(index) {
      this.activeIndex = index
    },
    /** 新增 */
    async handleModalFormAdd(formData, index) {
      const res = await this.$server.corporateDomain.addDept(formData.name)
      if (res.code === 200) {
        this.$message.success('保存成功')
        this.$parent.handleGetDepartList()
        this.activeIndex = -1
      } else {
        this.$message.error(res.msg)
      }
    },
    /** 编辑 */
    async handleModalFormUpdate(formData, index) {
      const res = await this.$server.corporateDomain.updateDept({
        name: formData.name,
        id: formData.id
      })
      if (res.code === 200) {
        this.$message.success('保存成功')
        this.$parent.handleGetDepartList()
        this.activeIndex = -1
      } else {
        this.$message.error(res.msg)
      }
    },
    /** 删除 */
    async handleModalFormDelete(formData, index) {
      const res = await this.$server.corporateDomain.deleDept(formData.id)
      if (res.code === 200) {
        this.$message.success('删除成功')
        this.deptList.splice(index, 1)
        this.activeIndex = -1
      } else {
        this.$message.error(res.msg)
      }
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
  height: calc(100% - 55px);
}
</style>

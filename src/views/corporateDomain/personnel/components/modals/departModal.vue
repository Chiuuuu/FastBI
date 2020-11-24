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
      <div v-for="(depart, index) in list" :key="depart.id">
        <ModalForm
          :index="index"
          :data="depart"
          :activeIndex="activeIndex"
          @edit="handleModalFormEdit"
          @save="handleModalFormSave"
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
      list: [
        { id: '1', name: '研发部' },
        { id: '2', name: '销售部' },
        { id: '3', name: '人事部' },
        { id: '4', name: '小卖部' }
      ]
    }
  },
  methods: {
    /** 保存 */
    handleModalFormSave(formData, index) {
      this.list.splice(index, 1 , {
        ...formData
      })
      this.activeIndex = -1
    },
    /** 删除 */
    handleModalFormDelete(data, index) {
      this.list.splice(index, 1)
      this.activeIndex = -1
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

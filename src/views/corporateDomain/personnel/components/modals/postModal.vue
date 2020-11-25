<template>
  <a-modal
    title="岗位管理"
    :bodyStyle="bodyStyle"
    :maskClosable="false"
    :visible="show"
    :footer="null"
    destroyOnClose
    @cancel="handleClose">
    <a-form-model ref="form" :model="form" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }" labelAlign="left">
      <a-form-model-item label="部门" prop="depart">
        <a-select v-model="form.depart">
          <a-select-option :value="1">部门1</a-select-option>
          <a-select-option :value="2">部门2</a-select-option>
          <a-select-option :value="3">部门3</a-select-option>
        </a-select>
      </a-form-model-item>
    </a-form-model>
    <a-button class="add-button" type="primary" @click="handleAddItem">添加岗位</a-button>
    <div ref="scroll" class="form-list scrollbar">
      <div v-for="(post, index) in list" :key="post.name">
        <ModalForm
          :index="index"
          :data="post"
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
  name: 'personnelPostModal',
  mixins: [modalMixin],
  data() {
    return {
      form: {
        depart: 1
      },
      list: [
        { id: '1', name: 'java' },
        { id: '2', name: '前端' },
        { id: '3', name: '测试' },
        { id: '4', name: '产品' }
      ]
    }
  },
  methods: {
    /** 保存 */
    handleModalFormSave(formData, index) {
      this.list.splice(index, 1, {
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
</style>

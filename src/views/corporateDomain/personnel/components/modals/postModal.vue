<template>
  <a-modal
    title="岗位管理"
    :bodyStyle="bodyStyle"
    :maskClosable="false"
    :visible="show"
    :footer="null"
    destroyOnClose
    @cancel="handleClose">
    <template v-if="deptList.length > 0">
      <a-form-model ref="form" :model="form" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }" labelAlign="left">
        <a-form-model-item label="部门" prop="depart">
          <a-select v-model="form.depart" @change="handleChangePost">
            <a-select-option :value="item.id" v-for="item in deptList" :key="item.id">{{ item.name }}</a-select-option>
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
            @cancel="handleModalFormCancel"
            @delete="handleModalFormDelete"></ModalForm>
        </div>
      </div>
    </template>
    <a-empty description="请先添加岗位"></a-empty>
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
        depart: ''
      },
      deptList: [],
      list: [
        { id: '1', name: 'java' },
        { id: '2', name: '前端' },
        { id: '3', name: '测试' },
        { id: '4', name: '产品' }
      ]
    }
  },
  methods: {
    async handleGetData() {
      const res = await this.$server.corporateDomain.getDeptList()
      if (res.code === 200) {
        this.deptList = res.data
        if (res.data.length > 0) {
          this.form.depart = res.data[0].id
          this.handleChangePost(res.data[0].id)
        }
      } else {
        this.deptList = []
        this.$message.error('获取部门列表失败')
      }
    },
    async handleChangePost(id) {
      const list = await this.$server.corporateDomain.getPostList(id)
      if (list.code === 200) {
        this.list = list.data
      } else {
        this.list = []
        this.$message.error('获取岗位列表失败')
      }
    },
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
</style>

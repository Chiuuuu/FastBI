<template>
  <a-modal
    title="部门管理"
    :bodyStyle="bodyStyle"
    :visible="show"
    :footer="null"
    destroyOnClose
    @ok="handleOk"
    @cancel="handleClose">
    <a-button class="add-button" type="primary" @click="addDepart" :disabled="showNewDepart">添加部门</a-button>
    <div ref="scroll" class="form-list scrollbar">
      <div class="form-list-item" v-for="(depart, index) in departList" :key="depart.id">
        <template>
          <a-form-model ref="editForm" class="item-name" v-if="index === editIndex" :model="depart" :rules="rules">
            <a-form-model-item prop="name" v-if="index === editIndex">
              <a-input v-model="editName" />
            </a-form-model-item>
          </a-form-model>
          <div class="item-name show-name" v-else>{{ depart.name }}</div>
        </template>
        <a class="handler" v-if="index !== editIndex" @click="editDepart(depart, index)">编辑</a>
        <a class="handler" v-else @click="saveDepart(depart, index)">保存</a>
        <a-popconfirm title="确定删除该部门吗？" ok-text="确定" cancel-text="取消" @confirm="deleteDepart(depart, index)">
          <a class="handler">删除</a>
        </a-popconfirm>
      </div>
    </div>
  </a-modal>
</template>

<script>
export default {
  name: 'personnelDepartModal',
  props: {
    modalData: Object,
    show: Boolean
  },
  data() {
    return {
      bodyStyle: { 'height': 'calc(100vh - 240px)' },
      showNewDepart: false,
      editIndex: '',
      editName: '',
      departList: [
        { id: '1', name: '研发部' },
        { id: '2', name: '销售部' },
        { id: '3', name: '人事部' },
        { id: '4', name: '小卖部' }
      ],
      newDepart: {
        name: ''
      },
      rules: {
        name: { required: true, message: '请填写部门名称' }
      }
    }
  },
  methods: {
    addDepart() {
      this.showNewDepart = true
      this.departList.unshift({
        id: '',
        name: ''
      })
      this.editIndex = 0
      this.$refs.scroll.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    },
    deleteDepart(depart, index) {
      
    },
    editDepart(depart, index) {
      this.editIndex = index
      this.editName = this.departList[index].name
    },
    saveDepart(depart, index) {
      this.$refs.editForm[0].validate((ok, obj) => {
        if (ok) {
          // this.editIndex = ''
        }
      })
    },
    clearNewDepart() {
      this.showNewDepart = false
      this.newDepart.name = ''
    },
    handleClose() {
      this.$emit('close')
    },
    handleOk() {
      this.clearModal()
      this.clearNewDepart()
      this.handleClose()
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

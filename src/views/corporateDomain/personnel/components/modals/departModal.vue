<template>
  <a-modal title="部门管理" :visible="show" @ok="handleOk" @cancel="handleClose">
    <a-button class="add-button" type="primary" @click="addDepart" :disabled="showNewDepart">添加部门</a-button>
    <a-form-model v-for="(depart, index) in departList" :key="depart.id" :model="depart" :rules="rules">
      <a-form-model-item prop="name">
        <a-input v-model="depart.name">
          <a-popconfirm slot="suffix" title="确定删除该部门吗？" ok-text="确定" cancel-text="取消" @confirm="deleteDepart(depart, index)">
            <a-icon type="delete" style="cursor: pointer;"></a-icon>
          </a-popconfirm>
        </a-input>
      </a-form-model-item>
    </a-form-model>
    <a-form-model v-if="showNewDepart" :model="newDepart" :rules="rules">
      <a-form-model-item prop="name">
        <a-input v-model="newDepart.name">
          <a-icon type="delete" slot="suffix" style="cursor: pointer;"></a-icon>
        </a-input>
      </a-form-model-item>
    </a-form-model>
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
      showNewDepart: false,
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
    },
    deleteDepart(depart, index) {
      
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

<style>
.add-button {
  display: block;
  margin-bottom: 20px;
}
</style>

<template>
<div class="flex-col">
  <div class="role-list-controller">
    <div class="searchbar">
      <a-form-model layout="inline" :model="personSearch">
        <a-form-model-item label="用户名" prop="username">
          <a-input v-model="personSearch.username" style="width: 150px"></a-input>
        </a-form-model-item>
        <a-form-model-item label="姓名" prop="name">
          <a-input v-model="personSearch.name" style="width: 150px"></a-input>
        </a-form-model-item>
        <a-form-model-item label="部门" prop="depart">
          <a-input v-model="personSearch.depart" style="width: 150px"></a-input>
        </a-form-model-item>
        <a-form-model-item label="岗位" prop="post">
          <a-input v-model="personSearch.psot" style="width: 150px"></a-input>
        </a-form-model-item>
        <a-button class="main-button" type="primary" @click="getPersonList">查询</a-button>
        <a-button class="main-button" type="primary" @click="resetForm()">重置</a-button>
      </a-form-model>
    </div>
    <a-button class="main-button" type="primary" @click="showModal('add')">添加</a-button>
  </div>
  <a-table
    class="role-list-table scrollbar"
    row-key="id"
    :columns="personColumn"
    :data-source="personData"
    :loading="loading">
    <!-- 部门 -->
    <span slot="depart">部门 <a-icon class="edit-icon" type="setting" @click="handleSetDepart" /></span>
    <!-- 岗位 -->
    <span slot="post">岗位 <a-icon class="edit-icon" type="setting" @click="handleSetPost" /></span>
    <!-- 所属项目 -->
    <template #project="text">{{ text.toString() }}</template>
    <!-- 是否启用 -->
    <template #enable="text, record"><a-switch v-model="text" @change="handleSwitch($event, record)" /></template>
    <!-- 操作 -->
    <template #config="text, record">
      <a class="handler-margin" @click="handleEdit(record)" style="margin-right: 20px">编辑</a>
      <a-popconfirm title="确定要删除该项目吗？" ok-text="确定" cancel-text="取消" @confirm="handleDelete(record.id)">
        <a href="#">删除</a>
      </a-popconfirm>
    </template>
  </a-table>
    <user-modal :show="visible1" :modal-data="modalData" :modal-type="modalType" @close="visible1 = false" />
  <depart-modal :show="visible2" :modal-data="modalData" @close="visible2 = false" />
  <post-modal :show="visible3" :modal-data="modalData" @close="visible3 = false" />
</div>
</template>

<script>
import UserModal from '../modals/userModal'
import DepartModal from '../modals/departModal'
import PostModal from '../modals/postModal'

const personData = []
for (let i = 0; i < 30; i++) {
  personData.push({
    id: i + 1,
    username: 'admin' + i,
    name: '嘿嘿嘿',
    phone: '12345678910',
    depart: '小卖部',
    post: '收银员',
    project: ['大茶饭', '乡村振兴'],
    enable: false,
    gmtCreate: '2020-11-19 15:09:00'
  })
}

const personColumn = [
  {
    title: '用户名',
    width: 100,
    dataIndex: 'username'
  },
  {
    title: '姓名',
    width: 100,
    dataIndex: 'name'
  },
  {
    title: '电话',
    width: 120,
    dataIndex: 'phone'
  },
  { // 部门
    slots: { title: 'depart' },
    dataIndex: 'depart',
    width: 200,
    ellipsis: true,
    key: 'depart'
  },
  { // 岗位
    slots: { title: 'post' },
    dataIndex: 'post',
    width: 200,
    ellipsis: true,
    key: 'post'
  },
  {
    title: '所属项目',
    dataIndex: 'project',
    scopedSlots: { customRender: 'project' },
    width: 200,
    ellipsis: true
  },
  {
    title: '是否启用',
    dataIndex: 'enable',
    width: 100,
    scopedSlots: { customRender: 'enable' }
  },
  {
    title: '创建时间',
    dataIndex: 'gmtCreate',
    width: 200,
    ellipsis: true
  },
  {
    title: '操作',
    dataIndex: 'config',
    scopedSlots: { customRender: 'config' }
  }
]

export default {
  name: 'personManage',
  components: {
    UserModal,
    DepartModal,
    PostModal
  },
  data() {
    return {
      loading: false,
      modalData: {},
      modalType: '',
      visible1: false,
      visible2: false,
      visible3: false,
      personSearch: {
        username: '',
        name: '',
        depart: '',
        post: ''
      },
      personData: [],
      personColumn
    }
  },
  created () {
    this.getPersonList()
  },
  methods: {
    resetForm(tab) {
      this.personSearch = this.$options.data().personSearch
    },
    handleSwitch() {

    },
    handleSetDepart() {
      const data = {} // 取当前项目下的部门岗位
      this.modalData = data
      this.visible2 = true
    },
    handleSetPost() {
      const data = {} // 取当前项目下的部门岗位
      this.modalData = data
      this.visible3 = true
    },
    async getPersonList() {
      this.loading = true
      setTimeout(() => {
        this.personData = personData
        this.loading = false
      }, 400)
    },
    showModal(type) {
      this.visible1 = true
      this.modalType = type || ''
    },
    handleDelete(id) {
      console.log('删除id: ', id)
    },
    handleEdit(data) {
      this.modalData = data
      this.showModal('edit')
    }
  }
}
</script>

<style lang="less" scoped>
@import "../../../main.less";
</style>

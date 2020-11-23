<template>
  <div class="main">
    <div class="right" style="padding-top:16px">
      <div class="role-list-controller">
        <div class="searchbar">
          <div class="item">
            <span>项目名称：</span>
            <a-input placeholder="请输入项目名称" v-model="userSearch.name" style="width: 200px"></a-input>
          </div>
          <div class="item">
            <span>管理员：</span>
            <a-input placeholder="请输入管理员姓名" v-model="userSearch.admins" style="width: 200px"></a-input>
          </div>
          <a-button class="main-button" type="primary" @click="getList">查询</a-button>
          <a-button class="main-button" type="primary" @click="resetForm(2)">重置</a-button>
        </div>
        <a-button class="main-button" type="primary" @click="showModal('add')">添加项目</a-button>
      </div>
      <a-table
        class="role-list-table scrollbar"
        row-key="id"
        :columns="userColumn"
        :data-source="userData"
        :loading="loading"
      >
        <template #admins="text">
          {{ text.toString() }}
        </template>
        <template #config="text, record">
          <a style="margin-right:20px" @click="handleCheck(record)">查看项目用户</a>
          <a style="margin-right:20px" @click="handleEdit(record)">编辑</a>
          <a-popconfirm title="确定要删除该项目吗？" ok-text="确定" cancel-text="取消" @confirm="handleDelete(record.id)">
            <a href="#">删除</a>
          </a-popconfirm>
        </template>
      </a-table>
    </div>
    <a-modal title="添加项目" v-model="visible" @ok="handleOk" @close="clearModal">
      <a-form-model :model="form" :rules="rules" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
        <a-form-model-item label="项目名称" prop="name">
          <a-input
            mode="multiple"
            v-model="form.name"
            style="width: 100%"
            placeholder="请输入项目名称"
          />
        </a-form-model-item>
        <a-form-model-item label="项目描述" prop="description">
          <a-input
            mode="multiple"
            v-model="form.description"
            style="width: 100%"
            placeholder="请输入项目描述"
          />
        </a-form-model-item>
        <a-form-model-item label="管理员" prop="admins">
          <a-select
            mode="multiple"
            v-model="form.admins"
            style="width: 100%"
            placeholder="请选择管理员"
          >
            <a-select-option v-for="i in 25" :key="(i + 9).toString(36) + i">
              {{ (i + 9).toString(36) + i }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex'

const userData = []
for (let i = 0; i < 30; i++) {
  userData.push({
    id: i + 1,
    name: '嘿嘿嘿',
    admins: ['打工人1', '打工人2'],
    userCnt: 10,
    screenCnt: 10,
    description: '描述11111111111111111111111111111111111111111111111111111111111111111111111',
    gmtCreate: '2020-11-20 14:06:00'
  })
}
const userColumn = [
  {
    title: '项目名称',
    dataIndex: 'name'
  },
  {
    title: '管理员',
    dataIndex: 'admins',
    scopedSlots: { customRender: 'admins' }
  },
  {
    title: '用户数',
    dataIndex: 'userCnt'
  },
  {
    title: '大屏数量',
    dataIndex: 'screenCnt'
  },
  {
    title: '项目描述',
    dataIndex: 'description',
    width: 200,
    ellipsis: true
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
    width: 220,
    scopedSlots: { customRender: 'config' }
  }
]

export default {
  name: 'projMain',
  components: {

  },
  data() {
    return {
      spinning: false,
      loading: false,
      visible: false,
      modalType: '', // 判断是编辑还是新增
      rowId: '', // 当前编辑的用户id
      detailInfo: {},
      form: {
        username: '',
        users: []
      },
      rules: {
        name: [
          { required: true, message: '请填写项目名' },
          {
            type: 'string',
            max: 20,
            min: 1,
            message: '长度为1~20'
          }
        ],
        description: [
          { required: true, message: '请填写描述' }
        ],
        admins: [
          { required: true, message: '请填写描述' }
        ]
      },
      userSearch: {
        name: '',
        admins: ''
      },
      userData: [],
      userColumn
    }
  },
  computed: {
    ...mapState({
      roleId: state => state.projectRoles.roleId,
      formInfo: state => state.projectRoles.roleInfo
    })
  },
  created() {
    this.getList()
  },
  methods: {
    showModal(type) {
      this.visible = true
      this.modalType = type
    },
    clearModal() {
      this.form = this.$options.data().form
    },
    resetForm() {
      this.userSearch = this.$options.data().userSearch
    },
    handleOk() {
      const params = this.form
      if (this.modalType === 'add') {
        // 新增保存
      } else if (this.modalType === 'edit') {
        // 编辑保存
        params.id = this.rowId
      }
      this.visible = false
      this.clearModal()
    },
    handleDelete({ id }) {
      this.$confirm({
        title: '确认提示',
        content: '您确定要删除该用户吗',
        onOk: () => {
          console.log('删除id: ', id)
        }
      })
    },
    handleEdit(data) {
      this.form = Object.assign({}, {
        name: data.name,
        description: data.description,
        admins: data.admins
      })
      this.rowId = data.id
      this.showModal('edit')
    },
    handleCheck(data) {

    },
    async getList() {
      this.loading = true
      setTimeout(() => {
        this.userData = userData
        this.loading = false
      }, 400)
    }
  }
}
</script>

<style lang="less" scoped>
@import "../../../main.less";
</style>

<template>
  <div class="flex-col">
    <div class="role-list-controller">
      <div class="searchbar">
        <a-form-model layout="inline" :model="userSearch">
          <a-form-model-item label="用户名" prop="username">
            <a-input v-model="userSearch.username" style="width: 150px"></a-input>
          </a-form-model-item>
          <a-form-model-item label="姓名" prop="name">
            <a-input v-model="userSearch.name" style="width: 150px"></a-input>
          </a-form-model-item>
          <a-button class="main-button" type="primary" @click="getUserList">查询</a-button>
          <a-button class="main-button" type="primary" @click="resetForm()">重置</a-button>
        </a-form-model>
      </div>
    </div>
    <a-table
      class="role-list-table scrollbar"
      ref="table"
      row-key="id"
      :columns="userColumn"
      :data-source="userData"
      :loading="loading"
      :scroll="{ x: 1260 }">
      <!-- 属性一 -->
      <div slot="col1">
        <span v-if="editColIndex !== 0">
          {{ propNameList[0] }} <a-icon class="edit-icon" type="form" @click="handleEditPropCol(0)" />
        </span>
        <div v-else>
          <a-input style="width:120px" v-model="editCol"></a-input>
          <a style="margin-right:5px" @click="handleSaveEditCol">保存</a>
          <a @click="handleCancelEditCol">取消</a>
        </div>
      </div>
      <template #prop1="text, record, index">
        <span v-if="index !== editRowIndex">{{ text }}</span>
        <a-input v-else v-model="editRow.prop1"></a-input>
      </template>
      <!-- 属性二 -->
      <div slot="col2">
        <span v-if="editColIndex !== 1">
          {{ propNameList[1] }} <a-icon class="edit-icon" type="form" @click="handleEditPropCol(1)" />
        </span>
        <div v-else>
          <a-input style="width:120px" v-model="editCol"></a-input>
          <a style="margin-right:5px" @click="handleSaveEditCol">保存</a>
          <a @click="handleCancelEditCol">取消</a>
        </div>
      </div>
      <template #prop2="text, record, index">
        <span v-if="index !== editRowIndex">{{ text }}</span>
        <a-input v-else v-model="editRow.prop2"></a-input>
      </template>
      <!-- 属性三 -->
      <div slot="col3">
        <span v-if="editColIndex !== 2">
          {{ propNameList[2] }} <a-icon class="edit-icon" type="form" @click="handleEditPropCol(2)" />
        </span>
        <div v-else>
          <a-input style="width:120px" v-model="editCol"></a-input>
          <a style="margin-right:5px" @click="handleSaveEditCol">保存</a>
          <a @click="handleCancelEditCol">取消</a>
        </div>
      </div>
      <template #prop3="text, record, index">
        <span v-if="index !== editRowIndex">{{ text }}</span>
        <a-input v-else v-model="editRow.prop3"></a-input>
      </template>
      <!-- 属性四 -->
      <div slot="col4">
        <span v-if="editColIndex !== 3">
          {{ propNameList[3] }} <a-icon class="edit-icon" type="form" @click="handleEditPropCol(3)" />
        </span>
        <div v-else>
          <a-input style="width:120px" v-model="editCol"></a-input>
          <a style="margin-right:5px" @click="handleSaveEditCol">保存</a>
          <a @click="handleCancelEditCol">取消</a>
        </div>
      </div>
      <template #prop4="text, record, index">
        <span v-if="index !== editRowIndex">{{ text }}</span>
        <a-input v-else v-model="editRow.prop4"></a-input>
      </template>
      <!-- 属性五 -->
      <div slot="col5">
        <span v-if="editColIndex !== 4">
          {{ propNameList[4] }} <a-icon class="edit-icon" type="form" @click="handleEditPropCol(4)" />
        </span>
        <div v-else>
          <a-input style="width:120px" v-model="editCol"></a-input>
          <a style="margin-right:5px" @click="handleSaveEditCol">保存</a>
          <a @click="handleCancelEditCol">取消</a>
        </div>
      </div>
      <template #prop5="text, record, index">
        <span v-if="index !== editRowIndex">{{ text }}</span>
        <a-input v-else v-model="editRow.prop5"></a-input>
      </template>
      <!-- 属性六 -->
      <div slot="col6">
        <span v-if="editColIndex !== 5">
          {{ propNameList[5] }} <a-icon class="edit-icon" type="form" @click="handleEditPropCol(5)" />
        </span>
        <div v-else>
          <a-input style="width:120px" v-model="editCol"></a-input>
          <a style="margin-right:5px" @click="handleSaveEditCol">保存</a>
          <a @click="handleCancelEditCol">取消</a>
        </div>
      </div>
      <template #prop6="text, record, index">
        <span v-if="index !== editRowIndex">{{ text }}</span>
        <a-input v-else v-model="editRow.prop6"></a-input>
      </template>
      <template #config="text, record, index">
        <a class="handler-margin" v-if="index === editRowIndex" @click="handleSaveEditRow">保存</a>
        <a v-if="index === editRowIndex" @click="handleCancelEditRow">取消</a>
        <a v-else @click="handleEditUserRow(record, index)">编辑</a>
      </template>
    </a-table>
  </div>
</template>

<script>

const propNameList = ['属性一', '属性二', '属性三', '属性四', '属性五', '属性六']

const userData = []
for (let i = 0; i < 30; i++) {
  userData.push({
    id: i + 1,
    username: 'admin' + i,
    name: '嘿嘿嘿',
    prop1: '属性1',
    prop2: '属性2',
    prop3: '属性3',
    prop4: '属性4',
    prop5: '属性5',
    prop6: '属性6'
  })
}

const userColumn = [
  {
    title: '用户名',
    width: 150,
    dataIndex: 'username'
  },
  {
    title: '姓名',
    width: 150,
    dataIndex: 'name'
  },
  {
    slots: { title: 'col1' },
    scopedSlots: { customRender: 'prop1' },
    dataIndex: 'prop1',
    width: 240,
    ellipsis: true
  },
  {
    slots: { title: 'col2' },
    scopedSlots: { customRender: 'prop2' },
    dataIndex: 'prop2',
    width: 240,
    ellipsis: true
  },
  {
    slots: { title: 'col3' },
    scopedSlots: { customRender: 'prop3' },
    dataIndex: 'prop3',
    width: 240,
    ellipsis: true
  },
  {
    slots: { title: 'col4' },
    scopedSlots: { customRender: 'prop4' },
    dataIndex: 'prop4',
    width: 240,
    ellipsis: true
  },
  {
    slots: { title: 'col5' },
    scopedSlots: { customRender: 'prop5' },
    dataIndex: 'prop5',
    width: 240,
    ellipsis: true
  },
  {
    slots: { title: 'col6' },
    scopedSlots: { customRender: 'prop6' },
    dataIndex: 'prop6',
    width: 240,
    ellipsis: true
  },
  {
    title: '操作',
    width: 120,
    fixed: 'right',
    dataIndex: 'config',
    scopedSlots: { customRender: 'config' }
  }
]

export default {
  name: 'userProp',
  data() {
    return {
      loading: false,
      modalData: {},
      visible1: false,
      editColIndex: '',
      editCol: '',
      editRowIndex: '',
      editRow: '',
      userSearch: {
        username: '',
        name: ''
      },
      userData: [],
      userColumn,
      propNameList
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    resetForm(tab) {
      this.userSearch = this.$options.data().userSearch
    },
    /* 处理列 */
    handleEditPropCol(num) {
      this.editColIndex = num
      this.editCol = this.propNameList[num]
    },
    handleSaveEditCol() {
      this.propNameList.splice(this.editColIndex, 1, this.editCol)
      this.handleCancelEditCol()
    },
    handleCancelEditCol() {
      this.editColIndex = ''
      this.editCol = ''
    },

    /* 处理行 */
    handleEditUserRow(record, index) {
      this.editRow = Object.assign({}, record)
      this.editRowIndex = index
    },
    handleCancelEditRow() {
      this.editRowIndex = ''
      this.editRow = ''
    },
    handleSaveEditRow() {
      this.userData.splice(this.editRowIndex, 1, this.editRow)
      this.handleCancelEditRow()
    },
    async getUserList() {
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

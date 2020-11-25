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
          <a-form-model-item>
            <a-button type="primary" @click="handleGetData">查询</a-button>
          </a-form-model-item>
          <a-form-model-item>
            <a-button type="primary" @click="resetForm()">重置</a-button>
          </a-form-model-item>
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
      <!-- 列属性编辑 -->
      <template v-for="(slot, index) in 6">
        <PropsEdit
          :slot="'col' + (index + 1)"
          :key="index"
          :index="index"
          :active-index="activePropIndex"
          :title="propNameList[index]"
          @changePropsEdit="activePropIndex = index"
          @cancelPropsEdit="activePropIndex = -1"
          @savePropsEdit="handleSaveEditCol"
          />
      </template>

      <!-- 行属性编辑 -->
      <template v-for="(slot, i) in 6" slot="custom" slot-scope="text, record, index">
        <TableEdit
          :key="i"
          :index="index"
          :active-index="activeTableIndex"
          :title="text"
          @getChangeText="v => getChangeText(i + 1, v)"
        />
      </template>

      <template #config="text, record, index">
        <a class="handler-margin" v-show="index === activeTableIndex" @click="handleSaveEditRow">保存</a>
        <a v-show="index === activeTableIndex" @click="activeTableIndex = -1">取消</a>
        <a v-show="index !== activeTableIndex" @click="handleEditUserRow(record, index)">编辑</a>
      </template>
    </a-table>
  </div>
</template>

<script>
import PropsEdit from './props-edit'
import TableEdit from './table-edit'

const propNameList = ['属性一', '属性二', '属性三', '属性四', '属性五', '属性六']

const userData = []
for (let i = 0; i < 30; i++) {
  userData.push({
    id: i + 1,
    username: 'admin' + i,
    name: '嘿嘿嘿',
    1: '属性1',
    2: '属性2',
    3: '属性3',
    4: '属性4',
    5: '属性5',
    6: '属性6'
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
  }
]

for (let i = 1; i < 7; i++) {
  userColumn.push({
    scopedSlots: { customRender: 'custom', title: 'col' + i },
    dataIndex: i,
    width: 240,
    ellipsis: true
  })
}

userColumn.push({
  title: '操作',
  width: 120,
  fixed: 'right',
  dataIndex: 'config',
  scopedSlots: { customRender: 'config' }
})

export default {
  name: 'userProp',
  components: {
    PropsEdit,
    TableEdit
  },
  data() {
    return {
      loading: false,
      modalData: {},
      visible1: false,
      activePropIndex: -1,
      activeTableIndex: -1,
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
    this.handleGetData()
  },
  methods: {
    resetForm(tab) {
      this.userSearch = this.$options.data().userSearch
    },
    /* 处理列 */
    handleSaveEditCol(index, data) {
      this.propNameList.splice(index, 1, data)
      this.activePropIndex = -1
      this.$message.success('保存成功')
    },

    /* 处理行 */
    handleEditUserRow(record, index) {
      if (this.activeTableIndex !== -1) {
        return this.$message.error('请先完成操作')
      } else {
        this.editRow = Object.assign({}, record)
        this.activeTableIndex = index
      }
    },
    getChangeText(index, value) {
      this.editRow[index] = value
    },
    handleSaveEditRow() {
      this.userData.splice(this.activeTableIndex, 1, this.editRow)
      this.activeTableIndex = -1
      this.$message.success('保存成功')
    },
    async handleGetData() {
      this.activePropIndex = -1
      this.activeTableIndex = -1
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

<template>
  <div class="tab scrollbar">
    <a-row class="line" style="padding-left: 16px">
      <a-col span="2">{{ roleTitle }}</a-col>
      <a-col>
        <a-checkbox-group
          :value="options.permissions"
          :options="options.header"
          :disabled="status === 'show' ? true : false"
          @change="onCheck"
        ></a-checkbox-group>
      </a-col>
    </a-row>
    <a-row class="title">
      <a-col span="14">
        <span>所有目录</span>
      </a-col>
      <a-col span="2" align="left" v-for="item in injectActionList" :key="item.permission">{{item.name}}</a-col>
      <a-col span="2" align="left" v-if="injectRoleTab === 3">
        <span>可见库组</span>
      </a-col>
    </a-row>
    <div class="checkbox-all">
      <a-row>
        <a-col :span="14">
          <span style="margin-right: 8px">全选</span>
          <a-checkbox :disabled="status === 'show'" :checked="checkAll" @change="handleCheckAll"></a-checkbox>
        </a-col>
        <a-col :span="8">
          <a-checkbox-group :value="injectAllPermission" style="width:100%">
            <a-row>
              <a-col span="5" v-for="(subitem,subindex) in injectActionList" :key="subitem.permission" :style="{
                width: `${100 / injectActionList.length}%`
              }">
                <a-checkbox
                  :class="`custom-checkbox-${subindex+1}`"
                  :value="subitem.permission"
                  @change="(e) => handleCheckbox(subitem, e)"
                  :disabled="status === 'show'"></a-checkbox>
              </a-col>
            </a-row>
          </a-checkbox-group>
        </a-col>
      </a-row>
    </div>
    <div class="content scrollbar">
      <limit-tree ref="tree" v-on="$listeners" @setTable="handleSetVisibleTable"></limit-tree>
    </div>
    <a-modal
      v-model="visible"
      title="设置可见库组"
      :bodyStyle="bodyStyle"
      :maskClosable="false"
      @ok="handleOk"
      @cancel="handleClearTable"
    >
      <a-input-search v-model="tableSearchWord" placeholder="请输入搜索的库组名" enter-button="查询" />
      <a-tree
        :checkedKeys="searchTableKey"
        :tree-data="treeData"
        :replaceFields="{title: 'dbName', key: 'dbId'}"
        :expandedKeys="[currentSourceInfo.id]"
        :default-expand-all="true"
        :auto-expand-parent="true"
        :checkable="true"
        @check="onCheckTable"
      ></a-tree>
    </a-modal>
  </div>
</template>

<script>
import LimitTree from './limit-tree'
export default {
  name: 'roleLimit',
  inject: [
    'status',
    'getCurrentAllPermission',
    'getProvideActionList',
    'getCurrentRoleTab',
    'getProvideTreeData'
  ],
  props: {
    roleTitle: String,
    options: Object
  },
  data() {
    return {
      visible: false,
      bodyStyle: { height: 'calc(100vh - 240px)', 'overflow-y': 'auto' },
      currentSourceInfo: {},
      tableSearchWord: '',
      checkedTables: [],
      tableData: []
    }
  },
  components: {
    LimitTree
  },
  computed: {
    checkAll() {
      return this.injectAllPermission.length === this.injectActionList.length
    },
    indeterminate() {
      return (
        this.injectAllPermission.length > 0 &&
        this.injectAllPermission.length < this.injectActionList.length
      )
    },
    // 树结构
    treeData() {
      return [
        {
          dbName: this.currentSourceInfo.title,
          dbId: this.currentSourceInfo.id,
          disabled: this.status === 'show',
          children: this.tableData.filter(
            (item) =>
              item.dbName
                .toLowerCase()
                .indexOf(this.tableSearchWord.toLowerCase()) > -1
          )
        }
      ]
    },
    // 筛选后的selectKey
    searchTableKey() {
      if (this.treeData.length === 0) {
        return []
      } else if (this.checkedTables.indexOf(this.currentSourceInfo.id) > -1) {
        return [...new Set([this.currentSourceInfo.id].concat(this.tableData.map(item => item.dbId)))]
      } else {
        return this.checkedTables.filter((item) =>
          this.treeData[0].children.some((t) => t.dbId === item)
        )
      }
    },
    injectAllPermission() {
      return this.getCurrentAllPermission()
    },
    injectActionList() {
      return this.getProvideActionList()
    },
    injectRoleTab() {
      return this.getCurrentRoleTab()
    },
    injectTreeData() {
      return this.getProvideTreeData()
    }
  },
  methods: {
    onCheck(value) {
      this.options.permissions = value
      this.$emit('setBasePrivilege', value, this.injectRoleTab + '')
    },
    async handleSetVisibleTable(sourceInfo) {
      this.visible = true
      this.currentSourceInfo = sourceInfo
      const res = await this.$server.projectCenter.getRoleSourceTable({
        roleId: this.$store.state.projectRoles.roleId,
        refId: sourceInfo.id
      })
      if (res.code === 200) {
        this.tableData = res.rows.map(item => {
          if (this.status === 'show') {
            item.disabled = true
          }
          return item
        })
        // 初始化选中框
        this.checkedTables = sourceInfo.dataBasePri
      } else {
        this.$message.error(res.msg || '请求错误')
      }
    },
    // 根据业务转换成文件权限
    changePermissionToFolder(permission) {
      switch (permission) {
        case 'read':
          return 'folderRead'
        case 'edit':
          return 'folderEdit'
        case 'remove':
          return 'folderRemove'
        default:
          return 'null'
      }
    },
    // 点击全选
    handleCheckAll(e) {
      this.injectActionList.map((item) => {
        this.handleCheckbox(item, e)
      })
    },
    // 处理全选栏按钮
    handleCheckbox({ permission }, e) {
      const checked = e.target.checked
      // 调用limit-tree组件的递归方法赋值权限
      const handleCheckbox = this.$refs.tree.handleCheckbox
      // 遍历树结构
      this.injectTreeData.map((item) => {
        // 文件夹权限和菜单不一致, 分开处理
        if (item.fileType === 0) {
          const perm = this.changePermissionToFolder(permission)
          if (perm !== 'null') {
            handleCheckbox(perm, checked, item)
          }
          // 有子节点则继续遍历
          if (
            item.children &&
            item.children.length &&
            item.children.length > 0
          ) {
            item.children.map((node) => {
              handleCheckbox(permission, checked, node)
            })
          }
        } else if (item.fileType === 1) {
          handleCheckbox(permission, checked, item)
        }
      })

      // 处理全选栏的逻辑
      if (!checked) {
        if (this.injectAllPermission.includes(permission)) {
          if (permission === 'read') {
            this.injectAllPermission.splice(0)
          } else {
            const index = this.injectAllPermission.indexOf(permission)
            this.injectAllPermission.splice(index, 1)
          }
        }
      } else {
        if (!this.injectAllPermission.includes(permission)) {
          this.injectAllPermission.push(permission)
          if (
            permission !== 'read' &&
            !this.injectAllPermission.includes('read')
          ) {
            this.injectAllPermission.push('read')
          }
        }
      }
    },
    // 模态框-选中表格
    onCheckTable(checkedKeys, { checked, node }) {
      const dbId = node.dataRef.dbId
      if (checked) {
        // 直接暴力合并去重
        const newList = this.checkedTables.concat(checkedKeys)
        this.checkedTables = [...new Set(newList)]
      } else {
        if (dbId === this.currentSourceInfo.id) {
          this.checkedTables.splice(0)
        } else {
          const index = this.checkedTables.indexOf(dbId)
          if (index > -1) {
            this.checkedTables.splice(index, 1)
          }
        }
      }
    },
    // 模态框-确认
    handleOk() {
      if (
        this.checkedTables.some((item) => item.id === this.currentSourceInfo.id)
      ) {
        this.currentSourceInfo.dataBasePri = Array(this.currentSourceInfo.id)
        this.$emit('getTablePermi', this.injectRoleTab, this.currentSourceInfo)
      } else {
        this.currentSourceInfo.dataBasePri = this.checkedTables
        this.$emit('getTablePermi', this.injectRoleTab, this.currentSourceInfo)
      }
      this.visible = false
    },
    // 模态框-关闭
    handleClearTable() {
      this.tableSearchWord = ''
      this.tableData = []
      this.checkedTables = []
    }
  }
}
</script>

<style scoped>
.checkbox-all {
  margin-top: 10px;
  margin-left:40px;
  padding: 0 5px;
}
</style>

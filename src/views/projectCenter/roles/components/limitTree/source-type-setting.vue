<template>
  <a-modal
      :visible="visible"
      title="选择可用的添加连接类型"
      :bodyStyle="bodyStyle"
      :maskClosable="false"
      @ok="handleOk"
      @cancel="handleClear"
    >
      <a-input-search v-model="searchWord" placeholder="请输入搜索的库组名" enter-button="查询" />
      <a-tree
        :checkedKeys="searchTableKey"
        :tree-data="treeData"
        :replaceFields="{title: 'name', key: 'type'}"
        :expandedKeys="[0]"
        :default-expand-all="true"
        :auto-expand-parent="true"
        :checkable="true"
        @check="onCheck"
      ></a-tree>
    </a-modal>
</template>

<script>
const typeList = [
  { name: 'mysql', type: 1 },
  { name: 'oracle', type: 2 },
  { name: 'hive', type: 5 },
  { name: 'excel', type: 11 },
  { name: 'csv', type: 12 }
]
export default {
  inject: [
    'status',
    'getCurrentRoleTab'
  ],
  props: {
    visible: Boolean
  },
  data() {
    return {
      bodyStyle: { height: 'calc(100vh - 240px)', 'overflow-y': 'auto' },
      searchWord: '',
      checkedTypes: [],
      initialTypes: [],
      isInitial: false,
      typeList
    }
  },
  computed: {
    injectRoleTab() {
      return this.getCurrentRoleTab()
    },
    // 库组-树结构
    treeData() {
      return [
        {
          name: '添加类型',
          type: 0,
          disabled: this.status === 'show',
          children: this.typeList.filter(
            (item) =>
              item.name
                .toLowerCase()
                .indexOf(this.searchWord.toLowerCase()) > -1
          )
        }
      ]
    },
    // 库组-筛选后的selectKey
    searchTableKey() {
      if (this.treeData.length === 0) {
        return []
      } else {
        return this.checkedTypes.filter((item) =>
          this.treeData[0].children.some((t) => t.type === item)
        )
      }
    }
  },
  methods: {
    async handleGetSourceType() {
      const res = await this.$server.projectCenter.getRoleSourceType(this.$store.state.projectRoles.roleId)
      if (res && res.code === 200) {
        let list = res.data.forbiddenType
        if (list.split) {
          if (list === 'all') {
            list = []
          } else {
            list = list.split(',')
          }
        } else {
          list = []
        }
        // 取反选中
        this.initialTypes = this.typeList.filter(item => list.indexOf(item.type) < 0).map(item => item.type)
        this.checkedTypes = this.initialTypes
        this.isInitial = true
      } else {
        this.$message.error(res.msg || '请求错误')
      }
    },
    handleSetVisibleSource() {
      this.$emit('update:visible', true)
      if (!this.isInitial) {
        this.handleGetSourceType()
      }
    },
    onCheck(checkedKeys, { checked, node }) {
      this.checkedTypes = checkedKeys
    },
    handleOk() {
      // 因为是黑名单列表, 所以要取反
      let checkedTypes = []
      this.typeList.forEach(item => {
        if (this.checkedTypes.indexOf(item.type) < 0) {
          checkedTypes.push(item.type)
        }
      })
      if (checkedTypes.length === 0) {
        checkedTypes = 'all'
      } else {
        checkedTypes = checkedTypes.toString()
      }
      this.$emit('setSourceType', checkedTypes) // 假如为空即全选, 传'all'
      this.$emit('update:visible', false)
    },
    handleClear() {
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style scoped>

</style>

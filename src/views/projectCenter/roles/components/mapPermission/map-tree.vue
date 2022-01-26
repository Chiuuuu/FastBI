<template>
  <a-modal
    title="配置身份"
    width="800px"
    :visible="visible"
    :bodyStyle="bodyStyle"
    :maskClosable="false"
    @ok="handleOk"
    @cancel="handleClear"
  >
    <a-spin :spinning="spinning">
      <div class="map-tree-container">
        <!-- 分公司 -->
        <div class="map-tree-item">
          <div class="title">分公司</div>
          <div class="box">
            <a-input v-model="keyword1" allowClear placeholder="请输入搜索关键词"></a-input>
            <div class="scroll-area scrollbar">
              <a-checkbox
                :checked="getChecked(1)"
                :indeterminate="getIndeterminate(1)"
                :disabled="status === 'show'"
                @change="handleCheckAll($event, 1)"
                >全选</a-checkbox
              >
              <a-checkbox
                v-for="(item, index) in getList(1)"
                :key="index"
                :indeterminate="item.indeterminate"
                :disabled="status === 'show'"
                v-model="item.checked"
                class="checkbox-line"
                @change="handleCheck($event, 1, item)"
              >
                <a-tooltip :title="item.name" placement="top">{{
                  item.name
                }}</a-tooltip>
              </a-checkbox>
            </div>
          </div>
        </div>
        <!-- 片区 -->
        <div class="map-tree-item">
          <div class="title">片区</div>
          <div class="box">
            <a-input v-model="keyword2" allowClear placeholder="请输入搜索关键词"></a-input>
            <div class="scroll-area scrollbar">
              <a-checkbox
                :checked="getChecked(2)"
                :indeterminate="getIndeterminate(2)"
                :disabled="status === 'show'"
                @change="handleCheckAll($event, 2)"
                >全选</a-checkbox
              >
              <a-checkbox
                v-for="(item, index) in getList(2)"
                :key="index"
                :indeterminate="item.indeterminate"
                :disabled="status === 'show'"
                v-model="item.checked"
                class="checkbox-line"
                @change="handleCheck($event, 2, item)"
              >
                <a-tooltip :title="item.name" placement="top">{{
                  item.name
                }}</a-tooltip>
              </a-checkbox>
            </div>
          </div>
        </div>
        <!-- 网格 -->
        <div class="map-tree-item">
          <div class="title">网格</div>
          <div class="box">
            <a-input v-model="keyword3" allowClear placeholder="请输入搜索关键词"></a-input>
            <div class="scroll-area scrollbar">
              <a-checkbox
                :checked="getChecked(3)"
                :indeterminate="getIndeterminate(3)"
                :disabled="status === 'show'"
                @change="handleCheckAll($event, 3)"
                >全选</a-checkbox
              >
              <a-checkbox
                v-for="(item, index) in getList(3)"
                :key="index"
                :indeterminate="item.indeterminate"
                :disabled="status === 'show'"
                v-model="item.checked"
                class="checkbox-line"
                @change="handleCheck($event, 3, item)"
              >
                <a-tooltip :title="item.name" placement="top">{{
                  item.name
                }}</a-tooltip>
              </a-checkbox>
            </div>
          </div>
        </div>
      </div>
    </a-spin>
  </a-modal>
</template>

<script>
export default {
  name: 'mapTree',
  inject: [
    'status',
    'getProvideActionList',
    'getProvideTreeData',
    'getCurrentRoleTab',
    'getFolderHeader'
  ],
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      bodyStyle: { padding: 0, height: '400px', 'overflow-y': 'auto' },
      spinning: false,
      keyword1: '',
      keyword2: '',
      keyword3: '',
      companyList: [], // 分公司列表
      areaList: [], // 片区列表
      gridList: [], // 网格列表
      enumList: {
        1: 'companyList',
        2: 'areaList',
        3: 'gridList'
      }
    }
  },
  created() {
    this.handleGetData()
  },
  methods: {
    async handleGetData() {
      this.spinning = true
      const res = await this.$server.mapArea.getCompanyList().finally(() => {
        this.spinning = false
      })
      // 平铺树结构, 形成下拉框筛选项
      let areaList = []
      let gridList = []
      this.companyList = res.data.map(item => {
        const headOfficeName = item.headOfficeName
        const sectionList = item.section || []
        // 片区列表
        areaList = areaList.concat(
          sectionList.map(item => {
            // 处理网格对象
            const children = item.grid.map(g => ({
              name: g,
              parentName: item.sectionName,
              checked: false,
              indeterminate: false,
              children: []
            }))
            // 网格列表拼接
            gridList = gridList.concat(children)
            return {
              children: children,
              parentName: headOfficeName,
              name: item.sectionName,
              checked: false,
              indeterminate: false
            }
          })
        )
        return {
          name: item.headOfficeName,
          parentName: '',
          checked: false,
          indeterminate: false,
          children: areaList
        }
      })
      this.areaList = areaList
      this.gridList = gridList
    },
    // 获取当前可选列表 type 1公司 2片区 3网格
    getList(type) {
      const keyword = this['keyword' + type].toLowerCase()
      return this[this.enumList[type]].filter(item => item.name.toLowerCase().indexOf(keyword) > -1)
    },
    // 计算当前全选属性
    getChecked(type) {
      const checkedLen = this[this.enumList[type]].filter(item => item.checked)
        .length
      return checkedLen === this[this.enumList[type]].length
    },
    getIndeterminate(type) {
      const checkedLen = this[this.enumList[type]].filter(item => item.checked)
        .length
      return checkedLen > 0 && checkedLen < this[this.enumList[type]].length
    },
    // 全选按钮事件
    handleCheckAll(e) {
      const { checked } = e.target
      let i = 0
      while (i < 3) {
        this[this.enumList[++i]].forEach(item => {
          item.checked = checked
          item.indeterminate = false
        })
      }
    },
    // 按钮事件, type 1公司 2片区 3网格
    handleCheck(e, type, data) {
      const { checked } = e.target
      let parentType = type
      // 向下勾选
      if (type < 3) {
        this[this.enumList[++type]].forEach(item => {
          if (item.parentName === data.name) {
            item.checked = checked
            item.indeterminate = false
            this.handleCheck({ target: { checked } }, type, item)
          }
        })
      }
      // 向上勾选
      while (parentType > 1) {
        // 找到父节点
        const target = this[this.enumList[--parentType]].find(
          item => item.name === data.parentName
        )
        if (target) {
          data = target
          const checkedList = []
          const indeterminateList = []
          target.children.forEach(item => {
            item.checked && checkedList.push(item)
            item.indeterminate && indeterminateList.push(item)
          })
          // 常规勾选判断 || 子节点也有indeterminate
          target.indeterminate = (checkedList.length > 0 && checkedList.length < target.children.length) || indeterminateList.length > 0
          target.checked = checkedList.length === target.children.length
        }
      }
    },
    handleOk() {},
    handleClear() {
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style lang="less" scoped>
@deep: ~'>>>';
.map-tree-container {
  display: flex;
  width: 790px;
  height: 400px;
  padding: 20px 40px;
  .map-tree-item {
    width: 240px;
    height: 100%;
    padding: 0 8px 8px;
    border: 1px solid #d9d9d9;
    &:not(:last-child) {
      border-right: none;
    }

    .title {
      text-align: center;
      height: 30px;
      line-height: 30px;
    }

    .box {
      height: calc(100% - 30px);
      width: 100%;

      .searchbar {
        height: 32px;
      }
      .scroll-area {
        height: calc(100% - 40px);
        margin-top: 8px;
        overflow-y: auto;
      }
      .checkbox-line {
        display: block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

        @{deep} &.ant-checkbox-wrapper {
          margin-left: 0;
        }
      }
    }
  }
}
</style>

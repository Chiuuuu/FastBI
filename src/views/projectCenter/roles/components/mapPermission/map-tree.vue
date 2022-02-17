<template>
  <a-modal
    title="配置身份"
    width="800px"
    :visible="visible"
    :bodyStyle="bodyStyle"
    :maskClosable="false"
    @ok="handleOk"
    @cancel="handleCancel"
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
    'getFolderHeader',
    'getAreaMapManagement'
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
      keyword1: '', // 分公司关键字
      keyword2: '', // 片区关键字
      keyword3: '', // 网格关键字
      companyList: [], // 分公司列表
      areaList: [], // 片区列表
      gridList: [], // 网格列表
      enumList: {
        1: 'companyList',
        2: 'areaList',
        3: 'gridList'
      },
      fetchData: [],
      cacheCheckedList: {
        companyList: [],
        areaList: [],
        gridList: []
      }, // 缓存勾选项(因为是非实时保存)
      saveCnt: 0 // 最终确认勾选次数
    }
  },
  computed: {
    injectAreaMapManagement() {
      return this.getAreaMapManagement()
    }
  },
  watch: {
    visible(newValue) {
      if (newValue) {
        this.renderTree()
      }
    }
  },
  created() {
    this.handleGetData()
  },
  methods: {
    async handleGetData() {
      this.spinning = true
      const res = await this.$server.mapArea.getRoleAreaTree().finally(() => {
        this.spinning = false
      })
      if (res && res.code === 200) {
        this.fetchData = res.data
        this.renderTree()
      }
    },
    // 从返回的列表中判断当前节点是否被选中
    validChecked(name, list) {
      const index = list.findIndex(n => n === name)
      if (index > -1) {
        // 减少下一次循环次数
        list.splice(index, 1)
        return true
      }
      return false
    },
    // 处理片区下的网格树
    doWithTreeForArea(area, grid, section) {
      // 通过接口获取已勾选的网格
      let checkedNum = 0
      const children = area.children
      const res = children.map(item => {
        // 判断当前网格是否被选中
        const checked = this.validChecked(item.name, grid)
        if (checked) {
          checkedNum++
        }
        return {
          name: item.name,
          parentName: area.name,
          checked: checked,
          indeterminate: false,
          children: []
        }
      })
      // 二次判定是否选中
      const checked = this.validChecked(area.name, section)
      return {
        name: area.name,
        checked: (checkedNum > 0 && checkedNum === children.length) || checked,
        indeterminate: checkedNum > 0 && checkedNum < children.length,
        children: res
      }
    },
    // 渲染树结构
    renderTree() {
      // 已经异步获取过, 直接加载缓存列表
      if (this.saveCnt > 0) {
        this.companyList = [].concat(this.cacheCheckedList.companyList)
        this.areaList = [].concat(this.cacheCheckedList.areaList)
        this.gridList = [].concat(this.cacheCheckedList.gridList)
        return
      }
      // 平铺树结构, 形成checkbox筛选项
      let areaList = []
      let gridList = []
      const data = [].concat(this.fetchData)
      this.companyList = data.map(company => {
        // 片区列表
        const children = company.children
        let checkedNum = 0
        const grid = [].concat(this.injectAreaMapManagement.grid)
        const section = [].concat(this.injectAreaMapManagement.section)
        const headOffice = [].concat(this.injectAreaMapManagement.headOffice)

        // 处理片区数据
        const doWithArea = area => {
          const areaItem = this.doWithTreeForArea(area, grid, section)
            if (areaItem.checked || areaItem.indeterminate) {
              checkedNum++
            }
            // 网格列表拼接
            gridList = gridList.concat(areaItem.children)
            return {
              parentName: company.name,
              ...areaItem
            }
        }
        // 特殊情况-公司下没有片区只有网格
        let newChildren = []
        if (children[0] && children[0].level === 2) {
          newChildren = [].push(doWithArea({
            name: company.name,
            children
          }))
        } else {
          newChildren = children.map(doWithArea)
        }
        areaList = areaList.concat(newChildren)
        // 二次判定是否选中
        const checked = this.validChecked(company.name, headOffice)
        return {
          name: company.name,
          parentName: '',
          checked: (checkedNum > 0 && checkedNum === children.length) || checked,
          indeterminate: checkedNum > 0 && checkedNum < children.length,
          children: newChildren
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
      const checkedLen = this[this.enumList[type]].filter(item => item.checked || item.indeterminate)
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
      let _type = type
      if (!checked) {
        data.indeterminate = false
      }
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
      while (_type > 1) {
        // 找到父节点
        const target = this[this.enumList[--_type]].find(
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
    getCheckedOrIndeterminateList(list) {
      return list.filter(item => item.checked || item.indeterminate).map(item => item.name)
    },
    handleOk() {
      this.saveCnt++
      this.cacheCheckedList = {
        companyList: this.companyList,
        areaList: this.areaList,
        gridList: this.gridList
      }
      this.$emit('getAreaMapManagement', {
        headOffice: this.getCheckedOrIndeterminateList(this.companyList),
        section: this.getCheckedOrIndeterminateList(this.areaList),
        grid: this.getCheckedOrIndeterminateList(this.gridList)
      })
      this.$emit('update:visible', false)
    },
    handleCancel() {
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

import FieldSelectTree from './components/field-tree-select.vue'
const mixinModal = {
  props: {
    isShow: Boolean,
    computeType: String,
    renameData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      bodyStyle: { height: 'calc(100vh - 340px)', 'overflow-y': 'auto', 'min-height': '360px' }
    }
  },
  computed: {
    isEdit() {
      return 'id' in this.renameData
    },
    sourceDimensions() {
      if (!this.$parent || !this.$parent.detailInfo) return []
      return [...this.$parent.detailInfo.pivotSchema.dimensions, ...this.$parent.cacheDimensions]
    },
    sourceMeasures() {
      if (!this.$parent || !this.$parent.detailInfo) return []
      return [...this.$parent.detailInfo.pivotSchema.measures, ...this.$parent.cacheMeasures]
    }
  },
  components: {
    FieldSelectTree
  }
}

const mixinTable = {
  props: {
    dimensions: {
      type: Array,
      required: true
    },
    measures: {
      type: Array,
      required: true
    },
    tableList: {
      type: Array,
      required: true
    }
  },
  created() {
    this.handleTreeData()
  },
  data() {
    return {
      showFieldModal: false,
      rows: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      tableScroll: { y: 'calc(100vh - 350px)', x: 790 },
      treeDimensions: [],
      treeMeasures: []
    }
  },
  components: {
    FieldSelectTree
  },
  methods: {
    handleTreeData() {
      // const dim = this.handleFilterPivotSchema(this.dimensions)
      // const mea = this.handleFilterPivotSchema(this.measures)
      // this.rows = [].concat(dim.filterList).concat(mea.filterList).sort((a, b) => a.sortIndex - b.sortIndex)
      // this.treeDimensions = dim.treeList
      // this.treeMeasures = mea.treeList
      this.treeDimensions = this.handleFilterPivotSchema(this.dimensions)
      this.treeMeasures = this.handleFilterPivotSchema(this.measures)
    },
    // 树结构需要过滤掉已经排序的字段(每次改动列表, 重新处理一遍)
    handleFilterPivotSchema(list) {
      // const filterList = [] // 选中的字段
      // const treeList = [] // 未选中放入树结构
      // list.forEach(item => {
      //   if (!isNaN(item.sortIndex)) {
      //     filterList.push(item)
      //   } else {
      //     treeList.push(item)
      //   }
      // })
      // return {
      //   filterList,
      //   treeList
      // }
      return list.filter(item => !this.tableList.some(n => n.field === item.alias))
    }
  }
}

export {
  mixinModal,
  mixinTable
}

<template>
  <div
    class="m-dml-map m-map"
    ref="mapRef"
    @dragenter.prevent.stop="handleMapDragEnter"
    @dragover.prevent.stop
    @drop.stop="handleMapDrop"
  >
    <a-empty v-if="renderTables.length === 0" class="main-empty">
      <span slot="description">暂无数据</span>
    </a-empty>
    <template v-else>
      <tree-node
        v-for="(item, index) in renderTables"
        :key="index"
        :node-data="item"
        :data-index="index"
        :detailInfo="detailInfo"
        :errorTables="errorTables"
      ></tree-node>
    </template>
  </div>
</template>
<script>
import { Utils, Node, conversionTree } from '../util'
import { mapState } from 'vuex'
import TreeNode from './tree-node'
import groupBy from 'lodash/groupBy'
export default {
  name: 'edit-right-top',
  inject: ['nodeStatus'],
  components: {
    TreeNode
  },
  props: ['detailInfo'],
  data() {
    return {
      isTree: true,
      info: '',
      renderTables: [], // 用来渲染树组件
      errorTables: [] // 接受错误的tableNo
    }
  },
  created() {
    // this.modelId = this.$route.query.modelId || this.$store.state.dataModel.modelId
  },
  mounted() {
  },
  computed: {
    ...mapState({
      // modelId: state => state.dataModel.modelId,
      databaseId: state => state.dataModel.databaseId
    }),
    modelId() {
      return this.$route.query.modelId || this.$store.state.dataModel.addModelId
    }
  },
  watch: {
    detailInfo: {
      handler: function(v) {
        if (v) {
          this.info = v
          this.handleDetailWithRoot()
        }
      },
      deep: false
    }
  },
  methods: {
    handleClearRenderTables() {
      this.renderTables = []
      this.errorTables = []
      this.detailInfo.config.tables = []
      this.detailInfo.pivotSchema.dimensions = []
      this.detailInfo.pivotSchema.measures = []
      this.$parent.cacheDimensions = []
      this.$parent.cacheMeasures = []
      this.$parent.handleDimensions()
      this.$parent.handleMeasures()
    },
    /**
     * 处理树形组件
    */
    handleDetailWithRoot() {
      if (this.info.config.tables.length === 0) return
      this.renderTables = []
      const first = this.info.config.tables[0]
      const root = new Node(first)
      const node = this.handleConversionTree(root)
      this.renderTables.push(node)
    },
        /**
     * 转换数据
    */
    handleConversionTree(node) {
      conversionTree(node, this.info.config.tables.slice(1), 'tableNo')
      return node
    },
    handleMapAddClass() {
      Utils.addClass(this.$refs.mapRef, 'm-map-hover')
    },
    handleMapRemoveClass() {
      Utils.removeClass(this.$refs.mapRef, 'm-map-hover')
    },
    handleMapDragEnter(event) {
      event.preventDefault()
      this.handleMapAddClass()
    },
    handleMapDrop(event) {
      console.log('right-wrap-drop', event.target.className)
      if (this.nodeStatus.dragType === 'node') return
      Utils.removeClass(this.$refs.mapRef, 'map-hover')
      this.handleDealWithNode()
    },
    handleDealWithNode(key = 'children') {
      const tables = this.detailInfo.config.tables
      let len = tables.length
      let node = this.nodeStatus.dragNode
      node.setTableId()
      node.setTableNo(tables.length + 1)
      if (len === 0) {
        this.generateRoot(node)
      } else {
        this.loopCurrentAddNode(this.renderTables, node, key)
      }
    },
    async generateRoot(node) {
      console.log(node, node.getProps())
      this.detailInfo.config.tables.push(node.getProps())
      await this.handleUpdate({
        tables: new Array(Object.assign(node.getProps(), {
          leftTableId: 0,
          datamodelId: this.modelId
        }))
      })
      this.renderTables.push(node)
    },
    async loopCurrentAddNode(arry, node, key) {
      let current = arry[0]
      if (!Utils.isType(current, 'Object')) {
        return
      }

      if (current.hasOwnProperty(key)) {
        if (current[key].length === 0) {
          console.log('获取节点', current, node)
          await this.getJoin(current, node)
          current.add(node)
          this.detailInfo.config.tables.push(node.getProps())
          await this.handleUpdate({
            tables: this.detailInfo.config.tables.map(item => {
              item.datamodelId = this.modelId
              return item
            })
          })
          // new Array(Object.assign(node.getProps(), {
          //     leftTableId: node.getProps().tableNo,
          //     tableId: current.getProps().id,
          //     datamodelId: this.modelId
          //   }))
          console.log(this.detailInfo.config.tables)
        } else {
          this.loopCurrentAddNode(current[key], node, key)
        }
      }
    },
    async getJoin(left, right) {
      const result = await this.$server.dataModel.getBetweenJoin({
        databaseId: this.databaseId,
        datamodelId: this.detailInfo.id,
        left: left.getProps(),
        right: Object.assign(right.getProps(), {
          leftTableId: left.getProps().tableNo,
          datamodelId: this.detailInfo.id
        })
      })
      if (result.code === 200) {
        right.setJoin(result.data)
        right.setDataModelId(this.detailInfo.id)
      } else {
        this.$message.error(result.msg)
      }
    },
    async handleUpdate(params) {
      // if (params.tables.length < 1) {
      //   return this.handleClearRenderTables()
      // }
      const result = await this.$server.dataModel.getPivotschemaByTables(params)
      // const result = await this.$server.dataModel.putModelDetail({
      //   dataConnectionId: this.$route.query.datasourceId,
      //   dataModelId: this.modelId,
      //   config: this.detailInfo.config
      // })

      if (result.code === 200) {
        this.detailInfo.config = result.data.config
        this.detailInfo.pivotSchema = result.data.pivotSchema
        this.$parent.handleDimensions()
        this.$parent.handleMeasures()
      } else {
        this.$message.error(result.msg)
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
.m-map {
    position: relative;
    box-sizing: border-box;
    padding: 21px;
    height: 100%;
    width: 100%;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    -o-user-select: none;
    user-select: none;
    border: 1px solid transparent;
}
.m-map-hover {
    border-color: #90b9e8;
}
</style>

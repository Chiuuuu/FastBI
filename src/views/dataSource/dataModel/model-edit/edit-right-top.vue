<template>
  <div
    class="m-dml-map m-map edit"
    ref="mapRef"
    @dragenter.prevent.stop="handleMapDragEnter"
    @dragover.prevent.stop
    @drop.stop="handleMapDrop"
  >
    <tree-node
      v-for="(item, index) in treeData"
      :key="index"
      :node-data="item"
      :data-index="index"
    ></tree-node>
  </div>
</template>
<script>
import { Utils } from './utils'
import TreeNode from './tree-node'
export default {
  name: 'edit-right-top',
  inject: ['tables', 'nodeStatus'],
  components: {
    TreeNode
  },
  data() {
    return {
      isTree: true,
      treeData: []
    //   treeData: [
    //     {
    //       id: 1,
    //       title: "三大框架",
    //       children: [
    //         {
    //           id: 2,
    //           title: "react",
    //           children: [
    //             {
    //               id: 2,
    //               title: "虚拟dom"
    //             },
    //             {
    //               id: 2,
    //               title: "ui"
    //             }
    //           ]
    //         },
    //         {
    //           id: 2,
    //           title: "vue"
    //         },
    //         {
    //           id: 2,
    //           title: "angular"
    //         }
    //       ]
    //     }
    //   ]
    }
  },
  methods: {
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
      let len = this.tables.length
      let node = this.nodeStatus.dragNode
      node.setTableId(this.tables.length + 1)
      if (len === 0) {
        this.generateRoot(node)
      } else {
        this.loopCurrentAddNode(this.treeData, node, key)
      }
      this.tables.push(node.getProps())
      console.log(this.tables)
    },
    generateRoot(node) {
      this.treeData.push(node)
    },
    loopCurrentAddNode(arry, node, key) {
      let current = arry[0]
      if (!Utils.isType(current, 'Object')) {
        return
      }

      if (current.hasOwnProperty(key)) {
        if (current[key].length === 0) {
          current.add(node)
        } else {
          this.loopCurrentAddNode(current[key], node, key)
        }
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
.m-dml-map.edit {
    height: calc(50vh - 162px);
}
.m-map {
    position: relative;
    box-sizing: border-box;
    padding: 25px;
    overflow: auto;
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

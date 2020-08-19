<template>
  <div
    class="m-dml-map m-map edit"
    ref="mapRef"
    @dragover.stop="handleMapDragover"
    @dragleave.stop="handleMapDragLeave"
    @drop.stop="handleMapDrop($event, 'wrap')"
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
  inject: ['nodeStatus'],
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
    // 是否有拖拽节点
    hasDragNode() {
      return this.nodeStatus.dragNode
      // return this.dragOverStatus.dragNode;
    },
    handleMapAddClass() {
      Utils.addClass(this.$refs.mapRef, 'm-map-hover')
    },
    handleMapRemoveClass() {
      Utils.removeClass(this.$refs.mapRef, 'm-map-hover')
    },
    // 开始拖拽时候记录节点
    handleRightDragStart(event, treeNode, index) {
      this.nodeStatus = Object.assign(this.nodeStatus, {
        event,
        dragType: 'right',
        dragNode: {
          nodeData: treeNode.nodeData,
          parentNode: treeNode.parentNodeData,
          index
        }
      })
      console.log('start-nodestatr', this.nodeStatus)
    },
    handleMapDragover(event) {
      event.preventDefault()
      //   console.log('right-wrap-drop', this.$refs.mapRef.className)
      this.handleMapAddClass()
    },
    handleMapDragLeave(event) {
      event.stopPropagation()
      //   console.log('right-wrap-leaveeee', event.target.className)
    },
    handleNodeDrop(event, treeNode, index) {
      this.nodeStatus = Object.assign(this.nodeStatus, {
        dropNode: {
          index,
          nodeData: treeNode.nodeData,
          parentNode: treeNode.parentNodeData
        },
        event
      })
      this.handleChangeData()
    },
    handleChangeData() {
      console.log(this.nodeStatus)
      const type = this.nodeStatus.dragType
      console.log('type', type)
      var dragData = this.nodeStatus.dragNode.nodeData
      var dragParent = this.nodeStatus.dragNode.parentNode
      var dropData = this.nodeStatus.dropNode.nodeData
      var dropParent = this.nodeStatus.dropNode.parentNode

      if (dragParent === dropData) {
        console.log('相同父节点')
        return
      }
    this.handleAddItem()
    },
    handleAddItem() {
      var dragData = this.nodeStatus.dragNode.nodeData
      var dragParent = this.nodeStatus.dragNode.parentNode
      var dropData = this.nodeStatus.dropNode.nodeData
      // var copyDragData = JSON.parse(JSON.stringify(dragData))
      var dropParent = this.nodeStatus.dropNode.parentNode
      var dropPosition = this.nodeStatus.dropPosition
      if (Utils.isType(dropData, 'Object')) {
        if (this.nodeStatus.dragType === 'right') {
          dragParent.children.splice(this.nodeStatus.dragNode.index, 1)
        }
        if (dropData.hasOwnProperty('children')) {
          dropData.children.push(dragData)
        } else {
          this.$set(dropData, 'children', [dragData])
          if (dropParent && dropParent.children) {
            this.$set(dropParent.children, this.nodeStatus.dropNode.index, dropData)
          }
          console.log(dropParent)
        }
      }
    },
    handleMapDrop(event, type, treeNode) {
      event.preventDefault()
      event.stopPropagation()
      console.log('right-wrap-drop', event.target.className)
      if (this.nodeStatus.dragType === 'left') {
          if (this.treeData.length === 0) {
              this.treeData.push(this.nodeStatus.dragNode.nodeData)
          } else {
              this.loopObject(this.treeData, this.nodeStatus.dragNode.nodeData)
          }
      }
    },
    loopObject(arry, data) {
      let item = arry[0]
      if (!Utils.isType(item, 'Object')) {
        return
      }
      if (item.hasOwnProperty('children')) {
        if (item.children.length === 0) {
          item.children.push(data)
        } else {
          this.loopObject(item.children, data)
        }
      } else {
        this.$set(item, 'children', [data])
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
.m-dml-map {
    margin: 10px;
    background: #fff;
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
    border: 2px solid transparent;
}
.m-map-hover {
    border: 2px solid #90b9e8;
}
</style>

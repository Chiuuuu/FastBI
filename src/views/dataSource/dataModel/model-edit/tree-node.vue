<template>
  <div class="box">
    <div class="item table-item" ref="itemRef">
      <h6
        class="dragable"
        :draggable="isDrag"
        @mouseleave.stop="handleMouseLeave"
        @mousedown.stop="handleMouseDown"
        @dragstart.stop="handleDragStart($event, dataIndex)"
        @dragenter.stop="handleDragEnter"
        @dragend.stop="handleDragEnd"
        @dragleave.stop="handleDragLeave"
        @dragover.stop="handleDragOver"
        @drop.stop="handleDrop($event, dataIndex)"
        style="border-color: rgb(8, 140, 237);"
      >
        {{ nodeData.title }}
      </h6>
      <span class="opt">
        <b class="num">0</b>
      </span>
    </div>
    <div class="wrap">
      <tree-node
        v-for="(item, subindex) in nodeData.children"
        :key="subindex"
        :node-data="item"
        :data-index="subindex"
      ></tree-node>
      <!-- <div class="box">
        <div class="item table-item">
          <h6 class="dragable" style="border-color: rgb(8, 140, 237);">
            工作表1
          </h6>
          <span class="opt">
            <b class="num">2</b>
          </span>
        </div>
      </div>
      <div class="box">
        <div class="item table-item">
          <h6 class="dragable" style="border-color: rgb(8, 140, 237);">
            工作表1
          </h6>
          <span class="opt">
            <b class="num">2</b>
          </span>
        </div>
      </div> -->
    </div>
  </div>
</template>
<script>
import { Utils } from './utils'
export default {
  name: 'tree-node',
  inject: ['nodeStatus'],
  props: {
    nodeData: {
      type: Object,
      default: function() {
        return {}
      }
    },
    dataIndex: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      isDrag: false,
      root: true
    }
  },
  created() {
    const parent = this.$parent
    if (parent.isTree) {
      this.root = parent
    } else {
      this.root = parent.root
    }
  },
  methods: {
    handleMouseDown() {
      this.isDrag = true
    },
    handleMouseLeave() {
      this.isDrag = false
    },
    handleDragStart(event, index) {
      console.log('node--drag-start')
      event.stopPropagation()
      const parent = this.$parent
      this.parentNodeData = parent.nodeData
      this.root.handleRightDragStart(event, this, index)
    },
    handleDragEnter(event) {
      if (Utils.hasClass(event.target, 'draggable', false)) {
        console.log('node-over', event.target.className)
        this.handleItemHigtLight()
      }
      this.root.handleMapDragover(event, this)
    },
    handleDragLeave(event) {
      console.log('node-leave', event.target.className)
      this.handleRemoveItemHigtLight()
    },
    handleItemHigtLight() {
      Utils.addClass(this.$refs.itemRef, 'z-on')
    },
    handleRemoveItemHigtLight() {
      Utils.removeClass(this.$refs.itemRef, 'z-on')
    },
    handleDragEnd() {
      console.log('node-end')
      this.root.handleMapRemoveClass()
    },
    handleDragOver(event) {
      event.preventDefault()
    },
    handleDrop(event, index) {
      console.log('node-drop')
      this.handleRemoveItemHigtLight()
      this.root.handleNodeDrop(event, this, index)
    }
  }
}
</script>
<style lang="stylus" scoped>
.m-map {
    .box {
        white-space: nowrap;
        padding-right: 3px;
    }
    .item,
    .wrap {
        position: relative;
        display: inline-block;
        vertical-align: top;
    }
    .item {
        position: relative;
        line-height: 34px;
        margin-bottom: 5px;
        width: 150px;
        height: 36px;
        border: 1px solid #dedede;
        color: #666;
        border-radius: 2px;
        background: #f1f1f1;
        &.z-on {
            border-color: #4a91e3;
            box-shadow: 0 0 6px #4a91e3;
        }
        h6 {
            padding: 0 25px 0 10px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            cursor: move;
            cursor: -webkit-grab;
            cursor: -moz-grab;
            cursor: -ms-grab;
            cursor: -o-grab;
            background-color: #f1f0ff;
            text-align: center;
        }
        .opt {
            position: absolute;
            z-index: 9;
            left: -56px;
            top: 50%;
            width: 26px;
            height: 26px;
            line-height: 26px;
            margin-top: -13px;
            text-align: center;
            border: 1px solid #ddd;
            border-radius: 50%;
            color: #999;
            background: #fff;
            cursor: pointer;
            b {
                display: block;
                font-size: 14px;
                color: #6b9de3;
                font-weight: 700;
                position: absolute;
                width: 100%;
                height: 26px;
                line-height: 26px;
            }
        }
    }
    .wrap {
        overflow: hidden;
        margin-left: 0;
        position: relative;
        .box {
            margin-left: 115px;
            &+.box>.item {
                &:before {
                    position: absolute;
                    left: -89px;
                    top: -10000px;
                    bottom: 25px;
                    border-left: 1px solid #dedede;
                    content: "";
                }
                &:after {
                    position: absolute;
                    top: 8px;
                    left: -89px;
                    width: 87px;
                    height: 10px;
                    border: 1px solid #dedede;
                    border-width: 0 0 1px 1px;
                    content: "";
                }
            }
            &:first-child>.item {
                z-index: 1;

                &:before {
                    position: absolute;
                    z-index: 200;
                    top: -1px;
                    left: -89px;
                    width: 1px;
                    height: 20px;
                    background: #fff;
                    content: "";
                }
                &:after {
                    position: absolute;
                    top: 19px;
                    left: -120px;
                    width: 120px;
                    border-top: 1px solid #dedede;
                    content: "";
                }
            }
        }
    }
}
</style>

<template>
  <div class="box">
    <div class="item table-item" ref="itemRef">
      <h6
        class="dragable"
        :draggable="isDrag"
        @mouseleave.stop="handleMouseLeave"
        @mousedown.stop="handleMouseDown"
        @dragstart.stop="handleDragStart($event, nodeData, dataIndex)"
        @dragenter.stop="handleDragEnter"
        @dragleave.stop="handleDragLeave"
        @dragend.stop="handleDragEnd"
        @dragover.prevent.stop
        @drop.stop="handleDrop($event, nodeData, dataIndex)"
        style="border-color: rgb(8, 140, 237);"
      >
        {{ nodeData.props.name }}
      </h6>
      <span class="opt">
         <b class="num">{{joinLength}}</b>
      </span>
      <!-- <a-popover v-model="visible" trigger="click" overlayClassName='model-popover-box' @visibleChange="(v)=> handleVisibleChange(v, nodeData)">
        <div slot="content" class='popover-content'>
          <div class="popover-header">
            <div class="popover-header-title">
              <div class="mtx">关联</div>
              <span class="closeBtn" @click="handleClosePopover">X</span>
            </div>
          </div>
          <div class="popover-type">
            <ul>
              <li v-for='(item, index) in popoverType' :key="item">
                <div class="wap" @click="handlePopoverType(item, nodeData)">
                  <div class="inner" :class="popoverTypeActive === item ? 'active' : ''">
                    <div class="img" :class="'img-0' + (index + 1)"></div>
                    <div class="txt">{{item}}</div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div class="popover-body">
            <div class="sprt">
              <div class="item">{{ popoverLeftTable }}</div>
              <div class="item">{{ popoverRightTable }}</div>
            </div>
            <div class="popover-form">
              <a-form-model
                v-for="(condition, index) in popoverForm"
                :key="index"
                :ref="'condition' + index"
                :model="condition">
                <a-row>
                  <a-col :span="10">
                    <a-form-model-item class="item">
                      <a-select
                        show-search
                        placeholder="Select a person"
                        style="width: 100%"
                        prop="left"
                        v-model="condition.left"
                      >
                        <a-select-option value="jack">
                          Jack
                        </a-select-option>
                        <a-select-option value="lucy">
                          Lucy
                        </a-select-option>
                        <a-select-option value="tom">
                          Tom
                        </a-select-option>
                      </a-select>
                    </a-form-model-item>
                  </a-col>
                  <a-col :span="2">
                    <div class="equal">=</div>
                  </a-col>
                  <a-col :span="10">
                    <a-form-model-item class="item">
                      <a-select
                        show-search
                        placeholder="Select a person"
                        style="width: 100%"
                        prop="right"
                        v-model="condition.right"
                      >
                        <a-select-option value="jack">
                          Jack
                        </a-select-option>
                        <a-select-option value="lucy">
                          Lucy
                        </a-select-option>
                        <a-select-option value="tom">
                          Tom
                        </a-select-option>
                      </a-select>
                    </a-form-model-item>
                  </a-col>
                  <a-col :span='2' class="delete">
                    <a-button type='link' @click="handledeleteCondition(index)"><a-icon type="delete" /></a-button>
                  </a-col>
                </a-row>
              </a-form-model>
            </div>
            <a-button type="link" @click="handleAddCondition">
              <a-icon type="plus" />添加
            </a-button>
            <a-button type="link" @click="handleClearCondition">全部删除</a-button>
          </div>
        </div>
        <span class="opt">
          <b class="num">{{joinLength}}</b>
        </span>
      </a-popover> -->
      <a-popover v-model="nodeVisible" trigger="click"  overlayClassName='btn-box'>
        <ul slot="content" class="btn-box-ul">
          <li class="btn-box-li" @click="handleBtnDelete(nodeData)">删除</li>
        </ul>
        <div class="caret-down"></div>
      </a-popover>
    </div>
    <div class="wrap">
      <tree-node
        v-for="(item, subindex) in nodeData.children"
        :key="subindex"
        :node-data="item"
        :data-index="subindex"
        :detailInfo="detailInfo"
      ></tree-node>
    </div>
  </div>
</template>
<script>
import { Utils, Node } from '../util'
import findIndex from 'lodash/findIndex'
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
    },
    detailInfo: {
      type: [String, Object]
    }
  },
  data() {
    return {
      isDrag: false,
      root: true,
      visible: false,
      nodeVisible: false,
      mark: '',
      popoverTypeActive: '内部',
      popoverType: ['内部', '左侧', '右侧', '完全外部'],
      popoverLeftTable: '',
      popoverRightTable: '',
      popoverForm: []
    }
  },
  computed: {
    joinLength() {
      return this.nodeData.props.join && this.nodeData.props.join.conditions.length
    },
    modelId() {
      return this.$route.query.modelId || this.$store.state.dataModel.addModelId
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
    handledeleteCondition(index) {
      this.popoverForm.splice(index, 1)
    },
    handleAddCondition() {
      this.popoverForm.push({ left: '', right: '' })
    },
    handleClearCondition() {
      this.popoverForm = []
    },
    handleBtnDelete(node) {
      // let deleteList = []
      this.nodeVisible = false
      this.$confirm({
        title: '确认提示',
        content: '确定删除该表?',
        onOk: async () => {
          this.loopDelete(node, this.detailInfo.config.tables)
          if (this.detailInfo.config.tables.length < 1) {
            return this.root.handleClearRenderTables()
          }
          await this.root.handleUpdate({
            tables: this.detailInfo.config.tables.map((item, index) => {
              item.datamodelId = this.modelId
              item.tableNo = index + 1
              return item
            })
          })
        }
      })
    },
    loopDelete(node, list) {
      const ownProps = node.getProps()
      const index = findIndex(list, ownProps)
      list.splice(index, 1)
      console.log(list)
      if (node.children && node.children.length > 0) {
        node.children.forEach(item => {
          this.loopDelete(item, list)
        })
      }
    },
    handleMouseDown() {
      this.isDrag = true
    },
    handleMouseLeave() {
      this.isDrag = false
    },
    handleDragStart(event, item, index) {
      console.log('node--drag-start')
      this.nodeStatus.dragNode = item
      this.nodeStatus.dragType = 'node'
    },
    handleDragEnter(event) {
      if (Utils.hasClass(event.target, 'draggable', false)) {
        console.log('node-over', event.target.className)
        this.handleItemHigtLight()
      }
      this.root.handleMapDragEnter(event, this)
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
    async handleDrop(event, current, index) {
      console.log('node-drop')
      this.handleRemoveItemHigtLight()
      let dragNode = this.nodeStatus.dragNode
      const tables = this.detailInfo.config.tables
      if (this.nodeStatus.dragType === 'menu') {
        dragNode.setTableId()
        dragNode.setTableNo(tables.length + 1)
        await this.root.getJoin(current, dragNode)
        tables.push(dragNode.getProps())
        current.add(dragNode)
        await this.root.handleUpdate({
          tables: this.detailInfo.config.tables.map((item, index) => {
            item.datamodelId = this.modelId
            return item
          })
        })
      }

      if (this.nodeStatus.dragType === 'node') {
        if (current.props.tableNo === dragNode.props.tableNo) {
          console.log('同一个元素')
          return
        }

        const dragNodeId = dragNode.props.tableNo

        if (dragNode.parent && dragNode.parent.props.tableNo === current.props.tableNo) {
          console.log('相同父节点')
          return
        }

        if (this.lootBeforeParent(dragNodeId, current)) return

        let node = new Node(dragNode.getProps())
        node.setParent(current)
        node.setChildren(dragNode.children)
        await this.root.getJoin(current, node)
        current.add(node)
        const index = findIndex(tables, function(item) {
          return node.getProps().tableNo === item.tableNo
        })
        tables.splice(index, 1, node.getProps())
        this.parentDeleteNode(event, dragNode)
        await this.root.handleUpdate({
          tables: this.detailInfo.config.tables.map(item => {
            item.datamodelId = this.modelId
            return item
          })
        })
      }
    },
    lootBeforeParent(parentId, node) {
      if (!node.parent) return false
      if (node.parent.props.tableNo === parentId) return true
      return this.lootBeforeParent(parentId, node.parent)
    },
    parentDeleteNode(event, node) {
      const children = node.parent.children
      const index = children.indexOf(node)
      children.splice(index, 1)
    },
    handleClosePopover() {
      this.visible = false
    },
    handlePopoverType(type, nodeData) {
      this.popoverTypeActive = type
    },
    handleVisibleChange(v, node) {
      if (!v) return
      // console.log('left', node.parent.getProps().name)
      // console.log('right', node.getProps().name)
      this.popoverLeftTable = node.parent.getProps().name
      this.popoverRightTable = node.getProps().name
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
        &:hover {
          .caret-down {
            display: block;
          }
        }
        .caret-down {
          display: none;
          width: 0;
          height: 0;
          border: 4px solid #333;
          border-color: rgba(0, 0, 0, 0.85) transparent transparent transparent;
          position: absolute;
          top: 55%;
          transform: translateY(-50%);
          right: 6px;
          cursor: pointer;
        }
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
            left: -68px;
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
<style lang="less">
.model-popover-box{
  .ant-popover-inner-content {
    padding: 0;
  }
  .popover{
    &-header{
      background: #fff;
      z-index: 10;
      position: relative;
      height: 44px;
      line-height: 44px;
      .mtx {
        font-size: 14px;
        color: #666;
        padding-left: 20px;
        letter-spacing: 1px;
      }
      .closeBtn {
        display: block;
        position: absolute;
        right: 10px;
        top: 0;
        font-size: 12px;
        cursor: pointer;
      }
    }
    &-type{
      border-top: 1px solid #ededed;
      border-bottom: 1px solid #ededed;
      position: relative;
      z-index: 10;
      background: #fff;
      overflow: hidden;
      ul > li {
        float: left;
        width: 25%;
        cursor: pointer;
        .wap {
          border-right: 1px solid #ededed;
          .inner {
            border: 3px solid #fff;
            &.active {
              border-color: #ededed;
            }
              .img{
                width: 48px;
                height: 30px;
                margin: 10px auto 8px;
                background: #fff url("../../../../assets/images/tableRelat.png") no-repeat;
                &-01{
                  background-position: 0 0
                }
                &-02{
                  background-position: 0 -38px
                }
                &-03{
                  background-position: 0 -77px
                }
                &-04{
                  background-position: -52px -116px
                  // background-position: 0 -116px
                }
                &-05{
                  background-position: -52px -116px
                }
                &-06{
                  background-position: -52px -77px
                }
              }
              .txt {
                text-align: center;
                margin-bottom: 8px;
              }
          }
        }
      }
    }
    &-body{
      .sprt {
        border-bottom: 1px solid #ededed;
        background: #fafafa;
        height: 36px;
        line-height: 36px;
        position: relative;
        z-index: 10;
        overflow: hidden;
        .item {
          float: left;
          width: 50%;
          padding-left: 20px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      .popover-form {
        padding-top: 20px;
        max-height: 260px;
        overflow-y: auto;
        overflow-x: hidden;
        border-bottom: 1px solid #ededed;

        .item {
          padding-left: 20px;
        }
        .equal {
          width: 40px;
          height: 40px;
          line-height: 40px;
          text-align: right;
          font-size: 20px;
        }
        .delete {
          width: 40px;
          height: 36px;
          line-height: 38px;
        }
      }
    }
  }
}
.popover-content {
  box-shadow: 0 2px 0 0 #ddd;
  border: 1px solid #e6e6e6;
  width: 546px;
  z-index: 100;
  color: #666;
}
.btn-box {
  .ant-popover-inner-content {
    padding: 0;
  }
  .btn-box-ul {
    margin: 0;
  }
  .btn-box-li {
    cursor: default;
    position: relative;
    font-size: 12px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    -ms-box-sizing: border-box;
    -o-box-sizing: border-box;
    box-sizing: border-box;
    padding-left: 24px;
    padding-right: 18px;
    height: 32px;
    line-height: 32px;
    min-width: 180px;
    background-color: #fff;
    white-space: nowrap;
    &:hover {
      background-color: #e0e0e0;
    }
  }
}
</style>

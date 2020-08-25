<template>
  <div class="model-main">
    <div class="header">
      <span class="data_con">数据模型1</span>
      <div class="data_btn">
          <a-button type="primary" v-on:click="edit">编辑模型</a-button>
          <a-button>刷新数据</a-button>
      </div>
    </div>
    <div class="description">
        <span class="d-s">描述：-</span>
    </div>
    <div
      class="m-dml-map m-map"
    >
      <tree-node
        v-for="(item, index) in renderTables"
        :key="index"
        :node-data="item"
        title='tableName'
      ></tree-node>
    </div>
    <div class="detail">
      <div class="detail_header">
        <span>数据模型详情</span>
      </div>
      <div class="detail_main">
        <div class="dimensionality">
          <span class="dim_span">维度</span>
            <div class="dim_menu">
              <a-menu mode="inline">
                <a-sub-menu>
                  <span slot="title"><span>银行账户</span></span>
                  <a-menu-item>
                    <img
                      src="@/assets/images/icon_dimension.png"
                      style="width:15px;height:15px"
                    />
                    aaa
                  </a-menu-item>
                  <a-menu-item>
                    <img
                      src="@/assets/images/icon_dimension.png"
                      style="width:15px;height:15px"
                    />
                    bbb
                  </a-menu-item>
                </a-sub-menu>
                <a-sub-menu>
                  <span slot="title"><span>统计需求</span></span>
                  <a-menu-item>
                    <img
                      src="@/assets/images/icon_dimension.png"
                      style="width:15px;height:15px"
                    />
                    ccc
                  </a-menu-item>
                  <a-menu-item>
                    <img
                      src="@/assets/images/icon_dimension.png"
                      style="width:15px;height:15px"
                    />
                    ddd
                  </a-menu-item>
                </a-sub-menu>
              </a-menu>
            </div>
        </div>
        <div class="measurement">
          <span class="mea_span">度量</span>
            <div class="mea_menu">
              <a-menu mode="inline">
                <a-sub-menu>
                  <span slot="title"><span>银行账户</span></span>
                  <a-menu-item>
                    <img
                      src="@/assets/images/icon_measure.png"
                      style="width:15px;height:15px"
                    />
                    aaa
                  </a-menu-item>
                  <a-menu-item>
                    <img
                      src="@/assets/images/icon_measure.png"
                      style="width:15px;height:15px"
                    />
                    bbb
                  </a-menu-item>
                </a-sub-menu>
                <a-sub-menu>
                  <span slot="title"><span>统计需求</span></span>
                  <a-menu-item>
                    <img
                      src="@/assets/images/icon_measure.png"
                      style="width:15px;height:15px"
                    />
                    ccc
                  </a-menu-item>
                  <a-menu-item>
                    <img
                      src="@/assets/images/icon_measure.png"
                      style="width:15px;height:15px"
                    />
                    ddd
                  </a-menu-item>
                </a-sub-menu>
              </a-menu>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TreeNode from './show-tree-node'
import { Node, conversionTree } from '../../util'
export default {
  name: 'model-main',
  components: {
    TreeNode
  },
  data() {
    return {
      tables: [
        {
          tableId: 1,
          tableAlias: '总编',
          produced: 'Original',
          dataConnectionId: 700460682,
          tableName: '总编'
        },
        {
          tableId: 2,
          join: {
            conditions: [
              {
                left: '国家及地区',
                right: '国家及地区',
                leftTableId: 1,
                op: '='
              },
              {
                left: '平均年薪（美元）',
                right: '平均年薪（美元）',
                leftTableId: 1,
                op: '='
              }
            ],
            method: 'inner'
          },
          tableAlias: '工作表1',
          produced: 'Original',
          dataConnectionId: 700460682,
          tableName: '工作表1'
        },
        {
          tableId: 3,
          join: {
            conditions: [
              {
                left: '国家及地区',
                right: '国家及地区',
                leftTableId: 1,
                op: '='
              },
              {
                left: '平均年薪（美元）',
                right: '平均年薪（美元）',
                leftTableId: 1,
                op: '='
              }
            ],
            method: 'inner'
          },
          tableAlias: '工作表2',
          produced: 'Original',
          dataConnectionId: 700460682,
          tableName: '工作表2'
        },
        {
          tableId: 4,
          join: {
            conditions: [
              {
                left: '国家及地区',
                right: '国家及地区',
                leftTableId: 2,
                op: '='
              },
              {
                left: '平均年薪（美元）',
                right: '平均年薪（美元）',
                leftTableId: 2,
                op: '='
              }
            ],
            method: 'inner'
          },
          tableAlias: '工作表3',
          produced: 'Original',
          dataConnectionId: 700460682,
          tableName: '工作表3'
        },
        {
          tableId: 5,
          join: {
            conditions: [
              {
                left: '国家及地区',
                right: '国家及地区',
                leftTableId: 3,
                op: '='
              },
              {
                left: '平均年薪（美元）',
                right: '平均年薪（美元）',
                leftTableId: 3,
                op: '='
              }
            ],
            method: 'inner'
          },
          tableAlias: '工作表1',
          produced: 'Original',
          dataConnectionId: 700460682,
          tableName: '工作表1'
        }
      ],
      renderTables: []
    }
  },
  created() {
    const first = this.tables[0]
    const root = new Node(first)
    const node = this.handleConversionTree(root)
    this.renderTables.push(node)
  },
  methods: {
    edit() {
      this.$router.push('/dataSource/Model-Edit')
    },
    handleConversionTree(node) {
      conversionTree(node, this.tables.slice(1), 'tableId')
      return node
    }
  }
}
</script>

<style lang="styl" scoped>
  @import "./main.styl";
</style>

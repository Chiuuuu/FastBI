<template>
  <div class="model-main">
    <a-empty v-if="fileSelectId=== -1" class="main-empty">
      <span slot="description">请新建模型或者选中左侧模型</span>
    </a-empty>
    <template v-else>
      <a-spin :spinning="spinning">
        <div class="header">
          <span class="data_con">{{detailInfo.name}}</span>
          <div class="data_btn">
              <a-button type="primary" v-on:click="edit">编辑模型</a-button>
              <a-button @click="handleGetData">刷新数据</a-button>
          </div>
        </div>
        <div class="description">
            <span class="d-s">描述：{{detailInfo.description}}</span>
        </div>
        <div
          class="m-dml-map m-map"
        >
          <a-empty v-if="tablesEmpty" class="main-empty">
            <span slot="description">暂无数据</span>
          </a-empty>
          <template v-else>
            <tree-node
              v-for="(item, index) in renderTables"
              :key="index"
              :node-data="item"
              title='tableName'
            ></tree-node>
          </template>
        </div>
        <div class="detail">
          <div class="detail_header">
            <span>数据模型详情</span>
          </div>
          <div class="detail_main">
            <div class="dimensionality">
              <span class="dim_span">维度</span>
                <div class="dim_menu">
                  <a-menu mode="inline" v-for="(value, name) in dimensions" :key="name" :default-open-keys="[name]" :inline-collapsed="false">
                    <a-sub-menu :key="name">
                      <span slot="title"><span>{{name}}</span></span>
                      <a-menu-item v-for="item in value" :key="item.id">
                        <img
                          src="@/assets/images/icon_dimension.png"
                          style="width:15px;height:15px"
                        />
                        {{item.field}}
                      </a-menu-item>
                    </a-sub-menu>
                  </a-menu>
                </div>
            </div>
            <div class="measurement">
              <span class="mea_span">度量</span>
                <div class="mea_menu">
                  <a-menu mode="inline" v-for="(value, name) in measures" :key="name" :default-open-keys="[name]" :inline-collapsed="false">
                    <a-sub-menu :key="name">
                      <span slot="title"><span>{{name}}</span></span>
                      <a-menu-item v-for="item in value" :key="item.id">
                        <img
                          src="@/assets/images/icon_dimension.png"
                          style="width:15px;height:15px"
                        />
                        {{item.field}}
                      </a-menu-item>
                    </a-sub-menu>
                  </a-menu>
              </div>
            </div>
          </div>
        </div>
      </a-spin>
    </template>
  </div>
</template>

<script>
import TreeNode from './show-tree-node'
import { Node, conversionTree } from '../../util'
import { mapState } from 'vuex'
import groupBy from 'lodash/groupBy'
import {
  fetchModelInfoById
} from '@/api/dataModel/api'
export default {
  name: 'model-main',
  components: {
    TreeNode
  },
  data() {
    return {
      spinning: false, // 获取数据loading
      detailInfo: '', // 详情信息
      tablesEmpty: false, // 是否表为空
      dimensions: '', // 维度
      measures: '', // 度量
      // tables: [
      //   {
      //     tableId: 1,
      //     tableAlias: '总编',
      //     produced: 'Original',
      //     dataConnectionId: 700460682,
      //     tableName: '总编'
      //   },
      //   {
      //     tableId: 2,
      //     join: {
      //       conditions: [
      //         {
      //           left: '国家及地区',
      //           right: '国家及地区',
      //           leftTableId: 1,
      //           op: '='
      //         },
      //         {
      //           left: '平均年薪（美元）',
      //           right: '平均年薪（美元）',
      //           leftTableId: 1,
      //           op: '='
      //         }
      //       ],
      //       method: 'inner'
      //     },
      //     tableAlias: '工作表1',
      //     produced: 'Original',
      //     dataConnectionId: 700460682,
      //     tableName: '工作表1'
      //   },
      //   {
      //     tableId: 3,
      //     join: {
      //       conditions: [
      //         {
      //           left: '国家及地区',
      //           right: '国家及地区',
      //           leftTableId: 1,
      //           op: '='
      //         },
      //         {
      //           left: '平均年薪（美元）',
      //           right: '平均年薪（美元）',
      //           leftTableId: 1,
      //           op: '='
      //         }
      //       ],
      //       method: 'inner'
      //     },
      //     tableAlias: '工作表2',
      //     produced: 'Original',
      //     dataConnectionId: 700460682,
      //     tableName: '工作表2'
      //   },
      //   {
      //     tableId: 4,
      //     join: {
      //       conditions: [
      //         {
      //           left: '国家及地区',
      //           right: '国家及地区',
      //           leftTableId: 2,
      //           op: '='
      //         },
      //         {
      //           left: '平均年薪（美元）',
      //           right: '平均年薪（美元）',
      //           leftTableId: 2,
      //           op: '='
      //         }
      //       ],
      //       method: 'inner'
      //     },
      //     tableAlias: '工作表3',
      //     produced: 'Original',
      //     dataConnectionId: 700460682,
      //     tableName: '工作表3'
      //   },
      //   {
      //     tableId: 5,
      //     join: {
      //       conditions: [
      //         {
      //           left: '国家及地区',
      //           right: '国家及地区',
      //           leftTableId: 3,
      //           op: '='
      //         },
      //         {
      //           left: '平均年薪（美元）',
      //           right: '平均年薪（美元）',
      //           leftTableId: 3,
      //           op: '='
      //         }
      //       ],
      //       method: 'inner'
      //     },
      //     tableAlias: '工作表1',
      //     produced: 'Original',
      //     dataConnectionId: 700460682,
      //     tableName: '工作表1'
      //   }
      // ],
      renderTables: [] // 用来渲染树组件
    }
  },
  computed: {
    ...mapState({
      fileSelectId: state => state.dataModel.modelId
    })
  },
  methods: {
    /**
     * 获取数据
    */
    async handleGetData() {
      this.spinning = true
      this.renderTables = []
      const result = await fetchModelInfoById({
        url: '/admin/dev-api/datamodel/datamodelInfo/getDataModelInfo/' + this.fileSelectId
      }).finally(() => {
        this.spinning = false
      })

      if (result.data.code === 200) {
        this.$message.success('获取数据成功')
        this.detailInfo = result.data.data
        this.handleDetailWithRoot()
        this.handleDimensions()
        this.handleMeasures()
      } else {
        this.$message.error(result.data.msg)
      }
    },
    /**
     * 跳转编辑状态
    */
    edit() {
      // this.$router.push({ path: `/dataSource/Model-Edit/${this.fileSelectId}` })
      this.$router.push({
        name: 'modelEdit',
        query: {
          type: 'edit',
          dataConnectionId: this.fileSelectId
        }
      })
    },
    /**
     * 处理树形组件
    */
    handleDetailWithRoot() {
      if (this.detailInfo.config.tables.length === 0) {
        this.tablesEmpty = true
        return
      }
      this.tablesEmpty = false
      const first = this.detailInfo.config.tables[0]
      const root = new Node(first)
      const node = this.handleConversionTree(root)
      this.renderTables.push(node)
    },
    /**
     * 转换数据
    */
    handleConversionTree(node) {
      conversionTree(node, this.detailInfo.config.tables.slice(1), 'tableNo')
      return node
    },
    /**
     * 维度数据处理
    */
    handleDimensions() {
      console.log(groupBy(this.detailInfo.pivotSchema.dimensions, 'tableName'))
      this.dimensions = groupBy(this.detailInfo.pivotSchema.dimensions, 'tableName')
    },
    /**
     * 度量数据处理
    */
    handleMeasures() {
      console.log(groupBy(this.detailInfo.pivotSchema.measures, 'tableName'))
      this.measures = groupBy(this.detailInfo.pivotSchema.measures, 'tableName')
    }
  }
}
</script>

<style lang="styl" scoped>
  @import "./main.styl";
</style>

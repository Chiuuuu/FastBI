<template>
  <div class="model-main">
    <a-empty v-if="modelId=== -1" class="main-empty">
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
        <a-divider />
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
              title='name'
            ></tree-node>
          </template>
        </div>
        <a-divider />
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
                      <span slot="title"><span>{{value[0].name}}</span></span>
                      <a-menu-item v-for="item in value" :key="item.id">
                        <img
                          src="@/assets/images/icon_dimension.png"
                          style="width:15px;height:15px"
                        />
                        {{item.name}}
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
                      <span slot="title"><span>{{value[0].name}}</span></span>
                      <a-menu-item v-for="item in value" :key="item.id">
                        <img
                          src="@/assets/images/icon_measure.png"
                          style="width:15px;height:15px"
                        />
                        {{item.name}}
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
      renderTables: [] // 用来渲染树组件
    }
  },
  computed: {
    ...mapState({
      modelId: state => state.dataModel.modelId,
      datasourceId: state => state.dataModel.datasourceId
    })
  },
  methods: {
    /**
     * 获取数据
    */
    async handleGetData(id) {
      this.spinning = true
      this.renderTables = []
      let modelId = ''
      if (typeof id === 'string') {
        modelId = id
      } else {
        modelId = this.modelId
      }
      const result = await this.$server.dataModel.getDataModelDetailInfo(modelId)
        .finally(() => {
          this.spinning = false
        })

      if (result.code === 200) {
        this.$message.success('获取数据成功')
        this.detailInfo = result.data
        this.handleDetailWithRoot()
        this.handleDimensions()
        this.handleMeasures()
      } else {
        this.$message.error(result.msg)
      }
    },
    /**
     * 编辑时根据modelId获取数据源
     */
    async handleGetDataSource() {
      // 第一个数据库id
      const datsource = await this.$server.dataModel.getDataSourceList(this.modelId)
      console.log('根据modelId获取数据源', datsource)
      this.$store.dispatch('dataModel/setDatasourceId', datsource.data[0].datasourceId)
      return datsource.data[0].datasourceId
    },
    /**
     * 跳转编辑状态
    */
    edit() {
      // this.$router.push({ path: `/dataSource/Model-Edit/${this.modelId}` })
      this.handleGetDataSource()
        .then(id => {
          this.$router.push({
            name: 'modelEdit',
            query: {
              type: 'edit',
              datasourceId: id,
              modelId: this.modelId
            }
          })
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
      console.log(groupBy(this.detailInfo.pivotSchema.dimensions, 'tableNo'))
      this.dimensions = groupBy(this.detailInfo.pivotSchema.dimensions, 'tableNo')
    },
    /**
     * 度量数据处理
    */
    handleMeasures() {
      console.log(groupBy(this.detailInfo.pivotSchema.measures, 'tableNo'))
      this.measures = groupBy(this.detailInfo.pivotSchema.measures, 'tableNo')
    }
  }
}
</script>

<style lang="styl" scoped>
  @import "./main.styl";
</style>

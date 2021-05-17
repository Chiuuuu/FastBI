<template>
  <div class="model-map">
    <header>数据模型鸟瞰图</header>
    <canvas class="canvas-area" ref="treeMap"></canvas>
  </div>
</template>

<script>
import echarts from 'echarts'
import { mapState } from 'vuex'
import debounce from 'lodash/debounce'
export default {
  name: 'modelMap',
  data() {
    return {
      chart: {}
    }
  },
  computed: {
    ...mapState({
      modelList: (state) => state.modelMange.menuList
    })
  },
  async mounted() {
    window.addEventListener('resize', this.handleResize)
    this.init()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    // 窗口缩放事件
    handleResize: debounce(function() {
      echarts.dispose(this.chart)
      this.init()
    }, 300),
    async init() {
      // 渲染画布
      const container = this.$refs.treeMap
      const height = container.clientHeight
      const width = container.clientWidth
      this.chart = echarts.init(container, {}, { width, height })

      // 处理data数据
      const imgUrl = require('@/assets/images/model-item.png')
      const data = []
      this.modelList.map((node, index) => {
        if (node.fileType === 1) {
          data.push({
            id: node.id,
            name: node.name,
            symbol: 'image://' + imgUrl,
            symbolSize: 60
          })
        } else {
          node.children.map((item) => {
            data.push({
              id: item.id,
              name: item.name,
              symbol: 'image://' + imgUrl,
              symbolSize: 60
            })
          })
        }
      })
      console.log(data)
      // 渲染图
      this.chart.setOption({
        darkMode: true,
        backgroundColor: '#151a3f',
        series: [
          {
            name: 'model list map',
            type: 'graph',
            layout: 'force',
            data,
            edges: {},
            roam: true,
            label: {
              position: 'bottom',
              fontSize: 16,
              color: '#13d7b7',
              show: true
            },
            force: {
              repulsion: 500
            }
          }
        ]
      })

      // 注册点击事件(用于跳转至模型详情界面)
      this.chart.on('click', 'series.graph.data', ({ data }) => {
        this.navigateToModelEdit(data.id)
      })
    },
    /**
     * 编辑时根据modelId获取数据源
     */
    async handleGetDataSource(modelId) {
      // 第一个数据库id
      const datsource = await this.$server.dataModel.getDataSourceList(modelId)
      return datsource.data[0].datasourceId
    },
    /**
     * 跳转至编辑状态
     */
    navigateToModelEdit(modelId) {
      this.handleGetDataSource(modelId).then((id) => {
        this.$router.push({
          name: 'mangeModelEdit',
          query: {
            type: 'edit',
            datasourceId: id,
            modelId: modelId
          }
        })
      })
    }
  }
}
</script>

<style scoped>
.model-map {
  height: 100%;
  flex: 1;
}
header {
  height: 50px;
  line-height: 50px;
  text-align: center;
  background: #151a3f;
  font-size: 24px;
  font-weight: 700;
  color: #13d7b7;
  border-bottom: 1px solid #3dbdcb;
}
.canvas-area {
  height: calc(100% - 51px);
  width: 100%;
}
</style>

<template>
  <div class="drag-list-menu">
    <div class="list-group" :class="{'hovered':category.hovered}"
        v-for="category in dragList"
        :key="category.type"
    >
      <div class="list-group-header" flex="dir:top"
          @mouseenter="category.hovered=true" @mouseleave="category.hovered=false">
        <!-- <b-icon v-if="category.icon" :name="category.icon" size="18"></b-icon> -->
        <a-icon  v-if="category.icon" :type="category.icon" style="font-size:18px;" />
        <span>{{ category.title }}</span>
      </div>
      <div class="list-group-body" flex v-show="category.hovered" @mouseenter="category.hovered=true" @mouseleave="category.hovered=false">
        <!-- 列表左侧 -->
        <div class="left"><span>{{ category.title }}</span></div>
        <div class="right">
          <div
            class="list-item"
            v-for="component in category.children"
            :key="component.chartType"
            :name="component.name"
            draggable="true"
            @click="handleAdd(component, $event)"
            @dragstart="handleDragStart(component, $event)"
          >
            <!-- <div class="img" :class="component.name"></div> -->
            <div class="front">
              <!-- <b-icon :name="component.icon"></b-icon> -->
              <a-icon :type="component.icon"></a-icon>
              <span> {{ component.title }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapActions } from 'vuex' // 导入vuex
  export default {
    name: 'DragList',
    props: {
      dragList: {
        type: Array,
        default () {
          return []
        }
      }
    },
    data () {
      return {
        hovered: false
      }
    },
    mounted() {
    },
    methods: {
      ...mapActions(['saveScreenData']),
      // 拖拽图表添加到大屏
      handleDragStart (component, event) {
        component.api_data.dimensions = []
        component.api_data.measures = []
        component.api_data.tableList = []
        component.api_data.options = null
        component.api_data.refresh = {}
        component.api_data.modelId = ''
        if (component.chartType === 'v-ring') {
          component.config.chartTitle.text = '70%'
        }
        this.$print('drag start:' + component.name, 'primary')
        // 拖拽的节点数据
        let nodeInfo = {
          // 唯一标识
          // id: 'node-' + ((new Date()).getTime()),
          id: (new Date()).getTime(),
          packageJson: { ...component }
        }
        event.dataTransfer.setData('node', JSON.stringify(nodeInfo))
        this.$print('drag nodeInfo', 'success')
        this.$print(nodeInfo)
      },
      // 点击图表添加到大屏
      handleAdd(component) {
        console.log(component)
        component.api_data.dimensions = []
        component.api_data.measures = []
        component.api_data.tableList = []
        component.api_data.options = null
        component.api_data.refresh = {}
        component.api_data.modelId = ''
        if (component.chartType === 'v-ring') {
          component.config.chartTitle.text = '70%'
        }
        // 拖拽的节点数据
        let nodeInfo = {
          // 唯一标识
          // id: 'node-' + ((new Date()).getTime()),
          id: (new Date()).getTime(),
          packageJson: { ...component }
        }
        this.$store.dispatch('AddCanvasMap', nodeInfo)
        this.saveScreenData()
      }
    }
  }
</script>

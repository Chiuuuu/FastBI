<template>
  <div class="drag-list-menu">
    <div
      class="list-group"
      :class="{ hovered: category.hovered }"
      v-for="category in dragList"
      :key="category.type"
    >
      <div
        class="list-group-header"
        flex="dir:top"
        @mouseenter="initTabChildren(category)"
        @mouseleave="category.hovered = false"
      >
        <!-- <b-icon v-if="category.icon" :name="category.icon" size="18"></b-icon> -->
        <a-icon
          v-if="category.icon"
          :type="category.icon"
          style="font-size:18px;"
        />
        <span>{{ category.title }}</span>
      </div>
      <div
        class="list-group-body"
        flex
        v-show="category.hovered"
        @mouseenter="category.hovered = true"
        @mouseleave="category.hovered = false"
      >
        <!-- 列表左侧 -->
        <div class="left">
          <div
            v-for="(tab, index) in category.tabs"
            :key="tab.title"
            :class="{ selected: index === selectedIndex }"
            @mouseover="selectTab(index)"
          >
            {{ tab.title }}
          </div>
        </div>
        <div class="right">
          <!--素材库-->
          <div v-if="category.type === 'Base'" class="material">
            <div
              class="material-box"
              v-for="component in category.tabs[selectedIndex].children"
              :key="component.key"
            >
              <p class="material-text">
                {{ component.imgName }}
              </p>
              <img
                class="material-img"
                :src="component.url"
                alt="test"
                draggable="true"
                @click="handleAddForMaterial(component, $event)"
                @dragstart="handleDragStartForMaterial(component, $event)"
              />
            </div>
          </div>
          <!--控件-->
          <div
            v-else
            class="list-item"
            v-for="component in category.tabs[0].children"
            :key="component.chartType"
            :name="component.name"
            draggable="true"
            @click="handleAdd(component, $event)"
            @dragstart="handleDragStart(component, $event)"
          >
            <div class="front">
              <img
                style="width:18px;heigth:18px;"
                :src="require(`@/assets/images/chart/${component.icon}`)"
              />
              <span> {{ component.title }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <map-type-view
      :visible="visible"
      @ok="handleOk"
      @close="visible = false"
    ></map-type-view>
  </div>
</template>

<script>
import { mapActions } from 'vuex' // 导入vuex
import { Icon } from 'ant-design-vue'
import MapTypeView from './components/map-type-view.vue'

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_2276651_71nv5th6v94.js'
}) // 引入iconfont
export default {
  name: 'DragList',
  props: {
    dragList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      hovered: false,
      visible: false,
      com: {},
      selectedIndex: 0, // 当前选择的页签,只对多个页签生效
      materialList: [] // 预留素材库页签子列表
    }
  },
  computed: {
    regionList() {
      if (this.mapType === 2) {
        return this.provinceList
      }
      if (this.mapType === 3) {
        return this.cityList
      }
      return []
    }
  },
  mounted() {},
  methods: {
    ...mapActions(['addChartData', 'saveScreenData']),
    // 拖拽图表添加到大屏
    handleDragStart(component, event) {
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
        id: new Date().getTime(),
        setting: { ...component }
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
        // id: (new Date()).getTime(),
        tabId: this.$route.query.tabId,
        setting: { ...component }
      }
      // todo: 地图选择类型弹窗
      if (component.chartType === 'v-map') {
        this.com = nodeInfo
        this.visible = true
        return
      }
      this.addChartData(nodeInfo)
    },
    handleOk() {
      this.visible = false
      this.addChartData(this.com)
    },
    // 点击头部菜单默认选择第一个页签
    initTabChildren(category) {
      category.hovered = true
      this.selectedIndex = 0
    },
    // 切换子列表
    selectTab(index) {
      this.selectedIndex = index
    },
    // 添加素材
    handleAddForMaterial(component) {
      let nodeInfo = {
        tabId: this.$route.query.tabId,
        setting: { ...component }
      }
      this.addChartData(nodeInfo)
    },
    handleDragStartForMaterial(component) {
      // 拖拽的节点数据
      let nodeInfo = {
        id: new Date().getTime(),
        setting: { ...component }
      }
      event.dataTransfer.setData('node', JSON.stringify(nodeInfo))
    }
  },
  components: { MapTypeView }
}
</script>

<template>
  <div class="map-setting-style">
    <div class="header">地图数据配置</div>
    <!-- tab栏 -->
    <div class="tab-list">
      <div
        :class="['tab-list-item', { active: activeTab === item.tabKey }]"
        :style="{ width: (100 / tabList.length) + '%' }"
        v-for="item in tabList"
        :key="item.tabKey"
        @click="handleTab(item)">{{ item.text }}</div>
    </div>
    <!-- tab页动态内容 -->
    <component :is="activeComponent" class="tab-content scrollbar"></component>
  </div>
</template>

<script>
import TabData from './tabContent/tabData'
import TabStyle from './tabContent/tabStyle'
export default {
  name: 'mapStyle',
  components: {
    TabData,
    TabStyle
  },
  data() {
    return {
      activeTab: 0,
      activeComponent: 'tab-data',
      tabList: [
        { text: '数据', tabKey: 0, component: 'tab-data' },
        { text: '样式', tabKey: 1, component: 'tab-style' }
      ]
    }
  },
  methods: {
    handleTab(item) {
      this.activeTab = item.tabKey
      this.activeComponent = item.component
    }
  }
}
</script>

<style lang="less" scoped>
@theme-color: #627cff;
@border-color: #d8d8d8;
.map-setting-style {
  float: left;
  width: 278px;
  height: 100%;
  border-left: 1px solid #efefef;

  .header {
    height: 40px;
    line-height: 40px;
    text-align: center;
    border-bottom: 1px solid @border-color;
  }

  .tab-list {
    width: 100%;
    height: 40px;
    background: @theme-color;
  }
  .tab-list-item {
    float: left;
    height: 40px;
    line-height: 38px;
    text-align: center;
    color: #fff;
    background: @theme-color;
    border-top: 2px solid @theme-color;
    cursor: pointer;
    &.active {
      color: inherit;
      background: #fff;
    }
  }

  .tab-content {
    height: calc(100% - 100px);
    width: 100%;
    overflow-y: auto;
    margin: 10px 0;
  }
}
</style>

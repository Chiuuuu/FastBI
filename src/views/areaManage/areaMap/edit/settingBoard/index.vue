<template>
  <div class="map-setting-board" v-show="visible">
    <MapStyle />
    <MapSource @close="$emit('update:visible', false)" />
  </div>
</template>

<script>
import MapSource from './mapSource.vue'
import MapStyle from './mapStyle.vue'
export default {
  name: 'areaMapSettingBoard',
  provide() {
    return {
      settingInstance: this
    }
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  components: {
    MapSource,
    MapStyle
  },
  data() {
    return {
      dragField: {}, // 拖动的字段
      setting: {
        area: {
          nameData: null, // 片区字段
          infoList: [], // 片区信息字段
          // 鼠标移入
          tooltip: false,
          tooltipList: []
        },
        dot: {
          longitude: null, // 经度字段
          latitude: null, // 纬度字段
          infoList: [], // 标记点信息字段
          // 鼠标移入
          tooltip: false,
          tooltipList: []
        }
      }
    }
  },
  methods: {

  }
}
</script>

<style lang="less" scoped>
/* 数据源配置面板 */
.map-setting-board {
  position: absolute;
  right: 0;
  top: 48px;
  z-index: 999;
  width: 500px;
  height: calc(100% - 48px);
  overflow: hidden;
  background: #fff;
  border: 1px solid #efefef;
}
</style>

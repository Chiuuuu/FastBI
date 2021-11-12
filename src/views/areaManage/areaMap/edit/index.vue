<template>
  <div class="map-container">
    <div class="map-header">
      <span>编辑片区地图</span>
      <a-button class="map-header-btn" type="primary" @click="handleSave"
        >退出编辑</a-button
      >
      <a-button class="map-header-btn" @click="handleFullScreen">预览</a-button>
      <!-- <a-button class="map-header-btn" type="primary" @click="handleSetSource">配置数据源</a-button> -->
    </div>
    <MapArea ref="MapArea" mode="edit" />
    <SettingBoard :visible.sync="showSetting" />
  </div>
</template>

<script>
import SettingBoard from './settingBoard'
import MapArea from '../mapArea'
export default {
  name: 'areaEdit',
  components: {
    SettingBoard,
    MapArea
  },
  data() {
    return {
      showSetting: false, // 显示配置面板
      fullScreen: false
    }
  },
  mounted() {
    // 监听全屏事件
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy() {
    // 监听全屏事件
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    // 点击配置数据源
    handleSetSource() {
      this.showSetting = true
    },
    handleResize() {
      this.fullScreen = this.checkFull()
    },
    checkFull() {
      let isFull =
        window.fullScreen ||
        document.webkitIsFullScreen ||
        document.msFullscreenEnabled
      if (isFull === undefined) {
        isFull = false
      }
      return isFull
    },
    // 点击全屏按钮
    handleFullScreen() {
      if (this.$refs.MapArea && this.$refs.MapArea.showEdit) {
        return this.$message.error('请先结束当前片区编辑')
      }
      const docElm = document.querySelector('#mapArea')
      if (docElm) {
        if (docElm.requestFullscreen) {
          // W3C
          docElm.requestFullscreen()
        } else if (docElm.mozRequestFullScreen) {
          // FireFox
          docElm.mozRequestFullScreen()
        } else if (docElm.webkitRequestFullScreen) {
          // Chrome等
          docElm.webkitRequestFullScreen()
        } else if (docElm.msRequestFullscreen) {
          // IE11
          docElm.msRequestFullscreen()
        }
      }
    },
    handleSave() {
      this.$router.push({ name: 'areaPreview' })
    }
  }
}
</script>

<style lang="less" scoped>
@import url('../main');
</style>

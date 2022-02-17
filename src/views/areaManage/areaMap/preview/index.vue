<template>
  <div class="map-container">
    <div class="map-header">
      <span>片区地图</span>
      <a-button class="map-header-btn" @click="handleFullScreen">全屏</a-button>
      <a-button v-if="hasEditPermission" class="map-header-btn" type="primary" @click="toEdit"
        >编辑</a-button
      >
    </div>
    <MapArea mode="preview" />
  </div>
</template>

<script>
import { checkActionPermission } from '@/utils/permission'
import MapArea from '../mapArea'
export default {
  name: 'areaPreview',
  components: {
    MapArea
  },
  computed: {
    hasEditPermission() {
      return checkActionPermission(this.$PERMISSION_CODE.OBJECT.areaMap, this.$PERMISSION_CODE.OPERATOR.edit)
    }
  },
  data() {
    return {}
  },
  methods: {
    // 点击全屏按钮
    handleFullScreen() {
      const docElm = document.querySelector('#map')
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
    // 点击编辑按钮
    toEdit() {
      this.$router.push({ name: 'areaEdit' })
    }
  }
}
</script>

<style lang="less" scoped>
@import url('../main');
</style>

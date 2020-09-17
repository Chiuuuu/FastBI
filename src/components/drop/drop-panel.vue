<template>
  <!--这里默认组织画布的右键点击事件 后期加在拖拽区块上-->
  <div class="drop-panel"
      @drop.stop.prevent="handleDropOnCanvas($event)"
      @dragover.stop.prevent>
    <slot>
    </slot>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex' // 导入vuex

  export default {
    name: 'DropPanel',
    computed: {
      ...mapGetters(['canvasMap', 'pageSettings', 'screenId'])
    },
    methods: {
      ...mapActions(['saveScreenData']),
      // 元素drop
      handleDropOnCanvas: function (event) {
        // 获取节点数据
        let nodeInfo = JSON.parse(event.dataTransfer.getData('node'))
        nodeInfo = {
          id: '',
          ...nodeInfo
        }
        console.log(nodeInfo)
        // 获取drop事件
        // let offsetX = event.offsetX
        // let offsetY = event.offsetY
        // let style = {
        //   position: 'absolute',
        //   left: offsetX + 'px',
        //   top: offsetY + 'px'
        // }

        this.$store.dispatch('AddCanvasMap', nodeInfo)
        this.saveScreenData()
      }
    }
  }
</script>

<style lang="stylus" scoped>
.drop-panel{
}
</style>

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
  import { addCanvasMap } from '../../api/canvasMaps/canvas-maps-request'
  import { mapGetters } from 'vuex' // 导入vuex

  export default {
    name: 'DropPanel',
    computed: {
      ...mapGetters(['canvasMap', 'pageSettings', 'screenId'])
    },
    methods: {
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

        // this.$store.dispatch('AddCanvasMap', nodeInfo)
        this.canvasMap.push(nodeInfo)
        let params = {
          json: {
            setting: this.pageSettings,
            components: this.canvasMap
          }
        }
        if (!this.screenId) {
          params.id = -1
          params.name = this.$route.query.name
          params.parentId = this.$route.query.parentId
        } else {
          params.id = this.screenId
        }
        this.$server.screenManage.screenSave(params).then(res => {
          if (res.data.code === 200) {
            this.$store.dispatch('SetScreenId', res.data.id)
          } else {
            this.$message.error(res.data.msg)
          }
        })
      }
    }
  }
</script>

<style lang="stylus" scoped>
.drop-panel{
}
</style>

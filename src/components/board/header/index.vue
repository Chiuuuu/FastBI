<template>
  <div class="board-header" flex>
    <div class="header-title">
      <span style="font-size:18px;margin-top:10px">电视统计大屏</span>
      <!-- <i class="el-icon-arrow-left" style="margin-left:20px;font-size:22px;cursor: pointer;margin-top:8px"></i> -->
      <!-- <span v-if="config.title">{{ config.title.text }}</span> -->
    </div>
    <div class="control" flex-box="1">
      <slot>control box</slot>
    </div>
    <div class="right-box">
        <div class="item" flex="dir:top">
          <a-icon
            type="mobile"
            style="font-size:18px"
          />
          <span> 手机端</span>
        </div>
        <div class="item" flex="dir:top" @click.stop="refreshData">
          <a-icon
            type="sync"
            style="font-size:18px"
          />
          <span> 刷新</span>
        </div>
        <div class="item" flex="dir:top">
          <a-icon
            type="block"
            @click.native="openScreen"
            style="font-size:18px"
          />
          <span> 预览</span>
        </div>
        <div class="item" flex="dir:top" @click="screenSave">
          <a-icon type="save" style="font-size:18px" />
          <span> 保存</span>
        </div>
        <div class="item" flex="dir:top" @click="goBack">
          <a-icon
            type="close"
            style="font-size:18px"
          />
          <span> 关闭</span>
        </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'BoardHeader',
  props: {
    config: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      userId: ''
    }
  },
  computed: {
    ...mapGetters(['isScreen', 'pageSettings', 'canvasMap'])
  },
  created() {
    this.userId = 'dv1e443967LZP2Dj'
  },
  methods: {
      // 计算缩放比例
      resize_window() {
          let wheight = Number(document.documentElement.clientHeight / 1080)
          this.scalseNum = wheight
      },
      goBack() {
        this.$router.go(-1)
      },
      // 打开全屏
      openScreen () {
        this.$store.dispatch('SetIsScreen', true)
        // this.$router.push({ name: 'screen', params: { id: this.userId } })
        this.$nextTick(() => {
          var docElm = document.querySelector('.dv-screen')
          if (docElm) {
            if (docElm.requestFullscreen) { // W3C
              docElm.requestFullscreen()
            } else if (docElm.mozRequestFullScreen) { // FireFox
                docElm.mozRequestFullScreen()
            } else if (docElm.webkitRequestFullScreen) { // Chrome等
                docElm.webkitRequestFullScreen()
            } else if (docElm.msRequestFullscreen) { // IE11
                docElm.msRequestFullscreen()
            }
          }
        })
      },
      // 保存大屏
      screenSave() {
        const screenObj = {
          setting: this.pageSettings,
          components: this.canvasMap
        }
        let params = {}
        if (this.$route.query.parentId) { // 新增大屏保存
          params = {
            id: -1,
            json: JSON.stringify(screenObj),
            name: this.$route.query.name,
            parentId: this.$route.query.parentId
          }
        } else { // 编辑大屏保存
          params = {
            id: this.$route.query.id,
            json: JSON.stringify(screenObj)
          }
        }
        this.$server.screenManage.screenSave(params).then(res => {

        })
      },
      // 刷新大屏
      refreshData() {
        console.log(111)
        let params = {
          id: this.$route.query.id
        }
        this.$server.screenManage.screenRefresh(params).then(res => {

        })
      }
    }
}
</script>

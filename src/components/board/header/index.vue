<template>
  <div class="board-header" flex>
    <div class="header-title">
      <span style="font-size:18px;margin-top:10px">{{fileName}}</span>
      <!-- <i class="el-icon-arrow-left" style="margin-left:20px;font-size:22px;cursor: pointer;margin-top:8px"></i> -->
      <!-- <span v-if="config.title">{{ config.title.text }}</span> -->
    </div>
    <div class="control" flex-box="1">
      <slot>control box</slot>
    </div>
    <div class="right-box">
        <!-- <div class="item" flex="dir:top">
          <a-icon
            type="mobile"
            style="font-size:18px"
          />
          <span> 手机端</span>
        </div> -->
        <div class="item" flex="dir:top" @click.stop="refreshData">
          <a-icon
            type="sync"
            style="font-size:18px"
          />
          <span> 刷新</span>
        </div>
        <div class="item" flex="dir:top" @click.stop="openScreen">
          <a-icon
            type="block"
            style="font-size:18px"
          />
          <span> 预览</span>
        </div>
        <div class="item" flex="dir:top" @click.stop="saveScreenData({mes: '保存成功'})">
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
import { mapGetters, mapActions } from 'vuex'
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
      fileName: '', // 大屏名称
      userId: ''
    }
  },
  computed: {
    ...mapGetters(['isScreen', 'pageSettings', 'canvasMap', 'screenId'])
  },
  created() {
    if (this.$route.query.name) {
      this.fileName = this.$route.query.name
    }
    this.userId = 'dv1e443967LZP2Dj'
  },
  methods: {
      ...mapActions(['saveScreenData']),
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
      // 刷新大屏
      refreshData() {
        if (!this.screenId) {
          this.$message.error('暂无数据可刷新，请先添加数据')
          return
        }
        let params = {
          id: this.screenId
        }
        this.$server.screenManage.actionRefreshScreen({ params }).then(res => {
          if (res.code === 200) {
            let screenDataList = res.data.screenDataList
            for (let item of screenDataList) {
              for (let item2 of this.canvasMap) {
                if (item2.id === item.id) {
                  item2.packageJson.api_data.source.rows = item2.value
                }
              }
            }
            this.refresh = true // 刷新按钮
            this.saveScreenData()
            this.$message.success('刷新成功')
          }
        })
      }
    }
}
</script>

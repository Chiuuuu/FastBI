<template>
  <div class="board-header" flex>
    <div class="header-title">
      <!-- <span style="font-size:18px;margin-top:10px">{{fileName}}</span> -->
      <!-- <a-input placeholder="请输入大屏标题" v-model="fileName" style="border:none;background:none;color:#fff;" /> -->
      <!-- <i class="el-icon-arrow-left" style="margin-left:20px;font-size:22px;cursor: pointer;margin-top:8px"></i> -->
      <!-- <span v-if="config.title">{{ config.title.text }}</span> -->
      <span v-if="!isFocus">{{screenName}}</span>
      <input class="header-title-text" :maxLength="20" :autofocus="isFocus"
        :class="isFocus?'focus':'nofocus'" type="text" v-model="screenName"
        @focus="onfocus" @blur="onBlur" >
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
        <!-- <div class="item" flex="dir:top" @click.stop="saveScreenData({mes: '保存成功', callback:goBack})">
          <a-icon type="save" style="font-size:18px" />
          <span> 保存并关闭</span>
        </div> -->
        <div class="item" flex="dir:top" @click="goBack">
          <a-icon
            type="close"
            style="font-size:18px"
          />
          <span> 保存并关闭</span>
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
      screenName: '', // 大屏名称
      isFocus: false, // 大屏名称是否聚焦
      screenData: null
    }
  },
  computed: {
    ...mapGetters(['isScreen', 'pageSettings', 'canvasMap', 'screenId', 'fileName', 'parentId'])
  },
  watch: {
    '$attrs'(val) {
      this.screenData = val
    }
  },
  mounted() {
    this.screenName = this.screenData ? this.screenData.name : this.$route.query.name
    // this.screenName = this.fileName
    // this.screenName = this.$route.query.name
  },
  methods: {
      ...mapActions(['saveScreenData']),
      goBack() {
        this.$router.go(-1)
      },
      onfocus() {
        this.isFocus = true
      },
      onBlur() {
        if (this.screenName === '') {
          this.screenName = this.fileName
          return
        }
        this.isFocus = false
        let params = {
          fileType: 1,
          id: this.screenId,
          name: this.screenName,
          parentId: this.$route.query.parentId
        }
        this.$server.common.putMenuFolderName('/screen/catalog', params).then(res => {
          if (res.code === 200) {
            this.screenName = res.data
            this.$store.dispatch('SetFileName', this.screenName)
            this.saveScreenData()
            console.log('修改大屏名称')
          } else {
            this.$message.error(res.msg)
            return false
          }
        })
      },
      // 打开全屏
      openScreen () {
        this.$store.dispatch('SetIsScreen', true)
        // 位置在screen.vue,对应画板元素
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
                  item2.packageJson.api_data.source.rows = item.value
                }
              }
            }
            this.refresh = true // 刷新按钮
            this.saveScreenData()
            this.$message.success('刷新成功')
          } else {
            res.msg && this.$message.error(res.msg)
          }
        })
      }
    }
}
</script>

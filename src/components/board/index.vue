<template>
  <div class="board-layout">
    <!--顶部操作栏-->
    <board-header :config="config.header" v-if="config.header" v-bind="$attrs">
      <slot name="headerBox"></slot>
    </board-header>
    <!--中间工作区-->
    <div class="center-box" flex>
      <!--左侧图层列表-->
      <board-coverage
        :config="config.coverage"
        v-if="config.coverage"
        @toggleCollapsed="ToggleCoverageExpand"
      >
        <slot name="coverage"></slot>
      </board-coverage>
      <!--中间画板区域-->
      <div class="board-center" :style="centerStyle">
        <canvas-main>
          <slot name="canvas"></slot>
        </canvas-main>
        <board-options
          v-if="config.options"
          :config="config.options"
          @on-toggle="ToggleOptionsExpand"
        ></board-options>
      </div>
      <!-- 右侧数据模型列表 -->
      <board-model
        :config="config.model"
        v-if="config.model"
        @on-toggle="ToggleModelExpand"
        @getErrorData="getErrorData"
      >
        <slot name="model"></slot>
      </board-model>
    </div>
    <!--右键菜单-->
    <context-menu @showPush="showPush"></context-menu>
    <!--创建推送弹窗-->
    <a-modal v-model="visible" title="图表推送" @ok="shareChart">
      <div class="releace-box">
        <div class="releace-line">
          <span class="label">推送时间：</span>
          <a-radio-group v-model="shareObj.pushTime">
            <a-radio :value="0">立即推送</a-radio>
            <a-radio :value="1">定时推送</a-radio>
            <!-- 定时推送时间 -->
            <el-date-picker
              v-show="shareObj.pushTime === 1"
              v-model="shareObj.time"
              :picker-options="pickerOptions"
              type="datetime"
              style="width:200px"
              laceholder="请选择推送时间"
            >
            </el-date-picker>
          </a-radio-group>
        </div>
        <div class="releace-line">
          <span class="label">推送人：</span>
          <a-select
            placeholder="选择推送人"
            style="width:310px"
            v-model="shareObj.pusher"
          >
            <a-select-option
              v-for="(item, index) in userList"
              :key="index"
              :value="item.id"
              >{{ item.name }}</a-select-option
            >
          </a-select>
        </div>
        <div class="releace-line">
          <span class="label">是否加水印：</span>
          <a-radio-group v-model="shareObj.watermark">
            <a-radio :value="1">是</a-radio>
            <a-radio :value="0">否</a-radio>
          </a-radio-group>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
// 默认配置信息
import config from '../../config/board'
import BoardHeader from './header/index' // 头部
import BoardCoverage from './coverage/index' // 左侧栏(图层)
import BoardOptions from './options/index' // 右侧栏(页面配置)
import CanvasMain from './canvas' // 中间画板
import ContextMenu from './context-menu/index' // 右键菜单
import BoardModel from './model/index' // 8-14 新增数据模型
import { mapGetters, mapActions, mapState } from 'vuex'
// 引入截图工具
import html2canvas from 'html2canvas'
import moment from 'moment'

const prefixCls = 'board'
export default {
  name: 'Board',
  data() {
    return {
      prefixCls: prefixCls,
      config: config,
      errorData: '',
      visible: false, // 推送弹窗
      shareObj: {}, // 推送信息
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      userList: [] // 推送人列表
    }
  },
  provide() {
    return {
      errorFile: this.errorData
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.info,
      selectProject: state => state.user.selectProject
    }),
    ...mapGetters([
      'optionsExpand',
      'coverageExpand',
      'modelExpand',
      'currentSelected',
      'currSelected',
      'echartsInstance',
      'fileName',
      'canvasRange',
      'pageSettings'
    ]),
    centerStyle() {
      return {
        left: this.coverageExpand ? this.config.coverage.style.width : '50px',
        // right: this.optionsExpand ? this.config.options.style.width : '0'
        right: this.modelExpand ? this.config.model.style.width : '50px'
      }
    }
  },
  watch: {
    // 检测图层面板是否打开
    coverageExpand(val) {
      if (val) {
        this.config.coverage.style.width = '180px'
        this.config.coverage.style.flex = '0 0 180px'
      } else {
        this.config.coverage.style.width = '50px'
        this.config.coverage.style.flex = '0 0 50px'
      }
    }
  },
  methods: {
    ...mapActions([
      'ToggleOptionsExpand',
      'ToggleCoverageExpand',
      'ToggleModelExpand',
      'HideContextMenu'
    ]),
    getErrorData(error) {
      this.errorData = error
    },
    // disabledDate(current) {
    //   return current && current < moment().endOf('hour')
    // },
    // 显示推送弹窗
    showPush() {
      this.shareObj = {
        pushTime: 0,
        pusher: this.userInfo.id,
        watermark: 1,
        time: null
      }
      // 获取推送人列表
      this.$server.screenManage.getPusherList(this.selectProject).then(res => {
        if (res.code === 200) {
          this.userList = res.rows
        } else {
          this.$message.error(res.msg)
        }
      })
      this.userList = this.visible = true
      this.HideContextMenu()
    },
    // 推送
    shareChart() {
      if (!this.shareObj.pusher) {
        this.$message.error('请输入推送人')
        return
      }
      if (this.shareObj.pushTime === 1 && !this.shareObj.time) {
        this.$message.error('请输入推送时间')
        return
      }
      if (
        this.shareObj.pushTime === 1 &&
        this.shareObj.time.getTime() <= Date.now()
      ) {
        this.$message.error('推送时间不能小于此刻')
        return
      }
      const domObj = document.getElementById(this.currentSelected)
      let transparent = false
      // 透明背景用大屏背景作为背景色
      if (!domObj.style.backgroundColor) {
        transparent = true
        domObj.style.backgroundColor = this.pageSettings.backgroundColor
      }
      // 添加文字间距，防止截图文字重叠
      domObj.childNodes[0].style.letterSpacing =
        this.currSelected.setting.config.title.textStyle.fontSize * 0.6 + 'px'
      html2canvas(domObj, {
        width: domObj.clientWidth * this.canvasRange, // dom 原始宽度
        height: domObj.clientHeight * this.canvasRange,
        scale: 1,
        dpi: 300,
        letterRendering: true,
        scrollY: 0,
        scrollX: 0,
        // background: 'blue',
        useCORS: true // 【重要】开启跨域配置
      }).then(canvas => {
        if (transparent) {
          domObj.style.backgroundColor = ''
        }
        domObj.childNodes[0].style.letterSpacing = ''
        domObj.style.letterSpacing = ''
        this.saveData(canvas.toDataURL())
        this.visible = false
      })
    },
    // 保存推送信息
    saveData(img) {
      let params = {
        graphData: img,
        source: this.currSelected.setting.api_data.source,
        graphName: this.currSelected.name,
        projectId: this.selectProject,
        sourceScreen: this.fileName,
        pushType: this.shareObj.pushTime,
        pushUserId: this.shareObj.pusher,
        watermarkStatus: this.shareObj.watermark,
        pushDateString: this.shareObj.time
          ? moment(this.shareObj.time).format('YYYY-MM-DD HH:mm:ss')
          : moment().format('YYYY-MM-DD HH:mm:ss')
      }
      this.$server.screenManage.savePushData(params).then(res => {
        if (res.code === 200) {
          this.$message.success('推送成功')
        } else {
          if (res.msg === '列表数据不能为空') {
            this.$message.error('该图表未拖入维度/度量')
          } else {
            this.$message.error(res.msg)
          }
        }
      })
    }
  },
  // 8-14 添加配置侧栏
  components: {
    ContextMenu,
    CanvasMain,
    BoardCoverage,
    BoardHeader,
    BoardModel,
    BoardOptions
  }
}
</script>

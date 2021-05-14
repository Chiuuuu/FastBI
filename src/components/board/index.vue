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
            <a-radio value="immediate">立即推送</a-radio>
            <a-radio value="timing">定时推送</a-radio>
            <!-- 定时推送时间 -->
            <a-date-picker
              v-show="shareObj.pushTime === 'timing'"
              v-model="shareObj.time"
              :disabled-date="disabledDate"
              format="YYYY-MM-DD HH:mm:ss"
              style="width:200px"
              placeholder="请选择推送时间"
            />
          </a-radio-group>
        </div>
        <div class="releace-line">
          <span class="label">推送人：</span
          ><input
            v-model="shareObj.pusher"
            :class="['mod_input', 'ant-input']"
            placeholder="请输入推送人"
          />
        </div>
        <div class="releace-line">
          <span class="label">是否加水印：</span>
          <a-radio-group v-model="shareObj.watermark">
            <a-radio value="yes">是</a-radio>
            <a-radio value="no">否</a-radio>
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
import { mapGetters, mapActions } from 'vuex'
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
      shareObj: {
        pushTime: 'immediate',
        pusher: '',
        watermark: 'yes',
        time: null
      } // 推送信息
    }
  },
  provide() {
    return {
      errorFile: this.errorData
    }
  },
  computed: {
    ...mapGetters(['optionsExpand', 'coverageExpand', 'modelExpand']),
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
    disabledDate(current) {
      return current && current < moment().endOf('hour')
    },
    // 推送
    shareChart() {
      this.visible = false
    },
    // 显示推送弹窗
    showPush() {
      this.visible = true
      this.HideContextMenu()
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

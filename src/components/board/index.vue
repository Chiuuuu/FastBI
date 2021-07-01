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
    <context-menu></context-menu>
    <a-modal
      :visible="show"
      title="图表数据"
      width="750px"
      :footer="null"
      @cancel="show = false"
    >
      <div style="width:100%">
        <table class="chartdata-table">
          <tr class="table-tr">
            <th
              class="table-td"
              v-for="(value, index) in chartData.columns"
              :key="index"
            >
              {{ value }}
            </th>
          </tr>
          <tr
            class="table-tr"
            v-for="(row, index) in chartData.rows"
            :key="index"
          >
            <td class="table-td" v-for="(value, key) in row" :key="key">
              {{ value }}
            </td>
          </tr>
        </table>
      </div>
    </a-modal>
  </div>
</template>

<script>
// 默认配置信息
import html2canvas from 'html2canvas'
import config from '../../config/board'
import BoardHeader from './header/index' // 头部
import BoardCoverage from './coverage/index' // 左侧栏(图层)
import BoardOptions from './options/index' // 右侧栏(页面配置)
import CanvasMain from './canvas' // 中间画板
import ContextMenu from './context-menu/index' // 右键菜单
import BoardModel from './model/index' // 8-14 新增数据模型
import { mapGetters, mapActions } from 'vuex'

const prefixCls = 'board'
export default {
  name: 'Board',
  data() {
    return {
      prefixCls: prefixCls,
      config: config,
      errorData: '',
      show: false, // 图表数据查看
      chartData: {}, // 图表数据
      chartDataForMap: {} // 地图第二层数据
    }
  },
  provide() {
    return {
      errorFile: this.errorData,
      showChartData: this.showChartData,
      exportImg: this.exportImg
    }
  },
  computed: {
    ...mapGetters([
      'optionsExpand',
      'coverageExpand',
      'modelExpand',
      'currSelected',
      'currentSelected',
      'pageSettings',
      'canvasRange'
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
      'ToggleModelExpand'
    ]),
    getErrorData(error) {
      this.errorData = error
    },
    // 设置图表数据
    showChartData() {
      let type = this.currSelected.setting.type
      if (this.currSelected.setting.chartType === 'v-map') {
        let fillrows = this.currSelected.setting.api_data.returnDataFill || []
        let labelrows = this.currSelected.setting.api_data.returnDataLabel || []
        if (fillrows.length) {
          this.chartData = { columns: Object.keys(fillrows[0]), fillrows }
        }
        if (labelrows.length) {
          this.chartDataForMap = {
            columns: Object.keys(labelrows[0]),
            labelrows
          }
        }
      } else if (type === '1') {
        this.chartData = this.currSelected.setting.api_data.source
      } else if (type === '2') {
        let rows = this.currSelected.setting.api_data.returnData
        this.chartData = { columns: Object.keys(rows[0]), rows }
      } else {
        let rows = this.currSelected.setting.api_data.source.rows
        this.chartData = { columns: Object.keys(rows[0]), rows }
      }
      this.show = true
    },
    // 导出图片
    exportImg() {
      let domObj = document.getElementById(this.currentSelected)
      let width = domObj.clientWidth * this.canvasRange
      let height = domObj.clientHeight * this.canvasRange
      // 表格控件复制节点
      if (this.currSelected.setting.chartType === 'v-tables') {
        domObj = domObj.cloneNode(true)
        if (!domObj.style.backgroundColor) {
          domObj.style.backgroundColor = this.pageSettings.backgroundColor // 如果图表背景透明，按大屏背景色作为背景
        }
        document.body.appendChild(domObj)
        width = domObj.clientWidth
        height = domObj.clientHeight
      }

      html2canvas(domObj, {
        width, //* this.canvasRange dom 原始宽度
        height,
        scale: 1,
        dpi: 300,
        letterRendering: true,
        scrollY: 0,
        scrollX: 0,
        useCORS: true, // 【重要】开启跨域配置
        onclone: documentClone => {
          const cloneDom = documentClone.getElementById(this.currentSelected)
          //   const pannalDom = documentClone.querySelector('.canvas-panel')
          if (!cloneDom.style.backgroundColor) {
            cloneDom.style.backgroundColor = this.pageSettings.backgroundColor // 如果图表背景透明，按大屏背景色作为背景
          }
          if (this.currSelected.setting.chartType !== 'v-tables') {
            let fontSize =
              this.currSelected.setting.config.title.textStyle.fontSize *
              this.canvasRange
            cloneDom.childNodes[0].style.letterSpacing =
              fontSize * this.canvasRange + 'px'
            cloneDom.childNodes[0].childNodes[0].style.fontSize =
              Math.floor(fontSize) + 'px'
          }
        }
      }).then(canvas => {
        if (this.currSelected.setting.chartType === 'v-tables') {
          document.body.removeChild(domObj)
        }
        this.downloadImg(canvas)
      })
    },
    // 下载图片
    downloadImg(canvas) {
      let a = document.createElement('a')
      a.style.display = 'none'
      let blob = this.dataURLToBlob(canvas.toDataURL('image/png'))
      a.setAttribute('href', URL.createObjectURL(blob))
      // 这块是保存图片操作  可以设置保存的图片的信息
      a.setAttribute('download', this.currSelected.name + '.png')
      document.body.appendChild(a)
      a.click()
      URL.revokeObjectURL(blob)
      document.body.removeChild(a)
    },
    // 图片格式转换方法
    dataURLToBlob(dataurl) {
      let arr = dataurl.split(',')
      let mime = arr[0].match(/:(.*?);/)[1]
      let bstr = atob(arr[1])
      let n = bstr.length
      let u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new Blob([u8arr], { type: mime })
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

<template>
  <div class="dv-admin"
      @click.stop.prevent="hideContextMenu">
    <board v-if="!isScreen">
      <!--头部嵌套可拖拽物品-->
      <template v-slot:headerBox>
        <drag-list :drag-list="navigate"></drag-list>
      </template>
      <!-- 左边侧栏 -->
      <template v-slot:coverage>
        <div class="list-item"
            :key="transform.id" v-for="transform in coverageMaps"
            :class="[{'hovered':hoverItem===transform.id},{'selected':(currentSelected&&currentSelected.id===transform.id)},]"
            :selected="currentSelected&&currentSelected.id===transform.id"
            @click.stop.prevent="handleSelected(transform)"
            @mouseenter="handleHover(transform)"
            @mouseleave="handleNoHover(transform)">
            <div class="item" v-if="coverageExpand">
              <a-icon v-if="transform.packageJson.icon" :type="transform.packageJson.icon" />
              <a-tooltip v-if="transform.packageJson.config.title.content.length > 7">
                <template slot="title">
                  {{transform.packageJson.config.title.content}}
                </template>
                {{transform.packageJson.config.title.content.substring(0, 7) + '...'}}
              </a-tooltip>
              <span v-else>
                {{ transform.packageJson.config.title.content}}
              </span>
              <!-- <span v-else> {{ transform.packageJson.title }}</span> -->
            </div>
            <div v-else flex="main:center" style="padding:5px 0;">
              <a-icon :type="transform.packageJson.icon" />
            </div>
        </div>
      </template>
      <template v-slot:canvas>
        <!--动态组件-->
        <template v-for="transform in canvasMap">
          <drag-item :key="transform.id" :item="transform"
                    :com-hover="hoverItem===transform.id"
                    :selected="currentSelected&&currentSelected.id===transform.id"
                    @click.native.stop.prevent="handleSelected(transform)"
                    @contextmenu.native.stop.prevent="handleRightClickOnCanvas(transform,$event)"
                    @mouseenter.native="handleHover(transform)"
                    @mouseleave.native="handleNoHover(transform)">
            <!-- 文本 -->
            <chart-text v-if="transform.packageJson.name === 've-text'"
                        ref="veText"
                        :id="transform.id"
                        :canEdit.sync="transform.packageJson.canEdit"
                        :config="transform.packageJson.config"
                        :background="transform.packageJson.background"></chart-text>

            <!-- 图片 -->
            <chart-image v-else-if="transform.packageJson.name === 've-image'"
                        :config="transform.packageJson.config"
                        :background="transform.packageJson.background"></chart-image>

            <!-- 表格 -->
            <chart-tables v-else-if="transform.packageJson.name === 've-tables'"
                          :config="transform.packageJson.config"
                          :api-data="transform.packageJson.api_data"
                          :background="transform.packageJson.background"></chart-tables>

            <charts-factory v-else
                            :key="transform.id"
                            :type-name="transform.packageJson.name"
                            :config="transform.packageJson.config"
                            :api-data="transform.packageJson.api_data"
                            :apis="transform.packageJson.apis"
                            :background="transform.packageJson.background"></charts-factory>
          </drag-item>
        </template>
      </template>
    </board>

    <screen v-if="isScreen" :canvasMap="canvasMap"></screen>
    <b-modal v-model="deleteDialog" :styles="{top: '300px',width:'350px'}"
            class-name="delete-dialog" @on-ok="deleteOne">
      <div class="delete-dialog-inner">
        <div>
          <b-icon name="ios-warning" size="40"></b-icon>
        </div>
        <p>是否删除选中的1个组件</p>
      </div>
    </b-modal>
  </div>
</template>

<script>
  import Board from '@/components/board/index' // 右键下拉菜单
  import navigateList from '@/config/navigate' // 导航条菜单
  import DragList from '@/components/drag/DragList' // 导航条拖动模块
  import DragItem from '@/components/drag/DragItem' // 板块设置（长宽高比例悬停）
  import { mapGetters, mapActions } from 'vuex' // 导入vuex
  import { on, off } from 'bin-ui/src/utils/dom' //
  import { getCanvasMaps } from '@/api/canvasMaps/canvas-maps-request' // 图层的方法
  import { getPageSettings, resetPageSettings } from '@/api/app/app-request' // axious请求，拦截器
  import ChartsFactory from '@/components/charts/charts-factory'
  import ChartText from '@/components/tools/Text' // 文本模块
  import ChartImage from '@/components/tools/Image' // 图片模块
  import ChartTables from '@/components/tools/Tables' // 表格模块

  import Screen from '@/views/screen' // 全屏

  export default {
    name: 'Admin',
    data () {
      return {
        navigate: navigateList,
        hoverItem: null,
        deleteDialog: false,

        text_content: '文本内容',
        canEdit: true
      }
    },
    computed: {
      ...mapGetters(['canvasMap', 'currentSelected', 'isScreen', 'coverageExpand', 'pageSettings']),
      coverageMaps () {
        if (this.canvasMap.length > 0) {
          let maps = [...this.canvasMap]
          return maps.reverse()
        } else {
          return []
        }
      }
    },
    created () {
      // 拉取页面配置信息
      // getPageSettings().then(res => {
      //   this.$store.dispatch('SetPageSettings', res.data)
      // })
      console.log(this.navigate)
      // 拉取页面canvasMaps
      // 先清空数据
      this.$store.dispatch('InitCanvasMaps', [])
      if (this.$route.query.id) {
        this.$store.dispatch('SetScreenId', this.$route.query.id)
        this.getScreenData()
      }
    },
    mounted () {
      on(document, 'keyup', this.handleKeyup)
      this.$EventBus.$on('context/menu/delete', this.deleteDialogShow)

      window.onresize = () => {
        // 全屏下监控是否按键了ESC
        if (!this.checkFull()) {
          // 全屏下按键esc后要执行的动作
          this.$store.dispatch('SetIsScreen', false)
        }
      }
    },
    methods: {
      ...mapActions(['saveScreenData']),
      // 获取大屏数据
      getScreenData() {
        this.$server.screenManage.getScreenDetailById(this.$route.query.id).then(res => {
          if (res.code === 200) {
            let json = res.data ? res.data.setting : {}
            console.log(json)
            this.$store.dispatch('SetPageSettings', json.setting)
            if (json.components.length > 0) {
              this.$store.dispatch('InitCanvasMaps', json.components)
            }
            this.$store.dispatch('dataModel/setSelectedModelList', res.list)
          }
        })
      },
      // 悬停事件
      handleHover (item) {
        this.hoverItem = item.id
      },
      handleNoHover (item) {
        this.hoverItem = null
      },
      // transform点击事件
      handleSelected (item) {
        this.$store.dispatch('SingleSelected', item)
        this.$store.dispatch('ToggleContextMenu')

        // 点击文本可编辑
        if (item.packageJson.name === 've-text') {
          for (let el of this.$refs.veText) {
            el.$el.disabled = true
            if (this.currentSelected.id === el.id) {
              el.$el.disabled = false
              el.$el.focus()
            }
          }
        }
      },
      // transform点击事件右键点击
      handleRightClickOnCanvas (item, event) {
        let info = { x: event.pageX + 10, y: event.pageY + 10 }
        this.$store.dispatch('ToggleContextMenu', info)
        this.$store.dispatch('SingleSelected', item)
      },
      // 外层区域关闭右键菜单
      hideContextMenu () {
        this.$store.dispatch('ToggleContextMenu')
      },
      handleKeyup (event) {
        let e = event || window.event
        let k = e.keyCode || e.which
        if (k === 46) {
          if (this.currentSelected) {
            this.deleteOne()
            // this.deleteDialogShow()
          }
        }
      },
      deleteDialogShow () {
        this.deleteDialog = true
      },
      deleteOne () {
        let index = this.canvasMap.indexOf(this.currentSelected)
        if (index > -1) {
          this.canvasMap.splice(index, 1)
          this.$store.dispatch('SingleSelected', null)
          this.saveScreenData()
        }
      },
      /**
     * 是否全屏并按键ESC键的方法
     */
      checkFull () {
        // document.fullscreenEnabled 谷歌浏览器一直返回true
        // let isFull = document.fullscreenEnabled || window.fullScreen || document.webkitIsFullScreen || document.msFullscreenEnabled
        let isFull = window.fullScreen || document.webkitIsFullScreen || document.msFullscreenEnabled
        if (isFull === undefined) {
          isFull = false
        }
        return isFull
      }
    },
    components: { ChartsFactory, DragItem, DragList, Board, ChartText, ChartImage, ChartTables, Screen },
    beforeDestroy () {
      off(document, 'keyup', this.handleKeyup)
      this.$EventBus.$off('context/menu/delete', this.deleteDialogShow)
    }
  }
</script>

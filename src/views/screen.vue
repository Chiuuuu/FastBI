<template>
  <div class="dv-screen">
    <b-scrollbar style="height:100%;">
      <div class="canvas-panel" :style="canvasPanelStyle">
        <template v-for="transform in canvasMap">
          <preview-box :key="transform.id" :item="transform">
             <!-- 文本 -->
            <chart-text v-if="transform.packageJson.name === 've-text'"
                        :config="transform.packageJson.config"
                        :background="transform.packageJson.background"></chart-text>

            <!-- 图片 -->
            <chart-image v-else-if="transform.packageJson.name === 've-image'"
                         :config="transform.packageJson.config"></chart-image>

            <!-- 表格 -->
            <chart-tables v-else-if="transform.packageJson.name === 've-tables'"
                          :config="transform.packageJson.config"
                          :api-data="transform.packageJson.api_data"
                          :background="transform.packageJson.background"></chart-tables>
            <charts-factory v-else
                    :type-name="transform.packageJson.name"
                    :config="transform.packageJson.config"
                    :api-data="transform.packageJson.api_data"
                    :apis="transform.packageJson.apis"
                    :background="transform.packageJson.background"
                    ></charts-factory>
          </preview-box>
        </template>
      </div>
    </b-scrollbar>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { getPageSettings } from '../api/app/app-request'
  import { getCanvasMaps } from '../api/canvasMaps/canvas-maps-request'
  import ChartsFactory from '../components/charts/charts-factory'
  import PreviewBox from '../components/preview/preview-box'
  import ChartText from '@/components/tools/Text'
  import ChartImage from '@/components/tools/Image'
  import ChartTables from '@/components/tools/Tables'

  export default {
    name: 'screen',
    components: { ChartsFactory, PreviewBox, ChartText, ChartImage, ChartTables },
    props: {

    },
    data () {
      return {}
    },
    computed: {
      ...mapGetters(['canvasMap', 'pageSettings', 'screenId']),
      // 画布面板的样式
      canvasPanelStyle () {
        return {
          width: `${this.pageSettings.width}px`,
          height: `${this.pageSettings.height}px`,
          backgroundColor: this.pageSettings.backgroundColor
        }
      }
    },
    watch: {
    },
    created () {
      this.getScreenData()
    },
    methods: {
      // 获取大屏数据
      getScreenData() {
        this.$server.screenManage.screenData(this.screenId).then(res => {
          if (res.data.code === 200) {
            let json = res.data.data ? res.data.data.json : {}
            // 页面配置信息
            this.$store.dispatch('SetPageSettings', json.setting)
            // 页面canvasMaps
            this.$store.dispatch('InitCanvasMaps', json.components)
          }
        })
      }
    }
  }
</script>

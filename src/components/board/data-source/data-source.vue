<template>
  <div class="data-source">
    <a-collapse v-model="activeKey" :bordered="false">
      <a-collapse-panel key="dimensions" header="维度" v-if="chartType!=='v-tables' && chartType!=='v-gauge'">
        <drag-area type="dimensions" :fileList="fileObj.dimensions"></drag-area>
      </a-collapse-panel>
      <a-collapse-panel key="measures" header="度量" v-if="chartType!=='v-tables'">
        <drag-area type="measures" :fileList="fileObj.measures"></drag-area>
      </a-collapse-panel>
      <a-collapse-panel key="tableList" header="列" v-if="chartType==='v-tables'">
        <drag-area type="tableList"></drag-area>
      </a-collapse-panel>
      <!-- <a-collapse-panel key="filter" header="数据筛选">
        <div class="empty">拖入字段</div>
      </a-collapse-panel>
      <a-collapse-panel key="sort" header="排序">
      </a-collapse-panel>
      <a-collapse-panel key="tips" header="鼠标移入时提示">
      </a-collapse-panel>
      <a-collapse-panel key="refresh" header="定时刷新">
      </a-collapse-panel> -->
    </a-collapse>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import DragArea from './components/dragArea'
export default {
  components: {
    DragArea
  },
  data() {
    return {
      activeKey: ['dimensions', 'measures', 'filter', 'sort', 'tips', 'refresh', 'tableList'], // 所有面板默认打开
      fileObj: {
        dimensions: [],
        measures: []
      } // 存储维度度量数据
    }
  },
  watch: {
    currentSelected: {
      handler (val) {
        // if (val) {
        //   // 当前选中的图表显示维度度量的数据
        //   // this.fileList = []
        //   if (this.type === 'dimensions' && val.packageJson.api_data.dimensions) { // 维度
        //     this.fileObj.dimensions = JSON.parse(JSON.stringify(val.packageJson.api_data.dimensions))
        //     // this.fileList = JSON.parse(JSON.stringify(val.packageJson.api_data.dimensions))
        //   }
        //   if (this.type === 'measures' && val.packageJson.api_data.measures) { // 度量
        //     this.fileObj.measures = JSON.parse(JSON.stringify(val.packageJson.api_data.measures))
        //     // this.fileList = JSON.parse(JSON.stringify(val.packageJson.api_data.measures))
        //   }
        //   if (this.type === 'tableList' && val.packageJson.api_data.tableList) { // 表格不区分维度度量
        //     this.fileObj.tableList = JSON.parse(JSON.stringify(val.packageJson.api_data.tableList))
        //     // this.fileList = JSON.parse(JSON.stringify(val.packageJson.api_data.tableList))
        //   }
        // }
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    ...mapGetters(['currentSelected']),
    chartType () {
      return this.currentSelected ? this.currentSelected.packageJson.chartType : ''
    }
  },
  methods: {

  }
}
</script>

<style>

</style>

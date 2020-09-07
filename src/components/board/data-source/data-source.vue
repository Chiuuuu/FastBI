<template>
  <div class="data-source">
    <a-collapse v-model="activeKey" :bordered="false">
      <a-collapse-panel key="dimension" header="维度" v-if="currentSelected.packageJson.name!=='ve-tables'">
        <drag-area type="dimension"></drag-area>
      </a-collapse-panel>
      <a-collapse-panel key="measure" header="度量" v-if="currentSelected.packageJson.name!=='ve-tables'">
        <drag-area type="measure"></drag-area>
      </a-collapse-panel>
      <a-collapse-panel key="table" header="列" v-if="currentSelected.packageJson.name==='ve-tables'">
        <drag-area type="table"></drag-area>
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
      activeKey: ['dimension', 'measure', 'filter', 'sort', 'tips', 'refresh', 'table'] // 所有面板默认打开
    }
  },
  watch: {
    currentSelected: {
      handler (val) {
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    ...mapGetters(['currentSelected'])
  },
  methods: {

  }
}
</script>

<style>

</style>

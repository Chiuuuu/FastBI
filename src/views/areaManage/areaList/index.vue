<template>
  <div class="screen-manage main">
    <div class="head">
      <h1>片区地址</h1>
    </div>
    <AreaRows />
    <!-- <a-tabs class="tabs">
      <a-tab-pane key="1" tab="街道地址">
        <AreaRows
          ref="manage1"
        ></AreaRows>
      </a-tab-pane>
      <a-tab-pane key="2" tab="操作记录">
        <AreaRecord
          ref="manage2"
        ></AreaRecord>
      </a-tab-pane>
    </a-tabs> -->
  </div>
</template>
<script>
import AreaRows from './components/areaRows.vue'
// import AreaRecord from './components/areaRecord.vue'

export default {
  name: 'areaList',
  components: {
    AreaRows,
    // AreaRecord
  },
  data() {
    return {}
  },
  methods: {
    // tab改变
    // handleChangeModule(key) {
    //   const tab = this.$refs[`manage${key}`]
    //   if (tab) {
    //     tab.getList({ current: 1, projectId: this.projectId })
    //   }
    // }
  }
}
</script>
<style lang="less" scoped>
@import './main.less';
</style>

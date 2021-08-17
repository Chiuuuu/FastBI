<template>
  <a-row :gutter="16" class="screen-manage">
    <a-col class="gutter-row" :span="24">
      <div class="main">
        <div class="head">
          <h1>操作记录</h1>
          <div>
            <a-select
              v-model="projectName"
              style="width: 120px"
              placeholder="请选择项目"
            >
              <a-select-option value="">
                所有项目
              </a-select-option>
              <a-select-option v-for="item in projectList" :key="item.id" :value="item.name">{{
                item.name
              }}</a-select-option>
            </a-select>
          </div>
        </div>
        <div class="right">
          <a-tabs class="tabs" v-model="tab" @change="handleChangeModule">
            <a-tab-pane key="1" tab="数据接入">
              <recordMain ref="manage1" :type="1" :projectName="projectName"></recordMain>
            </a-tab-pane>
            <a-tab-pane key="2" tab="数据建模">
              <recordMain ref="manage2" :type="2" :projectName="projectName"></recordMain>
            </a-tab-pane>
            <a-tab-pane key="3" tab="数据大屏">
              <recordMain ref="manage3" :type="3" :projectName="projectName"></recordMain>
            </a-tab-pane>
          </a-tabs>
        </div>
      </div>
    </a-col>
  </a-row>
</template>
<script>
import recordMain from './components/record-main/record-main.vue'
import { mapState } from 'vuex'
export default {
  name: 'record',
  components: {
    recordMain
  },
  data() {
    return {
      projectName: '',
      tab: '1'
    }
  },
  computed: {
    ...mapState({
      projectList: state => state.user.projectList
    })
  },
  watch: {
    projectName(val) {
      const tab = this.$refs[`manage${this.tab}`]
      if (tab) {
        tab.handleProjectNameChange(val)
      }
    }
  },
  methods: {
    handleChangeModule(key) {
      const tab = this.$refs[`manage${key}`]
      if (tab) {
        tab.getList({ current: 1, projectName: this.projectName })
      }
    }
  }
}
</script>
<style lang="less" scoped>
@import '../main.less';
</style>

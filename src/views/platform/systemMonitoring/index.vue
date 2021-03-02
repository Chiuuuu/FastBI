<template>
  <a-row :gutter="16" class="screen-manage">
    <a-col class="gutter-row screen-manage" :span="24">
      <div class="main" style="height:100%;backgroundColor:transparent">
        <div class="right" style="color:red;height:100%">
          <div class="monitoring">
            <a-tabs default-active-key="1">
              <a-tab-pane key="1" tab="在线用户">
                <show-login-table></show-login-table>
              </a-tab-pane>
              <a-tab-pane key="2" tab="用户登录情况">
                <show-login-chart></show-login-chart>
              </a-tab-pane>
            </a-tabs>
          </div>
        </div>
      </div>
    </a-col>
  </a-row>
</template>
<script>
import showLoginChart from './components/showLoginChart.vue'
import ShowLoginTable from './components/showLoginTable.vue'
export default {
  components: { showLoginChart, ShowLoginTable },
  name: 'SystemMonitoring',
  data() {
    return {}
  },
  mounted() {}
}
</script>
<style lang="less">
@import './monitoring.less';
</style>

<template>
  <a-tabs class="iframe-tabs">
    <a-tab-pane v-for="item in tabs" :key="item.key" :tab="item.title">
      <iframe class="iframe-area" :src="item.src"></iframe>
    </a-tab-pane>
  </a-tabs>
</template>

<script>
export default {
  name: 'operation',
  data() {
    return {
      tabs: [
        {
          key: 1,
          title: '节点管理',
          src: process.env.VUE_APP_OPERATION_URL + '/#/node/list'
        },
        {
          key: 2,
          title: 'SSH管理',
          src: process.env.VUE_APP_OPERATION_URL + '/#/node/ssh'
        },
        {
          key: 3,
          title: '节点分发',
          src: process.env.VUE_APP_OPERATION_URL + '/#/dispatch/list'
        },
        {
          key: 4,
          title: '分发日志',
          src: process.env.VUE_APP_OPERATION_URL + '/#/dispatch/log'
        }
      ]
    }
  },
  methods: {},
}
</script>

<style lang="less" scoped>
@deep: ~'>>>';
.iframe-tabs {
  height: 100%;
  width: 100%;

  @{deep} .ant-tabs-content {
    height: calc(100% - 60px);
  }
  @{deep} .ant-tabs-tabpane,
  .iframe-area {
    height: 100%;
    width: 100%;
  }
}
</style>

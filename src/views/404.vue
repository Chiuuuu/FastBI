<template>
  <a-result
    status="404"
    title="404"
    sub-title="非常抱歉，您所访问的页面不存在。"
  >
    <template #extra>
      <a-button type="primary" @click="handleGoBackHome">
        返回首页
      </a-button>
    </template>
  </a-result>
</template>
<script>
export default {
  name: 'NoFound',
  methods: {
    handleGoBackHome() {
      this.$router.push({
        path: '/'
      })
    }
  }
}
</script>

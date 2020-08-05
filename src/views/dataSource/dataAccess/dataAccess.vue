<template>
  <div class="data-access">
    <Menu></Menu>
    <Main></Main>
  </div>
</template>
<script>
import Menu from './components/data-menu/menu'
import Main from './components/data-main/main'
export default {
  components: {
    Menu,
    Main
  }
}
</script>
<style lang="styl" scoped>
.data-access {
  display: flex;
  justify-content: space-between;
}
</style>

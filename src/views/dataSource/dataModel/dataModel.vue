<template>
  <div class="data-model">
    <Menu></Menu>
    <Main></Main>
  </div>
</template>

<script>
import Menu from './components/model-menu/menu'
import Main from './components/model-main/main'
export default {
  components: {
    Menu,
    Main
  }
}
</script>

<style lang="styl" scoped>
.data-model {
    display: flex;
    justify-content: space-between;
}
</style>

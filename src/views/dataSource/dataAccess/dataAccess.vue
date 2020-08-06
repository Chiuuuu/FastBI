<template>
  <a-row :gutter="16">
    <a-col class="gutter-row" :span="5">
      <Menu></Menu>
    </a-col>
    <a-col class="gutter-row" :span="19">
      <Main></Main>
    </a-col>
  </a-row>
</template>
<script>
import Menu from './components/data-main/data-menu/menu'
import Main from './components/data-main/main'
export default {
  components: {
    Menu,
    Main
  }
}
</script>

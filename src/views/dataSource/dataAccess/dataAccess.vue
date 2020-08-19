<template>
  <a-row :gutter="16">
    <a-col class="gutter-row" :span="5">
      <Menu @on-change-tabindex='handleChangeTabindex'></Menu>
    </a-col>
    <a-col class="gutter-row" :span="19">
      <component :is="showWhat" @on-change-componet="handleChangeComponet" :tabindex="tabindex" @on-change-tabindex='handleChangeTabindex'></component>
    </a-col>
  </a-row>
</template>
<script>
import Menu from './components/data-menu/menu'
import Main from './components/data-main/main'
import Setting from './setting/dataAccess-setting'
import { fetchLogin } from '../../../api/dataAccess/api'
export default {
  components: {
    Menu,
    Main,
    Setting
  },
  data() {
    return {
      showWhat: 'Main',
      tabindex: '1'
    }
  },
  methods: {
    handleChangeComponet(componentName) {
      this.showWhat = componentName
      if (componentName === 'Main') {
        this.tabindex = '2'
      }
    },
    handleChangeTabindex(index) {
      this.tabindex = index
    }
  },
  beforeDestroy() {
    this.$store.dispatch('dataAccess/setModelType', '')
  }
}
</script>

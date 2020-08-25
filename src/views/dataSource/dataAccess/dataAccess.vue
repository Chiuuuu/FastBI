<template>
  <a-row :gutter="16">
    <a-col class="gutter-row" :span="5">
      <Menu @on-menuChange-componet="handleMenuChangeComponet"></Menu>
    </a-col>
    <a-col class="gutter-row" :span="19">
      <component :is="showWhat" @on-change-componet="handleChangeComponet" :tabindex="tabindex" :fieldInfo="fieldInfo"></component>
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
      tabindex: '1',
      fieldInfo: {}
    }
  },
  methods: {
    handleChangeComponet(componentName, row) {
      this.showWhat = componentName
      if (componentName === 'Main') {
        this.tabindex = '2'
      } else if (componentName === 'Setting') {
        this.fieldInfo = Object.assign(this.fieldInfo, row)
      }
    },
    handleMenuChangeComponet(componentName) {
      this.showWhat = componentName
    }
  },
  beforeDestroy() {
    this.$store.dispatch('dataAccess/setModelType', '')
    this.$store.dispatch('dataAccess/setModelId', '')
  }
}
</script>

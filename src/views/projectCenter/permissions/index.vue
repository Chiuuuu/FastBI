<template>
  <a-row class="screen-manage">
    <a-col class="screen-manage" :span="5" style="border-right: 1px solid #e5e5e5">
      <Menu />
    </a-col>
    <a-col class="screen-manage" :span="19">
      <Main />
    </a-col>
  </a-row>
</template>
<script>
import Menu from './components/perm-menu'
import Main from './components/perm-main'

import { mapState } from 'vuex'
export default {
  name: 'permissions',
  components: {
    Menu,
    Main
  },
  data() {
    return {

    }
  },
  beforeDestroy() {
    this.$store.commit('projectPermissions/SET_PERMISSIONID', 0)
  }
}
</script>

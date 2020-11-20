<template>
  <a-row :gutter="16" class="screen-manage">
    <template v-if="roleMode === 'check'">
      <a-col class="gutter-row screen-manage" :span="5">
        <Menu />
      </a-col>
      <a-col class="gutter-row screen-manage" :span="19">
        <Main />
      </a-col>
    </template>
    <template v-else-if="roleMode === 'edit'">
      <a-col class="gutter-row screen-manage" :span="24">
        <Edit />
      </a-col>
    </template>
  </a-row>
</template>
<script>
import Menu from './components/role-menu'
import Main from './components/role-main'
import Edit from './components/role-edit'

import { mapState } from 'vuex'
export default {
  name: 'roles',
  components: {
    Menu,
    Main,
    Edit
  },
  data() {
    return {
      
    }
  },
  computed: {
    ...mapState({
      roleMode: state => state.roles.roleMode
    })
  },
  beforeDestroy() {
    this.$store.commit('roles/SET_ROLEMODE', 'check')
    this.$store.commit('roles/SET_ROLEID', 0)
  }
}
</script>

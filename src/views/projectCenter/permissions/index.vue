<template>
  <a-row :gutter="16" class="screen-manage">
    <template v-if="permissionMode === 'check'">
      <a-col class="gutter-row screen-manage" :span="5">
        <Menu />
      </a-col>
      <a-col class="gutter-row screen-manage" :span="19">
        <Main />
      </a-col>
    </template>
    <template v-else-if="permissionMode === 'edit'">
      <a-col class="gutter-row screen-manage" :span="24">
        <EditRow v-if="editType === 'row'" />
        <EditCol v-else-if="editType === 'col'" />
      </a-col>
    </template>
  </a-row>
</template>
<script>
import Menu from './components/perm-menu'
import Main from './components/perm-main'
import EditRow from './components/perm-edit/row'
import EditCol from './components/perm-edit/col'

import { mapState } from 'vuex'
export default {
  name: 'permissions',
  components: {
    Menu,
    Main,
    EditRow,
    EditCol
  },
  data() {
    return {

    }
  },
  computed: {
    ...mapState({
      permissionMode: state => state.projectPermissions.permissionMode,
      editType: state => state.projectPermissions.editType
    })
  },
  beforeDestroy() {
    this.$store.commit('projectPermissions/SET_PERMISSIONMODE', 'check')
    this.$store.commit('projectPermissions/SET_PERMISSIONID', 0)
  }
}
</script>

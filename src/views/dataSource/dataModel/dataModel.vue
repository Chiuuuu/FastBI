<template>
  <a-row class="data-model screen-manage">
    <a-col class="screen-manage" :span="5">
      <Menu @getModelInfo="handleEmitMainGetData"></Menu>
    </a-col>
    <a-col class="screen-manage" :span="19">
      <Main ref="modelMainRef"></Main>
    </a-col>
  </a-row>
</template>

<script>
import Menu from './components/model-menu'
import Main from './components/model-main/main'
import { mapState } from 'vuex'
export default {
  components: {
    Menu,
    Main
  },
  computed: {
    ...mapState({
      fileSelectId: state => state.common.menuSelectId
    })
  },
  mounted() {
    if (this.fileSelectId !== -1) {
      this.handleEmitMainGetData(this.fileSelectId)
    }
  },
  beforeDestroy() {
    this.$store.dispatch('dataModel/setModelId', -1)
    this.$store.commit('dataModel/SET_MODELNAME', '')
    this.$store.commit('common/SET_MENUSELECTID', -1)
  },
  methods: {
    handleEmitMainGetData(id) {
      this.$refs.modelMainRef.handleGetData(id)
    }
  }
}
</script>

<style lang="less" scoped>
.data-model {
  display: flex;
  justify-content: space-between;
}
</style>

<template>
  <div class="data-model screen-manage">
    <Menu @getModelInfo='handleEmitMainGetData' @navigateToModelMap="navigateToModelMap"></Menu>
    <ModelMap v-if="showMap" />
    <Main v-else ref='modelMainRef'></Main>
  </div>
</template>

<script>
import Menu from './components/model-menu'
import Main from './components/model-main/main'
import ModelMap from './components/model-map/model-map'
import { mapState } from 'vuex'
export default {
  components: {
    Menu,
    Main,
    ModelMap
  },
  data() {
    return {
      showMap: false
    }
  },
  computed: {
    ...mapState({
      fileSelectId: state => state.modelMange.modelId
    })
  },
  mounted() {
    if (this.fileSelectId !== -1) {
      this.handleEmitMainGetData()
    }
  },
  beforeDestroy() {
    this.clearModel()
  },
  methods: {
    handleEmitMainGetData(id) {
      this.showMap = false
      this.$nextTick(() => {
        this.$refs.modelMainRef.handleGetData(id)
      })
    },
    navigateToModelMap() {
      this.clearModel()
      this.showMap = true
    },
    clearModel() {
      this.$store.dispatch('modelMange/setModelId', -1)
      this.$store.commit('modelMange/SET_MODELNAME', '')
    }
  }
}
</script>

<style lang="styl" scoped>
.data-model {
    display: flex;
    justify-content: space-between;
}
</style>

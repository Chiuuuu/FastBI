<template>
  <div class="data-model">
    <Menu @getModelInfo='handleEmitMainGetData'></Menu>
    <Main ref='modelMainRef'></Main>
  </div>
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
      fileSelectId: state => state.dataModel.modelId
    })
  },
  mounted() {
    if (this.fileSelectId !== -1) {
      this.handleEmitMainGetData()
    }
  },
  methods: {
    handleEmitMainGetData() {
      this.$refs.modelMainRef.handleGetData()
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

<template>
  <div class="material-list">
    <MaterialListItem v-for="item in materialList" :key="item.id" :data="item" v-on="$listeners" />
  </div>
</template>

<script>
import MaterialListItem from './material-list-item.vue'
export default {
  name: 'MaterialList',
  props: {
    materialList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  components: {
    MaterialListItem
  },
  data() {
    return {

    }
  },
  methods: {

  }
}
</script>

<style lang="less" scoped>
.material-list {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}
</style>

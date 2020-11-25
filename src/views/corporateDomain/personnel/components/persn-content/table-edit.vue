<template>
  <div style="height:21px">
  <span v-if="index !== activeIndex">{{ title }}</span>
  <a-input v-else :value="editValue" @change="handleChangeText" size="small"></a-input>
  </div>
</template>

<script>
export default {
  name: 'tableEdit',
  props: {
    title: String,
    activeIndex: Number,
    index: Number
  },
  data() {
    return {
      editValue: this.title
    }
  },
  methods: {
    handleChangeText(e) {
      this.$emit('getChangeText', e.target.value)
    }
  }
}
</script>

<style>

</style>

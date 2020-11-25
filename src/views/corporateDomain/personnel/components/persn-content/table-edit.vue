<template>
  <span v-if="index !== activeIndex">{{ title }}</span>
  <a-input v-else :value="editValue" @change="handleChangeText"></a-input>
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

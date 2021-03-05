<template>
  <a-row :gutter="16" class="screen-manage">
    <a-col class="gutter-row screen-manage" :span="24">
      <List />
    </a-col>
  </a-row>
</template>
<script>
import List from './list'
export default {
  name: 'LabelList',
  components: {
    List
  }
}
</script>

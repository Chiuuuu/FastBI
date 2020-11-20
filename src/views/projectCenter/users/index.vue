<template>
  <a-row :gutter="16" class="screen-manage">
    <a-col class="gutter-row screen-manage" :span="24">
      <Main />
    </a-col>
  </a-row>
</template>
<script>
import Main from './components/user-main'
export default {
	name: 'users',
  components: {
    Main
  },
  data() {
    return {
      
    }
  }
}
</script>

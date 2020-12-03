<template>
  <div class="tab scrollbar">
    <a-row class="line">
      <a-col span="2">{{ roleTitle }}</a-col>
      <a-col>
        <a-checkbox-group :options="options" :disabled="status === 'show'? true : false"></a-checkbox-group>
      </a-col>
    </a-row>
    <a-row class="line">
      <a-col span="14">所有目录</a-col>
      <a-col span="2" align="left" v-for="item in injectActionList" :key="item.permission">{{item.name}}</a-col>
    </a-row>
    <div class="content scrollbar">
      <limit-tree></limit-tree>
    </div>
  </div>
</template>

<script>
import LimitTree from './limit-tree'
export default {
  name: 'roleLimit',
  inject: ['status', 'getProvideActionList'],
  props: {
    roleTitle: String,
    options: Array
  },
  components: {
    LimitTree
  },
  computed: {
    injectActionList() {
      return this.getProvideActionList()
    }
  },
  // watch: {
  //   injectActionList: {
  //     deep: true,
  //     handler(e) {
  //       console.log("watch", e);
  //     }
  //   }
  // },
}
</script>

<style>

</style>

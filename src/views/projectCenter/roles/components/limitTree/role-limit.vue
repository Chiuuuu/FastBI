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
      <a-col span="2" align="left" v-for="item in ['查看', '编辑', '复制', '删除', '发布']" :key="item">{{item}}</a-col>
    </a-row>
    <div class="content scrollbar">
      <limit-tree :status="status"></limit-tree>
    </div>
  </div>
</template>

<script>
import LimitTree from './limit-tree'
export default {
  name: 'roleLimit',
  props: {
    roleTitle: String,
    options: Array,
    mode: String,
    status: {
      type: String,
      default: 'show'
    }
  },
  components: {
    LimitTree
  }
}
</script>

<style>

</style>

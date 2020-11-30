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
      <a-col span="2">查看</a-col>
      <a-col span="2">编辑</a-col>
      <a-col span="2">复制</a-col>
      <a-col span="2">删除</a-col>
      <a-col span="2">发布</a-col>
    </a-row>
    <div class="content scrollbar">
      <limit-tree :status="status"></limit-tree>
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

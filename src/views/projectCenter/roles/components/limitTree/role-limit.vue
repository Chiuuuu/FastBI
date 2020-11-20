<template>
  <div class="screen-manage">
    <a-row class="line">
      <a-col span="6">{{ roleTitle }}</a-col>
      <a-col>
        <a-checkbox-group :options="options"></a-checkbox-group>
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
    <limit-tree></limit-tree>
    <limit-tree></limit-tree>
  </div>
</template>

<script>
import LimitTree from './limit-tree'
export default {
  name: 'roleLimit',
  props: {
    roleTitle: String,
    options: Array,
    mode: String
  },
  components: {
    LimitTree
  }
}
</script>

<style>

</style>

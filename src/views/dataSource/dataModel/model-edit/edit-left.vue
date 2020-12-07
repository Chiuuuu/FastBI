<template>
  <a-spin class="sheet_list scrollbar" :spinning="loading">
    <div v-if="list.length > 0">
      <div
        class="sheet_list_item"
        v-for="item in list"
        :key="item.id"
        :draggable="isDrag"
        @mouseleave.stop="handleMouseLeave"
        @mousedown.stop="handleMouseDown"
        @dragstart.stop="handleLeftDragStart($event, item)"
        @dragend.stop="handleLeftDragEnd"
        :title="item.name"
      >
        <span>{{ item.name }}</span>
        <template v-if="type==='sql'">
          <!-- <div class="u-icon eye"><a-icon type="eye" @click="handleTableInfo(3)"/></div> -->
          <div class="u-icon edit"><a-icon type="edit" @click="handleSQLEdit(item)"/></div>
          <div class="u-icon delete"><a-icon type="delete" @click="handleSQLDelete(item)"/></div>
        </template>
        <template v-else>
          <div class="u-icon delete"><a-icon type="eye" @click="handleTableInfo(3)"/></div>
        </template>
      </div>
    </div>
    <template v-else>
      <a-empty style="margin-top:50px;color:#000" v-if="type !=='sql'" description="数据源未进行数据抽取，请先抽取数据"></a-empty>
    </template>
  </a-spin>
</template>
<script>
import { Node } from '../util'
import { mapState } from 'vuex'
export default {
  name: 'model-edit-left',
  inject: ['nodeStatus'],
  props: {
    detailInfo: {
      type: Object,
      default: () => {}
    },
    type: {
      type: String,
      default: ''
    },
    list: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      isDrag: false,
      loading: true
    }
  },
  watch: {
    list: {
      immediate: true,
      handler(newValue) {
        this.loading = false
      }
    }
  },
  methods: {
    handleTableInfo(num) {
      alert(num)
    },
    handleSQLEdit(item) {
      this.$emit('edit', item)
    },
    handleSQLDelete(item) {
      this.$emit('delete', item)
    },
    handleMouseDown() {
      this.isDrag = true
    },
    handleMouseLeave() {
      this.isDrag = false
    },
    handleLeftDragStart(event, data) {
      console.log('left-drag-start', data)
      this.nodeStatus = Object.assign(this.nodeStatus, {
        dragType: 'menu',
        dragNode: new Node(data),
        event
      })
    },
    handleLeftDragEnd() {
      this.$emit('on-left-drag-leave')
    }
  }
}
</script>

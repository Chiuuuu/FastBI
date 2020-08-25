<template>
  <div class="sheet_list">
    <div
      class="sheet_list_item"
      v-for="item in list"
      :key="item.id"
      :draggable="isDrag"
      @mouseleave.stop="handleMouseLeave"
      @mousedown.stop="handleMouseDown"
      @dragstart.stop="handleLeftDragStart($event, item)"
      @dragend.stop="handleLeftDragEnd"
    >
      <span>{{ item.tableName }}</span>
    </div>
  </div>
</template>
<script>
import { Node } from '../util'
export default {
  name: 'model-edit-left',
  inject: ['nodeStatus'],
  data() {
    return {
      isDrag: false,
      list: [
        {
          id: 1,
          tableName: '类别',
          hasFilter: false,
          status: 'direct',
          dataConnectionId: 700468972
        },
        {
          id: 2,
          tableName: '细分',
          hasFilter: false,
          status: 'direct',
          dataConnectionId: 700468972
        },
        {
          id: 3,
          tableName: '订单',
          hasFilter: false,
          status: 'direct',
          dataConnectionId: 700468972
        }
      ]
    }
  },
  methods: {
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

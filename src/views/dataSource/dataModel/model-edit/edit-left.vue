<template>
  <div class="sheet_list">
    <div
      class="sheet_list_item"
      v-for="(item, index) in list"
      :key="index"
      :draggable="isDrag"
      @mouseleave.stop="handleMouseLeave"
      @mousedown.stop="handleMouseDown"
      @dragstart.stop="handleLeftDragStart($event, item)"
      @dragend.stop="handleLeftDragEnd"
    >
      <span>{{ item.title }}</span>
    </div>
  </div>
</template>
<script>
export default {
  name: 'model-edit-left',
  inject: ['nodeStatus'],
  data() {
    return {
      isDrag: false,
      list: [
        {
          id: 4,
          title: '三大框架'
        },
        {
          id: 1,
          title: 'react'
        },
        {
          id: 2,
          title: 'vue'
        },
        {
          id: 3,
          title: 'angular'
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
      const copyData = JSON.parse(JSON.stringify(data))
      console.log('left-drag-start', copyData)
      this.nodeStatus = Object.assign(this.nodeStatus, {
        dragType: 'left',
        dragNode: {
          nodeData: copyData,
          parentNode: null
        },
        event
      })
    },
    handleLeftDragEnd() {
        this.$emit('on-left-drag-leave')
    }
  }
}
</script>

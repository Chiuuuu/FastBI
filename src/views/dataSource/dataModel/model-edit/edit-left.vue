<template>
  <div class="sheet_list" v-if="list.length > 0">
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
      <span>{{ item.name }}</span>
    </div>
  </div>
  <a-empty style="margin-top:50px;color:#000" v-else description="数据源未进行数据抽取，请先抽取数据"></a-empty>
</template>
<script>
import { Node } from '../util'
import { mapState } from 'vuex'
export default {
  name: 'model-edit-left',
  inject: ['nodeStatus'],
  props: ['detailInfo'],
  data() {
    return {
      isDrag: false,
      list: ''
      // list: [
      //   {
      //     id: 1,
      //     tableName: '类别',
      //     hasFilter: false,
      //     status: 'direct',
      //     dataConnectionId: 700468972
      //   },
      //   {
      //     id: 2,
      //     tableName: '细分',
      //     hasFilter: false,
      //     status: 'direct',
      //     dataConnectionId: 700468972
      //   },
      //   {
      //     id: 3,
      //     tableName: '订单',
      //     hasFilter: false,
      //     status: 'direct',
      //     dataConnectionId: 700468972
      //   }
      // ]
    }
  },
  computed: {
    ...mapState({
      fileSelectId: state => state.dataModel.modelId
    })
  },
  methods: {
    async handleGetMenuList(id) {
      const result = await this.$server.dataModel.getTableListById(id)

      if (result.code === 200) {
        this.list = result.data
      } else {
        this.$message.error(result.msg)
      }
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

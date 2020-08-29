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
import { mapState } from 'vuex'
import {
  fetchGetTableList
} from '@/api/dataModel/api'

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
    async handleGetMenuList(detailInfo) {
      const result = await fetchGetTableList({
        url: '/admin/dev-api/datamodel/datamodelInfo/getDataSourceTableInfo/' + detailInfo.dataConnectionId // '111112222233333444'
      })

      if (result.data.code === 200) {
        this.list = result.data.data
      } else {
        this.$message.error(result.data.msg)
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

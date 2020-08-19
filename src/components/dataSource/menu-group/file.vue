<template>
  <li
    class="item dragable"
    :class="isSelect ? 'file-active':''"
    :title="file.name"
    :index="index"
    ref="file"
    draggable
    @dragstart="handleFileDragStart"
    @click="handleFileSelect"
  >
    <h4 class="title" :title="file.name">
      <img :src="icon" class='file-icon'/>
      <span>{{ file.name }}</span>
    </h4>
    <span class="menu">
      <span class="caret-down" @click="handleCreateMenu"></span>
    </span>
  </li>
</template>
<script>
import ContextMenu from '@/components/dataSource/contextmenu'
import { addClass, removeClass } from 'bin-ui/src/utils/dom'
export default {
  name: 'menu-group-node',
  props: {
    file: {
      required: true,
      type: Object,
      default: function() {
        return {}
      }
    },
    parent: {
      type: Object,
      default: function() {
        return null
      }
    },
    index: {
      type: Number,
      default: 0
    },
    isSelect: {
      type: Boolean,
      default: false
    },
    contextmenus: {
      required: true,
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {
      contenxtmenu: '',
      icon: require(`@/assets/images/icon_mysql.png`)
    }
  },
  mounted() {
    this.$refs.file.addEventListener('contextmenu', (e) => {
      e.preventDefault()
      this.handleCreateMenu(e)
    })
  },
  methods: {
    handleFileSelect() {
      this.$parent.$emit('fileSelect', this.file)
    },
    handleFileDragStart(e) {
      e.stopPropagation()
    },
    handleCreateMenu(e) {
      e.stopPropagation()
      addClass(this.$refs.file, 'file-active')
      const that = this
      this.contenxtmenu = new ContextMenu({
        menus: that.contextmenus.map(item => {
          item.$$fun = function () {
              Array.prototype.push.call(arguments, that)
              item.onClick.apply(this, arguments)
          }
          return item
        }),
        styleObj: {
          left: e.clientX + 'px',
          top: e.clientY + 'px'
        },
        handleMarkCancel: function() {
          removeClass(that.$refs.file, 'file-active')
        }
      })
    }
  }
}
</script>

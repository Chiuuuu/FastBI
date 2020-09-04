<template>
  <li
    class="item dragable"
    :class="isSelect ? 'file-active':''"
    :title="file[fileName]"
    :index="index"
    ref="file"
    draggable
    @dragstart="handleFileDragStart"
    @click="handleFileSelect"
  >
    <h4 class="title" :title="file[fileName]">
      <a-icon type="file" v-if="icon === 'default'" style="margin-right: 2px;"/>
      <img :src="fileIcon" class='file-icon' v-else/>
      <span>{{ file[fileName] }}</span>
    </h4>
    <span class="menu" v-if="hasContextmenus">
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
    icon: {
      type: String,
      default: 'default'
    },
    isSelect: {
      type: Boolean,
      default: false
    },
    contextmenus: {
      type: Array,
      default: function() {
        return []
      }
    },
    fileName: {
      type: String,
      default: 'name'
    }
  },
  data() {
    return {
      contenxtmenu: '',
      fileIcon: this.icon === 'default' ? '' : require(`@/assets/images/icon_${this.icon}.png`)
    }
  },
  mounted() {
    if (this.hasContextmenus) {
      this.initContextMenu()
    }
  },
  beforeDestroy() {
    if (this.hasContextmenus) {
      this.destoryContextMenu()
    }
  },
  computed: {
    hasContextmenus() {
      return this.contextmenus.length !== 0
    }
  },
  methods: {
    initContextMenu() {
      this.$refs.file && this.$refs.file.addEventListener('contextmenu', this.handleConextMenu)
    },
    destoryContextMenu() {
      this.$refs.file && this.$refs.file.removeEventListener('contextmenu', this.handleConextMenu)
    },
    handleConextMenu(e) {
      e.preventDefault()
      this.handleCreateMenu(e)
    },
    handleFileSelect() {
      this.$emit('fileSelect', this.file)
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

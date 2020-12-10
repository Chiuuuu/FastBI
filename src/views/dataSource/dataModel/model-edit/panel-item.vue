<template>
  <div class="u-bitem edit" :class="[className]" ref="file">
    <div class="txt">
      <div class="icon"><img :src="imgURI" /></div>
      <div class="name" :class="{ 'line-through': !itemData.visible }">{{ itemData.alias }}</div>
    </div>
    <span class="menu" v-if="hasContextmenus && itemData.visible">
      <span class="caret-down" @click="handleCreateMenu"></span>
    </span>
  </div>
</template>
<script>
import ContextMenu from '@/components/dataSource/contextmenu'
import { addClass, removeClass } from 'bin-ui/src/utils/dom'
export default {
  name: 'PanelItem',
  props: {
      className: {
        required: true,
        type: String,
        validator: function (value) {
            // 这个值必须匹配下列字符串中的一个
            return ['dimensions', 'measures'].indexOf(value) !== -1
        }
      },
      itemData: {
        type: Object,
        default: () => {}
      },
      detailInfo: {
        type: Object,
        default: () => {}
      },
      imgURI: {
          type: String,
          default: ''
      },
      contextmenus: {
        type: Array,
        default: function() {
            return []
        }
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
    handleCreateMenu(e) {
      e.stopPropagation()
      const that = this
      addClass(this.$refs.file, 'file-active')
      const styleObj = {
        left: this.className === 'dimensions' ? `${e.clientX}px` : `${e.clientX - 180}px`,
        top: `${e.clientY - (that.contextmenus.length + 1) * 28}px`
      }
       function addEvent(target) {
            target.$$fun = function () {
                Array.prototype.push.call(arguments, that)
                target.onClick.apply(this, arguments)
            }
       }
      this.contenxtmenu = new ContextMenu({
        menus: that.contextmenus.map(item => {
            if (item['children'] && item.children.length) {
                item.children.forEach(subitem => {
                    addEvent(subitem)
                })
            } else {
                addEvent(item)
            }
            return item
        }),
        styleObj,
        handleMarkCancel: function() {
          removeClass(that.$refs.file, 'file-active')
        }
      })
    }
  }
}
</script>

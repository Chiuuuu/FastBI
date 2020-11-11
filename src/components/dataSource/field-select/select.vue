<template>
  <div class="field-select" :class="isDimension ? 'is-dimension' : 'is-measure'">
    <span>{{ text }}</span>
    <div class="caret-down" @click="handleClick"></div>
  </div>
</template>

<script>
import ContextMenu from '@/components/dataSource/contextmenu'

export default {
  name: 'fieldSelect',
  props: {
    isDimension: {
      type: Boolean,
      default: false
    },
    contextmenus: Array,
    text: [String, Number],
    selectData: Object
  },
  data() {
    return {
      contenxtmenu: ''
    }
  },
  methods: {
    handleClick(e) {
      e.stopPropagation()
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
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.field-select {
  position: relative;
  width: 100px;
}
.caret-down {
  width: 0;
  height: 0;
  border: 6px solid white;
  position: absolute;
  top: 14px;
  right: 10px;
  transform: translateY(-50%);
  cursor: pointer;
}
.is-dimension {
  color: #4a90e2;
  .caret-down {
    border-color: #4a90e2 transparent transparent transparent;
  }
}
.is-measure {
  color: #40c0a8;
  .caret-down {
    border-color: #40c0a8 transparent transparent transparent;
  }
}
</style>

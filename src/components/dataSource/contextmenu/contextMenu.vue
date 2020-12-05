<template>
  <div class="m-overlay m-overlay-shadow" :style="styleObj">
    <div class="m-ctxMenu">
      <ul>
        <li
          class="z-clickable"
          v-for="item in renderMenus"
          :key="item.name"
          @click="handleItemClick($event, item)"
        >
          <span>{{ item.name }} <a-icon type="right" class="icon-cart" v-if="hasChildren(item)"/></span>
          <ul class="sub" v-if="hasChildren(item)">
            <li
              class="z-clickable"
              v-for="subitem in item.children"
              :key="subitem.name"
              @click="handleItemClick($event, subitem)"
            >
              {{ subitem.name }}
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { checkActionPermission } from '@/utils/permission'
export default {
  name: 'contextMenu',
  props: {
    menus: {
      type: Array,
      default: function() {
        return []
      }
    },
    styleObj: {
      type: Object,
      default: function() {
        return {}
      }
    },
    remove: {
      type: Function
    }
  },
  computed: {
    renderMenus() {
      return this.menus.filter(item => {
        let hasPermission = true
        if (item['permission']) {
          const { OBJECT, OPERATOR} = item.permission
          hasPermission = checkActionPermission(OBJECT, OPERATOR)
        }
        if (hasPermission) return item
      })
    }
  },
  methods: {
    hasChildren(item) {
      return item['children'] && item.children.length
    },
    handleItemClick(event, item) {
      if (item.$$fun) {
        this.remove()
        item.$$fun(event, item)
      }
    }
  }
}
</script>
<style lang="less" scoped>
.m-overlay {
  position: absolute;
  z-index: 1002;
}
.m-overlay-shadow {
  width: 182px;
  -webkit-box-shadow: 0 2px 14px rgba(0, 0, 0, 0.15);
  -moz-box-shadow: 0 2px 14px rgba(0, 0, 0, 0.15);
  -ms-box-shadow: 0 2px 14px rgba(0, 0, 0, 0.15);
  -o-box-shadow: 0 2px 14px rgba(0, 0, 0, 0.15);
  box-shadow: 0 2px 14px rgba(0, 0, 0, 0.15);
}
.m-ctxMenu {
  background: #fff;
  border: 1px solid #ccc;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.16);
  border-radius: 2px;
  ul{
    margin: 0;
  }
  li {
    cursor: default;
    position: relative;
    font-size: 12px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    -ms-box-sizing: border-box;
    -o-box-sizing: border-box;
    box-sizing: border-box;
    padding-left: 24px;
    padding-right: 18px;
    height: 32px;
    line-height: 32px;
    min-width: 180px;
    background-color: #fff;
    white-space: nowrap;
    &:hover {
      background-color: #e0e0e0;

      ul.sub {
        display: block;
      }
    }

    .icon-cart {
      position: absolute;
      right: 5px;
      top: 50%;
      transform: translateY(-50%);
    }

    ul.sub {
      display: none;
      position: absolute;
      left: -100%;
      top: 0;
      border: 1px solid #ccc;
      border-right: 0;
    }
  }
}
</style>

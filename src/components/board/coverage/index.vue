<template>
  <div class="board-coverage" :style="config.style">
    <div flex="dir:top" style="height: 100%;">
      <div class="header-title" v-show="config.title.enable">
        <span v-if="collapsed">{{ config.title.text }}</span> <a-icon type="menu-fold" class="pointer" @click="toggleCollapsed" />
      </div>
      <div class="control" :class="{'selected':currentSelected}" v-show="collapsed">
        <div class="context-menu-item"
             v-for="item in menuList" :key="item.order"
             @click="handleCommand(item)">
          <b-icon :name="item.icon" :title="item.text"></b-icon>
        </div>
      </div>
      <div class="control-body" flex-box="1" v-show="collapsed">
        <div class="body-wrap" @click="cancelSelected">
          <b-scrollbar style="height: 100%;">
            <slot></slot>
          </b-scrollbar>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

  import { mapGetters } from 'vuex'

  export default {
    name: 'BoardCoverage',

    props: {
      config: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        menuList: [
          { icon: 'md-arrow-round-up', text: '上移一层', order: 'up' },
          { icon: 'md-arrow-round-down', text: '下移一层', order: 'down' },
          { icon: 'ios-share', text: '置顶', order: 'top' },
          { icon: 'ios-download', text: '置底', order: 'bottom' }
        ],
        collapsed: true
      }
    },
    computed: {
      ...mapGetters(['currentSelected'])
    },
    methods: {
      // transform点击事件
      cancelSelected () {
        this.$store.dispatch('SingleSelected', null)
      },
      //  执行菜单命令
      handleCommand (item) {
        if (this.currentSelected) {
          this.$message(item.text)
          this.$store.dispatch('ContextMenuCommand', item.order)
        }
      },
      // 点击展开收起
      toggleCollapsed () {
        this.collapsed = !this.collapsed
        this.$emit('toggleCollapsed', this.collapsed)
      }
    }
  }
</script>

<template>
  <div class="sidebar">
    <div class="header">
      <img src="../../../assets/images/login/login_logo.png" />
    </div>
    <a-menu
      class="menu-body scrollbar"
      :openKeys="openKeys"
      :selectedKeys="selectedKeys"
      @openChange="v => openKeys = v"
      mode="inline"
    >
      <template v-for="item in menuData">
        <a-sub-menu :key="item.path">
          <template v-slot:title>
            <span>
              <img class="menu-icon" :src="require('@/assets/images/sidebar/' + item.meta.icon + '.png')">
              <span>{{ item.meta.title }}</span>
            </span>
          </template>
          <a-menu-item
            v-for="(subItem, index) in item.children"
            :key="subItem.path"
            class="sub-menu-icon"
            @click="selectMenu(subItem, index)"
          >{{ subItem.meta.title }}</a-menu-item>
        </a-sub-menu>
      </template>
    </a-menu>
  </div>
</template>
<script>
import ManageRoutes from '@/router/modules/layout'
import { getRenderRouter } from '@/utils/permission'
import isEqual from 'lodash/isEqual'
export default {
  data() {
    const renderRouter = getRenderRouter(this.$store.state.permission.routes)
    const menuData = this.getMenuData(renderRouter.children)
    const path = this.$route.path
    const defaultOpenKeys = ['/' + path.split('/').splice(1).shift()]
    const defaultSelectedKeys = [
      this.$router.currentRoute.meta.sideBar || this.$router.currentRoute.name
    ]
    return {
      menuData: menuData,
      openKeys: [],
      selectedKeys: []
    }
  },
  watch: {
    '$route.path': function (value) {
      this.selectedKeys = [
        this.$router.currentRoute.meta.sideBar || this.$router.currentRoute.name
      ] // [value.split('/').pop()]
    }
  },
  created() {
    this.setSelectKeys()
  },
  methods: {
    setSelectKeys() {
      const path = this.$route.path
      const key = '/' + path.split('/').splice(1).shift()
      if (!this.openKeys.includes(key)) {
        this.openKeys.push(key)
      }
      // this.openKeys = this.openKeys.concat(['/' + path.split('/').splice(1).shift()]).filter((path, index, list) => {
      //   return list.indexOf(path) === index
      // })
      this.selectedKeys = [this.$router.currentRoute.meta.sideBar || this.$router.currentRoute.name] // [value.split('/').pop()]
    },
    getMenuData(list) {
      const sidebar = []
      list.forEach((item) => {
        if (item.meta && item.meta.title) {
          const newItem = { ...item }
          delete newItem.children
          sidebar.push(newItem)
          if (item.children) {
            newItem.children = this.getMenuData(item.children)
          }
        }
      })
      return sidebar
    },
    // 点击选择菜单栏跳转页面
    selectMenu(item, index) {
      this.activeIndex = index
      this.$router.push({
        name: item.name
      })
    }
  }
}
</script>

<style lang="less" scoped>
@deep: ~'>>>';
.sidebar {
  background: #001529;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 220px;
  .header {
    height: 56px;
    line-height: 56px;
    padding-left: 20px;
    padding-right: 20px;
    position: relative;
    img {
      width: 100%;
    }
    span {
      color: #fff;
      font-weight: bold;
      font-size: 18px;
    }
  }
  .menu-body {
    height: calc(100% - 56px);
    overflow-y: auto;
    overflow-x: hidden;
  }
  // 一级菜单icon
  .menu-icon {
    width: 18px;
    height: 18px;
    vertical-align: top;
    margin-top: 10px;
    margin-right: 14px;
  }
  // 二级菜单圆点icon
  .sub-menu-icon {
    position: relative;
    padding-left: 56px !important;
  }
  .sub-menu-icon::before {
    content: "";
    position: absolute;
    left: 38px;
    top: 18px;
    background: rgba(0,0,0,.65);
    display: block;
    width: 4px;
    height: 4px;
    border-radius: 3px;
  }
  @{deep} .ant-menu-item-selected.sub-menu-icon::before,
  .sub-menu-icon:hover::before {
    background: #3875ff;
  }
}
</style>

<template>
  <div class="sidebar">
    <div class="header">
      <img src="../../../assets/images/login/login_logo.png" />
    </div>
    <a-menu
      class="menu-body scrollbar"
      :defaultOpenKeys="openKeys"
      :selectedKeys="selectedKeys"
      mode="inline"
      theme="dark"
    >
      <template v-for="item in menuData">
        <a-sub-menu :key="item.path">
          <template v-slot:title>
            <span>
              <a-icon :type="item.meta.icon" />
              <span>{{ item.meta.title }}</span>
            </span>
          </template>
          <a-menu-item
            v-for="subItem in item.children"
            :key="subItem.path"
            :title="subItem.path"
            @click="selectMenu(subItem)"
            >{{ subItem.meta.title }}</a-menu-item
          >
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
    const defaultSelectedKeys = [this.$router.currentRoute.meta.sideBar || this.$router.currentRoute.name]
    return {
      menuData: menuData,
      openKeys: defaultOpenKeys,
      selectedKeys: defaultSelectedKeys
    }
  },
  watch: {
    '$route.path': function(value) {
      this.selectedKeys = [this.$router.currentRoute.meta.sideBar || this.$router.currentRoute.name] // [value.split('/').pop()]
    }
  },
  methods: {
    getMenuData(list) {
      const sidebar = []
      list.forEach(item => {
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
    selectMenu(item, id) {
      this.$router.push({
        name: item.name
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
@import "./sidebar.styl";
</style>

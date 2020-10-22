<template>
  <div class="navbar">
    <div class="sidebar-unfold-icon">
      <!-- <img src="@/static/imgs/icon_expand.png" alt="" @click="sidebarUnfoldBtn" /> -->
    </div>
    <div class="user">
      <a-dropdown>
        <span>admin<img src="@/assets/images/icon_head_portrait.png" alt=""/></span>
        <a-menu slot="overlay">
          <a-menu-item>
            <a href="javascript:;" @click="quitBtn">退出登录</a>
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </div>
  </div>
</template>
<script>
export default {
  computed: {
    // 侧边栏展开收起
    sidebarUnfold() {
      return this.$store.state.common.sidebarUnfold
    },

    username() {
      return this.$store.state.common.username
    }
  },

  methods: {
    // 退出登录按钮
    quitBtn() {
      this.$router.push({
        path: '/login'
      })
      this.$store.dispatch('common/set_token', '')
      sessionStorage.clear()
    },

    // 点击收起展开侧边栏
    sidebarUnfoldBtn() {
      if (this.sidebarUnfold === true) {
        this.$store.commit('common/set_sidebarUnfold', false)
      } else {
        this.$store.commit('common/set_sidebarUnfold', true)
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
@import "./navbar.styl";
</style>

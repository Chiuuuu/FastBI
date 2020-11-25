<template>
  <a-row class="navbar" type="flex" justify="end" align="middle">
    <a-select
      default-value="lucy"
      style="width: 120px;margin-right:20px;"
      @change="handleChange">
      <a-select-option value="jack">
        Jack
      </a-select-option>
      <a-select-option value="lucy">
        Lucy
      </a-select-option>
      <a-select-option value="disabled" disabled>
        Disabled
      </a-select-option>
      <a-select-option value="Yiminghe">
        yiminghe
      </a-select-option>
    </a-select>
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
  </a-row>
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
    async handleChange(value) {
      console.log(`selected ${value}`)
      console.log(this.$router)
      const result = await this.$store.dispatch('user/changeRole')
      this.$EventBus.$emit('resetMenu')
      this.$router.push({
        path: '/'
      })
    },
    // 退出登录按钮
    quitBtn() {
      this.$store.dispatch('common/set_token', '')
      sessionStorage.clear()
      this.$store.commit('user/CLEAR_PERMISSIONS')
      this.$router.push({
        path: '/login'
      })
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

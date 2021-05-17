<template>
  <a-row class="navbar" type="flex" justify="end" align="middle">
    <a-select
      :value="selectProject"
      style="min-width: 120px;margin-right:20px;"
      @change="handleChangeProject"
    >
      <a-select-option v-for="item in projectList" :key="item.id">{{
        item.name
      }}</a-select-option>
    </a-select>
    <!-- 图表推送 -->
    <a-dropdown placement="bottomCenter">
      <a-icon type="bell" style="font-size:20px;color:grey;margin-right:10px" />
      <vue-seamless-scroll
        :data="shareChartList"
        :class-option="defaultOption"
        class="scroll-list"
        style="max-height:300px;overflow:hidden;background:white"
        slot="overlay"
      >
        <a-menu>
          <a-menu-item
            class="scroll-list-menu-item"
            style="height:30px;line-height:30px;margin:0"
            v-for="(item, index) in shareChartList"
            :key="index"
          >
            <span @click="checkChartDetail">{{ item.title }}</span>
          </a-menu-item>
        </a-menu>
      </vue-seamless-scroll>
    </a-dropdown>
    <div class="user">
      <a-dropdown>
        <span
          >{{ userInfo.name
          }}<img src="@/assets/images/icon_head_portrait.png" alt=""
        /></span>
        <a-menu slot="overlay">
          <a-menu-item>
            <a href="javascript:;" @click="clearBtn">清除缓存</a>
          </a-menu-item>
          <a-menu-item>
            <a href="javascript:;" @click="quitBtn">退出登录</a>
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </div>
  </a-row>
</template>
<script>
import { mapState } from 'vuex'
export default {
  inject: ['reload'],
  computed: {
    // 侧边栏展开收起
    sidebarUnfold() {
      return this.$store.state.common.sidebarUnfold
    },
    ...mapState({
      selectProject: state => state.user.selectProject,
      projectList: state => state.user.projectList,
      userInfo: state => state.user.info
    }),
    defaultOption() {
      return {
        step: 0.1, // 数值越大速度滚动越快
        limitMoveNum: 10, // 开始无缝滚动的数据量 this.dataList.length
        hoverStop: true, // 是否开启鼠标悬停stop
        direction: 1, // 0向下 1向上 2向左 3向右
        openWatch: true, // 开启数据实时监控刷新dom
        singleHeight: 0, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
        singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
        waitTime: 1000 // 单步运动停止的时间(默认值1000ms)
      }
    }
  },
  data() {
    return {
      shareChartList: [
        { title: '​统计饼图（我的电视大屏，王小明，2021-05-13 11:05:00）' }
      ]
    }
  },
  methods: {
    handleChangeProject(value) {
      this.$confirm({
        title: '确认提示',
        content: '是否切换项目?',
        onOk: async () => {
          const result = await this.$server.user.actionSwitchProject(value)
          if (result.code === 200) {
            await this.$store.dispatch('user/changeRole')
            // this.reload()
            window.location.reload() // 重刷方法1,但是会闪白
          } else {
            this.$message.error(result.msg || '请求错误')
          }
        }
      })
    },
    // 退出登录按钮
    quitBtn() {
      this.$store.dispatch('common/set_token', '')
      window.sessionStorage.clear()
      window.localStorage.clear()
      this.$store.commit('user/CLEAR_PERMISSIONS')
      this.$router.push({
        path: '/login'
      })
    },
    // 清除缓存
    clearBtn() {
      const dely = Math.floor(Math.random() * 3 + 1) // 1~3
      this.$message
        .success({
          content: '正在清除缓存,完成后将跳转至登录',
          duration: dely
        })
        .then(() => {
          this.quitBtn()
        })
    },

    // 点击收起展开侧边栏
    sidebarUnfoldBtn() {
      if (this.sidebarUnfold === true) {
        this.$store.commit('common/set_sidebarUnfold', false)
      } else {
        this.$store.commit('common/set_sidebarUnfold', true)
      }
    },
    // 查看图表推送详情
    checkChartDetail() {
      let tempwindow = window.open('_blank')
      // pdf测试
      let url = 'https://web.stanford.edu/~xgzhou/zhou_book2017.pdf'
      tempwindow.location = url
    }
  }
}
</script>

<style lang="stylus" scoped>
@import "./navbar.styl";
</style>

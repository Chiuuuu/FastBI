<template>
  <div class="main">
    <a-spin class="main-box" :spinning="spinning">
      <div class="right">
        <a-tabs class="tabs">
          <a-tab-pane key="1" tab="人员管理">
            <person-manage ref="person" />
          </a-tab-pane>
          <a-tab-pane key="2" tab="用户属性">
            <user-prop ref="user" />
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-spin>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import PersonManage from '../persn-content/personManage'
import UserProp from '../persn-content/userProp'

export default {
  name: 'userMain',
  components: {
    PersonManage,
    UserProp
  },
  data() {
   return {
      spinning: false,
      detailInfo: {}
    }
  },
  methods: {
    // handleChangeModule(key) {
    //   if (key === '1') {
    //     this.$refs.person.getPersonList()
    //   } else if (key === '2') {
    //     this.$refs.user.getUserList()
    //   }
    // },
    handleSwitch(value, record) {
      record.enable = value
    }
  }
}
</script>

<style lang="less" scoped>
@import "../../../main.less";
</style>

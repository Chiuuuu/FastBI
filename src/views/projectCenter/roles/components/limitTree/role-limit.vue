<template>
  <div class="tab scrollbar">
    <a-row class="line">
      <a-col span="2">{{ roleTitle }}</a-col>
      <a-col>
        <a-checkbox-group
          :value="options.permissions"
          :options="options.header"
          :disabled="isDisabled"
          @change="onCheck"
          ></a-checkbox-group>
      </a-col>
    </a-row>
    <a-row class="line">
      <a-col span="14">所有目录</a-col>
      <a-col span="2" align="left" v-for="item in injectActionList" :key="item.permission">{{item.name}}</a-col>
    </a-row>
    <div class="content scrollbar">
      <limit-tree v-on="$listeners"></limit-tree>
    </div>
  </div>
</template>

<script>
import LimitTree from './limit-tree'
export default {
  name: 'roleLimit',
  inject: ['status', 'getProvideActionList', 'getCurrentRoleTab', 'getCheckedKeys'],
  props: {
    roleTitle: String,
    options: Object
  },
  components: {
    LimitTree
  },
  computed: {
    injectActionList() {
      return this.getProvideActionList()
    },
    injectRoleTab() {
      return this.getCurrentRoleTab()
    },
    isDisabled() {
      if (this.status === 'show') {
        return true
      } else {
        const checkedKeys = this.getCheckedKeys()
        const currentTab = this.injectRoleTab
        let key = ''
        switch (currentTab) {
          case 1:
            key = '03'
            break
          case 2:
            key = '02'
            break
          case 3:
            key = '01'
            break
        }
        const hasKey = checkedKeys.includes(key)
        return !hasKey
      }
    }
  },
  methods: {
    onCheck(value) {
      this.options.permissions = value
      this.$emit('setBasePrivilege', value, this.injectRoleTab + '')
    }
  }
  // watch: {
  //   injectActionList: {
  //     deep: true,
  //     handler(e) {
  //       console.log("watch", e);
  //     }
  //   }
  // },
}
</script>

<style>

</style>

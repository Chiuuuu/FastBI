<template>
  <div class="main">
    <a-empty v-if="!permissionId" class="main-empty">
      <span slot="description">请新建数据权限或者选中左侧数据权限</span>
    </a-empty>
    <template v-else>
      <div class="right">
        <a-tabs class="tabs" @change="handleChangeModule">
          <a-tab-pane key="1" tab="行级权限">
            <Content type="row" />
          </a-tab-pane>
          <a-tab-pane key="2" tab="列级权限">
            <Content type="col" />
          </a-tab-pane>
        </a-tabs>
      </div>
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Content from '../tab-content/content'

export default {
  name: 'permMain',
  components: {
    Content
  },
  data() {
    return {
    }
  },
  computed: {
    ...mapState({
      permissionId: state => state.projectPermissions.permissionId,
      formInfo: state => state.projectPermissions.permissionInfo
    })
  },
  methods: {
    handleChangeModule(key) {
      if (key === '1') {
        this.$store.commit('projectPermissions/SET_EDITTYPE', 'row')
      } else if (key === '2') {
        this.$store.commit('projectPermissions/SET_EDITTYPE', 'col')
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import "../../../main.less";
@{deep} .content .ant-form-item-label {
    width: 100px !important;
    padding-left: 16px;
    label {
        color: rgba(0, 0, 0, 0.65);
    }
}
</style>

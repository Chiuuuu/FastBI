<template>
  <div class="tab scrollbar">
    <header>
      <div class="role-info">
        <div>角色名称：<span></span></div>
        <div class="line">角色描述：</div>
      </div>
      <a-button class="main-button" type="primary" @click="edit"
        >编辑用户</a-button
      >
    </header>
    <RoleTabeRole status="show"></RoleTabeRole>
    <RolesTabDataPermission status="show"></RolesTabDataPermission>
  </div>
</template>
<script>
import RolesTabDataPermission from '../tab-content/rolesTabDataPermission'
import RoleTabeRole from '../tab-content/rolesTabRole'

export default {
    name: 'rolePermission',
    components: {
        RolesTabDataPermission,
        RoleTabeRole
    },
    methods: {
        edit() {
          // 切换至编辑模式
          this.$store.commit('projectRoles/SET_ROLEMODE', 'edit')
          this.$router.push({
              path: '/projectCenter/roles/edit/id=' + 123
          })
        }
    }
}
</script>

const RouteView = () => import('@/layout/routeView')
const UsersView = () => import('@/views/projectCenter/users')
const RolesView = () => import('@/views/projectCenter/roles')
const PermissionsView = () => import('@/views/projectCenter/permissions')

export default {
  path: '/projectCenter',
  redirect: '/projectCenter/users',
  component: RouteView,
  meta: {
    title: '项目中心',
    icon: 'apartment'
  },
  children: [
    {
      path: 'users',
      name: 'users',
      component: UsersView,
      meta: {
        title: '用户管理'
      }
    },
    {
      path: 'roles',
      name: 'roles',
      component: RolesView,
      meta: {
        title: '角色管理'
      }
    },
    {
      path: 'permissions',
      name: 'permissions',
      component: PermissionsView,
      meta: {
        title: '数据权限管理'
      }
    }
  ]
}

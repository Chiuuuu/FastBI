import PERMISSION_CODE from '@/config/permission'

const RouteView = () => import('@/layout/routeView')
const catalogView = () => import('@/views/screenManage/screenCatalog/screenCatalog')

export default {
  path: '/screenManage',
  redirect: '/screenManage/catalog',
  component: RouteView,
  meta: {
    title: '大屏管理',
    icon: 'desktop',
    permissions: [PERMISSION_CODE.PAGE.screen]
  },
  children: [
    {
      path: 'catalog',
      name: 'catalog',
      component: catalogView,
      meta: {
        title: '大屏目录',
        permissions: [PERMISSION_CODE.PAGE.screen]
      }
    }
  ]
}

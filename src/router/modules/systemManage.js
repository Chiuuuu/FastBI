import PERMISSION_CODE from '@/config/permission'

const RouteView = () => import('@/layout/routeView')
const recordView = () => import('@/views/systemManage/record')
const OAView = () => import('@/views/systemManage/OAManage')

export default {
  path: '/systemManage',
  redirect: '/systemManage/record',
  component: RouteView,
  meta: {
    title: '系统管理',
    icon: 'setting',
    permissions: [PERMISSION_CODE.PAGE.systemManage]
  },
  children: [
    {
      path: 'record',
      name: 'record',
      component: recordView,
      meta: {
        title: '操作记录',
        permissions: [PERMISSION_CODE.PAGE.systemManage]
      }
    },
    {
      path: 'OAManage',
      name: 'OAManage',
      component: OAView,
      meta: {
        title: 'OA发布管理',
        permissions: [PERMISSION_CODE.PAGE.systemManage]
      }
    }
  ]
}

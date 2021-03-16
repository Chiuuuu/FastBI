import PERMISSION_CODE from '@/config/permission'

const RouteView = () => import('@/layout/routeView')
const LabelListView = () => import('@/views/label')

export default {
  path: '/label',
  redirect: '/label/labelList',
  component: RouteView,
  meta: {
    title: '标签管理',
    icon: 'tags',
    permissions: [PERMISSION_CODE.PAGE.label]
  },
  children: [
    {
      path: 'labelList',
      name: 'labelList',
      component: LabelListView,
      meta: {
        title: '标签列表',
        permissions: [PERMISSION_CODE.PAGE.label]
      }
    }
  ]
}

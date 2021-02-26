// import PERMISSION_CODE from '@/config/permission'

const RouteView = () => import('@/layout/routeView')
const LabelListView = () => import('@/views/label/list')

export default {
  path: '/label',
  redirect: '/label/list',
  component: RouteView,
  meta: {
    title: '标签管理',
    icon: 'cloud'
  },
  children: [
    {
      path: 'labelList',
      name: 'labelList',
      component: LabelListView,
      meta: {
        title: '标签列表'
      }
    }
  ]
}

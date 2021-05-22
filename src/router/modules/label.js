import PERMISSION_CODE from '@/config/permission'

const RouteView = () => import('@/layout/routeView')
const PageView = () => import('@/layout/pageView')
const LabelListView = () => import('@/views/label/list.vue')
const LabelEditView = () => import('@/views/label/edit.vue')

export default {
  path: '/label',
  redirect: '/label/labelManage',
  component: RouteView,
  meta: {
    title: '标签管理',
    icon: 'tags',
    permissions: [PERMISSION_CODE.PAGE.label]
  },
  children: [
    {
      path: 'labelManage',
      name: 'labelManage',
      redirect: '/label/labelManage/labelList',
      component: PageView,
      meta: {
        title: '标签列表',
        permissions: [PERMISSION_CODE.PAGE.label]
      },
      children: [
        {
          path: 'labelList',
          name: 'labelList',
          component: LabelListView,
          meta: {
            sideBar: 'labelManage',
            permissions: [PERMISSION_CODE.PAGE.label]
          }
        },
        {
          path: 'labelEdit',
          name: 'labelEdit',
          component: LabelEditView,
          meta: {
            sideBar: 'labelManage',
            permissions: [PERMISSION_CODE.PAGE.label]
          }
        }
      ]
    }
  ]
}

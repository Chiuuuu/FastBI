import PERMISSION_CODE from '@/config/permission'

const RouteView = () => import('@/layout/routeView')
const areaMapView = () => import('@/views/areaManage/areaMap')
const areaMapPreview = () => import('@/views/areaManage/areaMap/preview')
const areaMapEditView = () => import('@/views/areaManage/areaMap/edit')
const areaMapListView = () => import('@/views/areaManage/areaList')

export default {
  path: '/areaManage',
  redirect: '/areaManage/areaMap',
  component: RouteView,
  meta: {
    title: '片区管理',
    icon: 'environment',
    permissions: [PERMISSION_CODE.PAGE.areaManage]
  },
  children: [
    {
      path: 'areaMap',
      name: 'areaMap',
      redirect: '/areaManage/areaMap/areaPreview',
      component: areaMapView,
      meta: {
        title: '片区地图',
        permissions: [PERMISSION_CODE.PAGE.areaManage]
      },
      children: [
        {
          path: 'areaPreview',
          name: 'areaPreview',
          component: areaMapPreview,
          meta: {
            sideBar: 'areaMap', // 用于显示对对应的菜单
            permissions: [PERMISSION_CODE.PAGE.areaManage]
          }
        },
        {
          path: 'areaEdit',
          name: 'areaEdit',
          component: areaMapEditView,
          meta: {
            sideBar: 'areaMap', // 用于显示对对应的菜单
            permissions: [PERMISSION_CODE.PAGE.areaManage]
          }
        }
      ]
    },
    {
      path: 'areaList',
      name: 'areaList',
      component: areaMapListView,
      meta: {
        title: '片区地址',
        permissions: [PERMISSION_CODE.PAGE.areaManage]
      }
    }
  ]
}

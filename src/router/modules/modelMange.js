import PERMISSION_CODE from '@/config/permission'

const RouteView = () => import('@/layout/routeView')
const DictListView = () => import('@/views/dictionary')
const PageView = () => import('@/layout/pageView')
const dataModelView = () => import('@/views/dataSource/dataModel/dataModel')
const dataModelEditView = () => import('@/views/dataSource/dataModel/model-edit/Model-Edit')

export default {
  path: '/dictionary',
  redirect: '/dictionary/dictList',
  component: RouteView,
  meta: {
    title: '数据模型管理',
    icon: 'database',
    permissions: [PERMISSION_CODE.PAGE.modelMange, PERMISSION_CODE.PAGE.dataDictionary]
  },
  children: [
    {
      path: 'dataModel',
      name: 'dataModel',
      redirect: '/dataSource/dataModel/modelShow',
      component: PageView,
      meta: {
        title: '模型管理',
        permissions: [PERMISSION_CODE.PAGE.modelMange]
      },
      children: [
        {
          path: 'modelShow',
          name: 'modelShow',
          component: dataModelView,
          meta: {
            sideBar: 'dataModel', // 用于显示对对应的菜单
            permissions: [PERMISSION_CODE.PAGE.modelMange]
          }
        },
        {
          path: 'modelEdit',
          name: 'modelEdit',
          component: dataModelEditView,
          meta: {
            sideBar: 'dataModel',
            permissions: [PERMISSION_CODE.PAGE.modelMange]
          }
        }
      ]
    },
    {
      path: 'dictList',
      name: 'dictList',
      component: DictListView,
      meta: {
        title: '数据字典',
        permissions: [PERMISSION_CODE.PAGE.dataDictionary]
      }
    }
  ]
}

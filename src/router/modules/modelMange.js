import PERMISSION_CODE from '@/config/permission'

const RouteView = () => import('@/layout/routeView')
const DictListView = () => import('@/views/dictionary')
const PageView = () => import('@/layout/pageView')
const dataModelView = () => import('@/views/modelMange/dataModel/dataModel')
const dataModelEditView = () => import('@/views/modelMange/dataModel/model-edit/Model-Edit')

export default {
  path: '/modelMange',
  redirect: '/modelMange/mangeModel',
  component: RouteView,
  meta: {
    title: '数据模型管理',
    icon: 'database',
    permissions: [PERMISSION_CODE.PAGE.modelMange]
  },
  children: [
    {
      path: 'mangeModel',
      name: 'mangeModel',
      redirect: '/modelMange/mangeModel/mangeModelShow',
      component: PageView,
      meta: {
        title: '模型管理',
        permissions: [PERMISSION_CODE.PAGE.modelMange]
      },
      children: [
        {
          path: 'mangeModelShow',
          name: 'mangeModelShow',
          component: dataModelView,
          meta: {
            sideBar: 'mangeModel', // 用于显示对对应的菜单
            permissions: [PERMISSION_CODE.PAGE.modelMange]
          }
        },
        {
          path: 'mangeModelEdit',
          name: 'mangeModelEdit',
          component: dataModelEditView,
          meta: {
            sideBar: 'mangeModel',
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

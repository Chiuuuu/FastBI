const RouteView = () => import('@/layout/routeView')
const dataAccessView = () => import('@/views/dataSource/dataAccess/dataAccess')
const dataModelView = () => import('@/views/dataSource/dataModel/dataModel')
const dataModelEditView = () => import('@/views/dataSource/dataModel/model-edit/Model-Edit')

export default {
  path: '/dataSource',
  redirect: '/dataSource/dataAccess',
  component: RouteView,
  meta: {
    title: '数据源',
    icon: 'apartment'
  },
  children: [
    {
      path: 'dataAccess',
      name: 'dataAccess',
      component: dataAccessView,
      meta: {
        title: '数据接入'
      }
    },
    {
      path: 'dataModel',
      name: 'dataModel',
      component: dataModelView,
      meta: {
        title: '数据模型'
      }
    },
    {
      path: 'dataModelEdit',
      name: 'dataModelEdit',
      component: dataModelEditView
    }
  ]
}

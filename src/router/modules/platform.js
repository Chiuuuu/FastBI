// import PERMISSION_CODE from '@/config/permission'

const RouteView = () => import('@/layout/routeView')
const LogView = () => import('@/views/platform/log')
const SystemMonitoringView = () => import('@/views/platform/systemMonitoring')

export default {
  path: '/platform',
  redirect: '/platform/systemMonitoring',
  component: RouteView,
  meta: {
    title: '平台管理',
    icon: 'cloud'
  },
  children: [
    {
      path: 'systemLog',
      name: 'systemLog',
      component: LogView,
      meta: {
        title: '日志管理'
      }
    },
    {
      path: 'systemMonitoring',
      name: 'systemMonitoring',
      component: SystemMonitoringView,
      meta: {
        title: '系统监控'
      }
    }
  ]
}

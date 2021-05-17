import PERMISSION_CODE from '@/config/permission'

const RouteView = () => import('@/layout/routeView')
const LogView = () => import('@/views/platform/log')
const ScheduleView = () => import('@/views/platform/schedule')
const SystemMonitoringView = () => import('@/views/platform/systemMonitoring')

export default {
  path: '/platform',
  redirect: '/platform/systemMonitoring',
  component: RouteView,
  meta: {
    title: '系统管理',
    icon: 'layout',
    permissions: [PERMISSION_CODE.PAGE.log, PERMISSION_CODE.PAGE.monitoring]
  },
  children: [
    {
      path: 'systemLog',
      name: 'systemLog',
      component: LogView,
      meta: {
        title: '日志管理',
        permissions: [PERMISSION_CODE.PAGE.log]
      }
    },
    {
      path: 'systemMonitoring',
      name: 'systemMonitoring',
      component: SystemMonitoringView,
      meta: {
        title: '系统监控',
        permissions: [PERMISSION_CODE.PAGE.monitoring]
      }
    },
    {
      path: 'systemSchedule',
      name: 'systemSchedule',
      component: ScheduleView,
      meta: {
        title: '存储管理'
      }
    }
  ]
}

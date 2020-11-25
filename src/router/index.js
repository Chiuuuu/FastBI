import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store/index'
// 路由数据

import BinUI from 'bin-ui'
import { Modal } from 'ant-design-vue'

import { commonRoutes } from '@/router/routes'
Vue.use(BinUI)

Vue.use(VueRouter)

const whiteList = ['/login']

const createRouter = () => new VueRouter({
  base: process.env.BASE_URL,
  routes: commonRoutes
})

const router = createRouter()

/**
 * @export 重置路由
 */
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

router.beforeEach(async (to, from, next) => {
  BinUI.LoadingBar.start()
  Modal.destroyAll()
  store.dispatch('SingleSelected', null)

  const hasToken = store.state.common.adminToken

  if (hasToken) {
    if (to.path === '/login') {
      next()
      BinUI.LoadingBar.done()
    } else {
      const hasRouterPermission = store.state.user.routesModule && store.state.user.routesModule.length > 0
      if (hasRouterPermission) {
        next()
      } else {
        try {
          // 获取用户的对应的路由权限
          const { routesModule } = await store.dispatch('user/getInfo')
          // 先在添加之前先清空之前的路由防止重复添加
          resetRouter()
          // 根据路由权限动态设置路由
          const accessRoutes = await store.dispatch('permission/generateRoutes', routesModule)
          router.addRoutes(accessRoutes)
          next({ ...to, replace: true })
        } catch (error) {
          next(`/login?redirect=${to.path}`)
          BinUI.LoadingBar.done()
        }
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
      BinUI.LoadingBar.done()
    }
  }
})

router.afterEach(() => {
  BinUI.LoadingBar.done()
})

export default router

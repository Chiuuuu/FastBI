import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store/index'
// 路由数据
// import routes from './routes'

import BinUI from 'bin-ui'
import { Modal } from 'ant-design-vue'

import { commonRoutes, asyncRoutes } from '@/router/routes'

Vue.use(BinUI)

Vue.use(VueRouter)

// 导出路由 在 main.js 里使用
// const router = new VueRouter({
//   base: process.env.BASE_URL,
//   routes
// })

const whiteList = ['/login']

const createRouter = () => new VueRouter({
  base: process.env.BASE_URL,
  routes: commonRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

window.roles = []

router.beforeEach((to, from, next) => {
  BinUI.LoadingBar.start()
  Modal.destroyAll()
  store.dispatch('SingleSelected', null)

  const hasToken = store.state.common.adminToken

  if (hasToken) {
    if (to.path === '/login') {
      next()
      BinUI.LoadingBar.done()
    } else {
      if (window.roles && window.roles.length > 0) {
        next()
      } else {
        try {
          window.roles.push(1)
          // 根据你的token获取你的role，组成前端路由
          const accessRoutes = commonRoutes.concat(asyncRoutes)
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

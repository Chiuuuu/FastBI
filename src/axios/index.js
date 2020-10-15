/**
 *创建axios服务实例
 * 为方便起见，为所有支持的请求方法提供了别名
 * @example
  axios.get(url[, config])
  axios.delete(url[, config])
  axios.post(url[, data[, config]])
  axios.put(url[, data[, config]])
  注意
  在使用别名方法时， url、method、data 这些属性都不必在配置中指定。
*/
import axios from 'axios'
import baseURL from '@/api/base'
import store from '@/store'
import router from '@/router'
// import { messages } from 'bin-ui'
import { message } from 'ant-design-vue'

const service = axios.create({
  baseURL,
  headers: {
    'X-Requested-With': 'XMLHttpRequest'
  },
  timeout: 60000 // 请求超时时间
})

const errorHandle = {
  401: function(msg) {
    message.error(msg || '未登录状态，跳转登录页')
  },
  403: function(msg) {
    message.error(msg || '登录过期，请重新登录')
    router.replace('/login')
  },
  404: function(msg) {
    message.error(msg || '请求资源不存在')
  }
  // 500: function(msg) {
  //   message.error(msg || '请求异常')
  // }
}

// 添加请求拦截器
service.interceptors.request.use(
  function(config) {
    const { adminToken, expires } = store.state.common
    if (adminToken) {
      // 判断token是否存在，如果存在则每个请求都带上token
      // Bearer是JWT的认证头部信息
      config.headers.common['Authorization'] = `Bearer ${adminToken}`
    }

    // 判断token过期时间, 暂定剩余3分钟刷新token
    if (!expires || expires - (+new Date()) <= 3 * 60 * 1000) {
      const user = JSON.parse(window.localStorage.getItem('user'))
      store.dispatch('common/get_token', user)
    }

    return config
  },
  function(error) {
    return Promise.reject(error)
  }
)

/**
 * respone拦截器
 */
service.interceptors.response.use(
  response => {
    const { code, msg } = response.data
    if (code !== 200) {
      const errorHandleFun = errorHandle[code]
      if (errorHandleFun instanceof Function) {
        errorHandleFun(msg)
        return Promise.reject(msg)
      }
    }
    return response.data
  },
  error => {
    const { response } = error
    // messages({ content: response ? response.data : '请求错误', type: 'danger', duration: 5 })
    message.error(response ? response.data : '请求错误')
    return Promise.reject(error)
  }
)

export default service

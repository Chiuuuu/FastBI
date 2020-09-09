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
import { messages } from 'bin-ui'
const service = axios.create({
  baseURL,
  headers: {
    'X-Requested-With': 'XMLHttpRequest'
  },
  timeout: 60000 // 请求超时时间
})

const errorHandle = {
  401: function(message) {
    console.log(message || '未登录状态，跳转登录页')
  },
  403: function(message) {
    console.log(message || '登录过期，请重新登录')
  },
  404: function(message) {
    console.log(message || '请求资源不存在')
  }
}

// 添加请求拦截器
service.interceptors.request.use(
  function(config) {
    const token = store.state.common.adminToken
    if (token) {
      // 判断token是否存在，如果存在则每个请求都带上token
      // Bearer是JWT的认证头部信息
      config.headers.common['Authorization'] = `Bearer ${token}`
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
    const { code, message } = response.data
    if (code !== 200) {
      const errorHandleFun = errorHandle[code]
      if (errorHandleFun instanceof Function) {
        errorHandleFun(message)
      } else {
        return Promise.reject(message)
      }
    }
    return response.data
  },
  error => {
    messages({ content: response ? response.data : message, type: 'danger', duration: 5 })
    return Promise.reject(error)
  }
)

export default service

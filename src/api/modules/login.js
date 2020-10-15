import $axios from 'axios'
import baseURL from '@/api/base'

const login = {
  /**
 * 新建文件夹
 * @description 登录
 * @param {Object} params 登录参数
 */
  actionLogin(params) {
    return $axios.post(baseURL + '/login', params)
  }
}

export default login

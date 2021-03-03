import $axios from '@/axios'

export default {
  /**
   * @description 获取日志信息
   * @param {Object} params 请求参数
   * @returns
   */
  getLogList(params) {
    return $axios.post('/platform/logger/checklog', params)
  }
}

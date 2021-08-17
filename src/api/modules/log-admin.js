import $axios from '@/axios'
export default {
  /**
   * @description 获取日志列表
   * @param {Object} [params={}] 请求参数
   * @returns
   */
  getOperaLogList(params = {}) {
    return $axios.post(`/system/operaLog/query`, params)
  }
}

import $axios from '@/axios'

export default {
  /**
   * @description 获取日志信息
   * @param {Object} params 请求参数
   * @returns
   */
  getLogList({ date, current }) {
    return $axios.get(`/platform/logger/v2/checklog/${date}/${current}`)
  }
}

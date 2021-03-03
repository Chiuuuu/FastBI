import $axios from '@/axios'

const systemMonitoring = {
  /**
   * @description 展示当前用户
   * @returns
   */
  showCurrentUser() {
    return $axios.get('/platform/monitor/queryOnlineUserList')
  },
  /**
   * @description 统计图数据
   * @param {Object} params 请求参数
   * @returns
   */
  showChartData(params) {
    return $axios.post('/platform/monitor/countSystemLogin', params)
  },
  /**
   * @description 剔除用户数据
   * @param {Object} params 请求参数
   * @returns
   */
  deleteUserData(params) {
    return $axios.post('/platform/monitor/removeOnlineUser', params)
  }
}

export default systemMonitoring

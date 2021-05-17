import $axios from '@/axios'

export default {
  /**
   * @description 展示当前用户
   * @returns
   */
   getRunningSchedules() {
    return $axios.get('/system/schedule/getRunningSchedules')
  }
}

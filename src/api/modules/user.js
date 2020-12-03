import $axios from '@/axios'

export default {
    /**
     * @description 获取用户信息
     * @returns
     */
    getUserInfo() {
        return $axios.get()
    }
}

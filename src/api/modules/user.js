import $axios from '@/axios'

export default {
    /**
     * @description 获取用户信息
     * @returns
     */
    getUserInfo() {
        return $axios.get('/getInfo')
    },
    /**
     * @description 切换项目
     * @param {Number} id 项目id
     * @returns
     */
    actionSwitchProject(id) {
        return $axios.post('/switchProject', { id })
    }
}

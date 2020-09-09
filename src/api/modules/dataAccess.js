import $axios from '@/axios'
export default {
    /**
     * @description 连接数据库
     * @param {Object} [params={}] 请求参数
     * @returns
     */
    actionConnect(type, params = {}) {
        return $axios.post(`/system/${type}/connect`, params)
    },
    /**
     * @description 读取数据库列表
     * @param {string} type 类型
     * @param {Object} [params={}] 请求参数
     * @returns
     */
    getTableList(type, params = {}) {
        return $axios.post(`/system/${type}/read/table`, params)
    },
    /**
     * @description 获取表的具体字段信息
     * @param {string} type 类型
     * @param {Object} [params={}] 请求参数
     * @returns {Object} 字段详细信息
     */
    getTableFieldDetail(type, params = {}) {
        return $axios.post(`/system/${type}/get/field`, params)
    },
    /**
     * @description 保存数据表
     * @param {Object} [params={}] 请求参数
     * @returns
     */
    saveTable(params = {}) {
        return $axios.post('/system/sourceTbale/save/table', params)
    },
    /**
     * @description 保存修改表字段
     * @param {Object} [params={}] 请求参数
     * @returns
     */
    saveTableField(params = {}) {
        return $axios.post('/system/field/save/field', params)
    },
    /**
     * @description 全部抽取
     * @param {String} type 类型
     * @param {Object} [params={}] 请求参数
     * @returns
     */
    actionExtract(type, params = {}) {
        return $axios.post(`/system/${type}/connect`, params)
    }
}

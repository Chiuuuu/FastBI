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
     * @description 获取表的具体字段信息
     * @param {string} type 类型
     * @param {Object} [params={}] 请求参数
     * @returns {Object} 字段详细信息
     */
    getTableFieldDetail(type, params = {}) {
        return $axios.post(`/system/${type}/get/field`, params)
    },
    /**
     * @description 读取数据库的表
     * @param {string} type 类型
     * @param {Object} params 请求参数
     * @param {string} params.databaseName 数据库名称
     * @param {string} params.sourceOracleName 源名称
     * @returns
     */
    getTableList(type, params) {
        return $axios.post(`/system/${type}/read/table`, params)
    },
    /**
     * @description 保存数据信息
     * @param {string} url 请求地址
     * @param {Object} [params={}] 请求参数
     * @returns
     */
    saveTableInfo(url, params = {}) {
        return $axios.post(url, params)
    },
    /**
     * @description 保存数据表
     * @param {Object} [params={}] 请求参数
     * @returns
     */
    saveDataTable(params = {}) {
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
     * @param {String} url  请求地址
     * @param {Object} [params={}] 请求参数
     * @returns
     */
    actionExtract(url, params = {}) {
        return $axios.post(url, params)
    }
}

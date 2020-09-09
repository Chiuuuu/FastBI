import $axios from '@/axios'

export default {
    /**
     * @description 编辑状态，获取左侧菜单列表
     * @param {string | number} id 表id
     * @returns
     */
    getTableListById(id) {
        return $axios.get(`/datamodel/datamodelInfo/getDataSourceTableInfo/${id}`)
    },
    /**
     * @description 编辑状态，获取左右两表的关系
     * @param {Object} params 请求参数
     * @returns
     */
    getBetweenJoin(params) {
        return $axios.post('/datamodel/datamodelInfo/getTableConfigInfo', params)
    },
    /**
     * @description 更新数据模型信息
     * @param {Object} params 请求参数
     * @returns
     */
    putModelDetail(params) {
        return $axios.post('/datamodel/datamodelInfo/getDataSourceTableInfo', params)
    },
    /**
     * @description 新增数据模型
     * @param {string | number} id 表id
     * @param {Object} params 请求参数
     * @returns
     */
    addModel(id, params) {
        return $axios.post(`/datamodel/datamodelInfo/createDataModelInfo/${id}`, params)
    },
    /**
     * @description 保存数据模型
     * @param {Object} params 请求参数
     * @returns
     */
    saveModel(params) {
        return $axios.post('/datamodel/datamodelInfo/updataDataModelInfo', params)
    }
}

import $axios from '@/axios'
export default {
    /**
     * @description 连接数据库
     * @param {Object} [params={}] 请求参数
     * @returns
     */
    actionConnect(params = {}) {
        return $axios.post(`/datasource/connect`, params)
    },
    /**
     * @description 获取表的具体字段信息
     * @param {string} type 类型
     * @param {Object} [params={}] 请求参数
     * @returns {Object} 字段详细信息
     */
    getTableFieldDetail(params = {}) {
        return $axios.post(`/datasource/read/field`, params)
    },
    /**
     * @description 读取数据库的表
     * @param {string} type 类型
     * @param {Object} params 请求参数
     * @param {string} params.databaseName 数据库名称
     * @param {string} params.sourceId 数据源id
     * @returns
     */
    getTableList(params) {
        return $axios.post(`/datasource/read/teble`, params)
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
        return $axios.post('/datasource/table/save/table', params)
    },
    /**
     * @description 保存修改表字段
     * @param {Object} [params={}] 请求参数
     * @returns
     */
    saveTableField(params = {}) {
        return $axios.post('/datasource/field/save/field', params)
    },
    /**
     * @description 全部抽取
     * @param {String} url  请求地址
     * @param {Object} [params={}] 请求参数
     * @returns
     */
    actionExtract(url, params = {}) {
        return $axios.post(url, params)
    },
    /**
     * @description 上传文件
     * @param {Object} file 文件
     */
    actionUploadFile(data) {
        return $axios({
            method: 'post',
            headers: { 'Content-Type': 'multipart/form-data' },
            url: '/datasource/excel/read',
            data
        })
    },
    /**
     * @description 读取数据源的文件列表
     * @param {string} id 请求参数
     * @returns
     */
    getModelFileList(id) {
        return $axios.get(`/datasource/database/find/${id}`)
    },
    /**
     * @description 查询文件下的表格
     * @param {String} databaseId 文件id
     */
    getFileSheetList(databaseId) {
        return $axios.get('/datasource/table/list/bydatabaseid?databaseId=' + databaseId)
    },
    /**
     * @description 查询文件下的表格内容
     * @param {String} tableId 文件id
     */
    getFileTableInfo(tableId) {
        return $axios.get('/datasource/excel/presto/read?tableId=' + tableId)
    },
    /**
     * @description 保存excel数据源
     * @param {Object} data body对象
     * @param {String} 'sourceSaveInput.name' 名称
     * @param {String} 'sourceSaveInput.type' 数据源类型
     * @param {Array[string]} 'sourceSaveInput.databasesIdList' 删除的文件id
     * @param {Array[file]} 'sourceSaveInput.fileList' 文件列表
     * @param {String} 'sourceSaveInput.parentId' parentId
     * @param {String} 'sourceSaveInput.id' id
     */
    saveExcelInfo(data) {
        return $axios({
            method: 'post',
            headers: { 'Content-Type': 'multipart/form-data' },
            url: '/datasource/excel/save',
            data
        })
    },
    /**
     * @description 查询文件下的表格内容
     * @param {Object} params
     * @param {String} params.sourceId 数据源id
     */
    getModelRecord(params) {
        return $axios.post('/datasource/record', params)
    }
}

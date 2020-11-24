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
     * @description 上传excel文件
     * @param {Object} file 文件
     */
    actionUploadExcelFile(data) {
        return $axios({
            method: 'post',
            headers: { 'Content-Type': 'multipart/form-data' },
            url: '/datasource/excel/read',
            data
        })
    },
    /**
     * @description 上传excel文件
     * @param {Object} data 参数
     * @param {Object} data.file 文件
     * @param {String} data.delimiter 分隔符
     */
    actionUploadCsvFile(data) {
        return $axios({
            method: 'post',
            headers: { 'Content-Type': 'multipart/form-data' },
            url: '/datasource/csv/read',
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
    getExcelFileTableInfo(tableId) {
        return $axios.get('/datasource/excel/presto/read?tableId=' + tableId)
    },
    /**
     * @description 保存excel数据源
     * @param {Object} data body对象
     * @param {Array[string]} 'databasesIdList' 删除的文件id
     * @param {Array[file]} 'fileList' 文件列表
     * @param {String} 'sourceSaveInput.name' 名称
     * @param {String} 'sourceSaveInput.type' 数据源类型
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
     * @param {Object} data 参数
     * @param {String} data.tableId 表id
     * @param {String} data.delimiter 分隔符
     */
    getCsvFileTableInfo(data) {
        // return $axios.get('/datasource/csv/presto/read?tableId=' + tableId)
        return $axios({
            method: 'post',
            headers: { 'Content-Type': 'multipart/form-data' },
            url: '/datasource/csv/read',
            data
        })
    },
    /**
     * @description 保存excel数据源
     * @param {Object} data body对象
     * @param {Array[file]} 'fileList' 文件列表
     * @param {Array[string]} 'delDatabasesIdList' 删除的文件id
     * @param {Array[string]} 'delimiter' 分隔符
     * @param {String} 'sourceSaveInput.name' 名称
     * @param {String} 'sourceSaveInput.type' 数据源类型
     * @param {String} 'sourceSaveInput.parentId' parentId
     * @param {String} 'sourceSaveInput.id' id
     */
    saveCsvInfo(data) {
        return $axios({
            method: 'post',
            headers: { 'Content-Type': 'multipart/form-data' },
            url: '/datasource/csv/save',
            data
        })
    },
    /**
     * @description 获取操作记录
     * @param {Object} params
     * @param {String} params.sourceId 数据源id
     */
    getModelRecord(params) {
        return $axios.post('/datasource/record', params)
    },
    /**
     * @description 获取操作记录
     * @param {Array} params
     * @param {String} id 数据源id
     */
    getIncreaseFields(params) {
        return $axios.post('/datasource/field/find/increase', params)
    },
    /**
     * @description 获取定时任务列表
     * @param {Object} params
     * @param {String} params.name 数据源名称
     * @param {String} params.target 当前表id
     */
    getRegularList(params) {
        return $axios.get('/datasource/schedule/list', { params })
    },
    /**
     * @description 获取定时任务详情
     * @param {String} id id
     */
    getRegularInfo(id) {
        return $axios.get('/datasource/schedule/' + id)
    },
    /**
     * @description 新增定时任务
     * @param {Object} params
     * @param {String} params.name 数据源名称
     * @param {String} params.target 数据源id
     * @param {String} params.extractType 抽取类型,0-全量抽取,1-增量抽取
     * @param {String} params.isRepeat 0-只执行一次，1-重复执行
     * @param {String} params.frequency 1-小时,2-天3-周,4-月
     * @param {String} params.interval 间隔时间
     * @param {String} params.gmtStart 开始时间
     * @param {String} params.gmtEnd 结束时间
     */
    addRegularInfo(params) {
        return $axios.post('/datasource/schedule', params)
    },
    /**
     * @description 修改定时任务
     * @param {Object} params
     * @param {String} params.name 数据源名称
     * @param {String} params.target 数据源id
     * @param {String} params.extractType 抽取类型,0-全量抽取,1-增量抽取
     * @param {String} params.isRepeat 0-只执行一次，1-重复执行
     * @param {String} params.frequency 1-小时,2-天3-周,4-月
     * @param {String} params.interval 间隔时间
     * @param {String} params.gmtStart 开始时间
     * @param {String} params.gmtEnd 结束时间
     */
    putRegularInfo(params) {
        return $axios.put('/datasource/schedule', params)
    },
    /**
     * @description 删除定时任务
     * @param {String} id
     */
    deleRegularInfo(id) {
        return $axios.delete('/datasource/schedule/delete/' + id)
    },
    /**
     * @description 获取抽取记录
     * @param {String} id 该数据库下任一张表的id
     */
    getExtractLogList(id) {
        return $axios.get('/datasource/schedule/getProgressInfo/' + id)
    }
}

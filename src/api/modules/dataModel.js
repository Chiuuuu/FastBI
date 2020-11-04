import $axios from '@/axios'

export default {
  /**
   * @description 新建状态, 关键字查询数据源列表
   * @returns
   */
  getSearchDataSourceList() {
    return $axios.post(`/model/datamodel/addModelDatamodel`)
  },
  /**
   * @description 新建状态, 获取一个空的数据模型
   * @returns
   */
  getAddModelDatamodel() {
    return $axios.post(`/model/datamodel/addModelDatamodel`)
  },
  /**
   * @description 编辑状态, 根据数据源id获取数据库
   * @param {string | number} id 数据源id
   * @param {string | number} tableId 最后一个节点对应的数据表id
   * @returns
   */
  getDataBaseDataInfoList(id, tableId) {
    return $axios.get(`/model/datamodel/getDataBaseDataInfoList/${id}/${tableId || '1'}`)
  },
  /**
   * @description 编辑状态, 根据模型id获取模型信息
   * @param {string | number} id 数据源id
   * @returns
   */
  getDataModelDetailInfo(id) {
    return $axios.get(`/model/datamodel/getDataModelDetailInfo/${id}`)
  },
  /**
   * @description 编辑状态, 根据模型id获取数据源
   * @param {string | number} id 模型id
   * @returns
   */
  getDataSourceList(id) {
    return $axios.get(`/model/datasource/list?dataModelId=${id}`)
  },
  /**
   * @description 编辑状态，获取左侧菜单列表
   * @param {string | number} id 表id
   * @returns
   */
  getTableListById(id) {
    return $axios.get(`/model/table/getDataSourceTableInfo/${id}`)
  },
  /**
   * @description 编辑状态，获取左右两表的关系
   * @param {Object} params 请求参数
   * @returns
   */
  getBetweenJoin(params) {
    return $axios.post('/model/join/getTableConfigInfo', params)
  },
  /**
   * @description 保存模型关联数据源
   * @param {Object} params 请求参数
   * @returns
   */
  saveDatasource(params) {
    return $axios.post('/model/datasource', params)
  },
  /**
   * @description 获取表的维度信息
   * @param {Object} tables 请求参数
   * @returns
   */
  getPivotschemaByTables(tables) {
    return $axios.post('/model/pivotschema/getDataSourceTableInfo', tables)
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
   * @returns
   */
  addModel(id) {
    return $axios.get(`/datamodel/datamodelInfo/createDataModelInfo/${id}`)
  },
  /**
   * @description 保存数据模型
   * @param {Object} params 请求参数
   * @returns
   */
  saveModel(params) {
    return $axios.put('/model/datamodel/updateDataModelDetailInfo', params)
  },
  /**
   * @description 查看宽表
   * @param {Object} params 请求体
   * @param {Object} params.config 配置
   * @param {Object} params.pivotSchema 维度度量等参数
   * @returns
   */
  getWidthTableInfo(params) {
    return $axios.post('/model/datamodel/getWideTableInfo', params)
  },
  /**
   * 导出宽表数据
   * @param {Object} data
   * @returns
   */
  actionDownloadfile(data) {
    return $axios({
      method: 'post',
      url: 'model/datamodel/export',
      responseType: 'blob', // 注意类型
      data
    })
  },
  /**
   * @description 两表之间的关联列表
   * @param {String|Number} leftTableId
   * @param {String|Number} rightTableId
   * @returns
   */
  getDataSourceFieldDataInfoList(leftTableId, rightTableId) {
    return $axios.get(`/model/datamodel/getDataSourceFieldDataInfoList/${leftTableId}/${rightTableId}`)
  },
  /**
   * 保存自定义SQL
   * @param {Object} params
   * @returns
   */
  saveCustomSql(params) {
    return $axios.post(`model/custom/excute`, params)
  },
  /**
   * 删除自定义SQL
   * @param {Object} params
   * @param {String} params.name
   * @param {Number} params.tableId
   * @returns
   */
  deleCustomSql(params) {
    return $axios.put('model/custom/remove', params)
  },
  /**
   * 获取自定义SQL信息
   * @param {*} id
   * @returns
   */
  getCustomSqlDetail(id) {
    return $axios.get(`model/custom/${id}`)
  },
  /**
   * 校验Sql
   * @param {*} params
   * @returns
   */
  actionValidateCustomSql(params) {
    return $axios.post(`model/custom/checkCustomizeSQL`, params)
  }
}

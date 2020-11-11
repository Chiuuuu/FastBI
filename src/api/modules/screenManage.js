import $axios from '@/axios'

const screenManage = {
  /**
   * @description 新建文件夹
   * @param {Object} params 请求参数
   * @returns
   */
  addFloder(params) {
    return $axios.post('/screen/catalog', params)
    // return $axios.post('/screen/folder', params)
  },
  /**
   * @description 文件夹列表
   * @param {Object} params 请求参数
   * @returns
   */
  getFolderList(params) {
    return $axios.get('/screen/catalog/listScreenTree', params)
    // return $axios.get('/screen/folder/list', params)
  },
  /**
   * @description 删除文件夹
   * @param {*} params
   * @returns
   */
  deleFolder(id) {
    return $axios.get(`/screen/catalog/${id}`)
    // return $axios.get('/screen/folder/screenDelete', params)
  },
  /**
   * @description 修改文件夹
   * @param {*} params
   * @returns
   */
  putFolder(params) {
    return $axios.put('/screen/folder', params)
  },
  /**
   * @description 保存大屏
   * @param {*} params
   * @returns
   */
  saveScreen(params) {
    return $axios.post('/screen/bigscreen/save', params)
  },
  /**
   * @description 大屏详细信息
   * @param {*} id
   * @returns
   */
  getScreenDetailById(id) {
    return $axios.get(`/screen/bigscreen/${id}`)
    // return $axios.get(`/screen/data/${id}`)
  },
  /**
   * @description 刷新大屏
   * @param {*} params
   * @returns
   */
  actionRefreshScreen(params) {
    return $axios.get(`/screen/bigscreen/refresh`, params)
  },
  /**
   * @description 数据模型目录
   * @returns
   */
  getCatalogList() {
    return $axios.get(`/model/catalog/list/2`)
  },
  /**
   * @description 数据模型--维度、度量列表
   * @param {*} id
   * @returns
   */
  getPivoSchemaList(dataModelId, screenId, type) {
    // return $axios.get(`/model/pivotschema/selectModelPivotschemaListByRole/${id}`)
    return $axios.get(`/screen/pivotschema/selectModelPivotschemaListByRole/${dataModelId}/${screenId}/${type}`)
  },
  /**
   * @description 根据维度度量获取数据
   * @param {*} params
   * @returns
   */
  getData(params) {
    return $axios.post('/screen/graph/getData', params)
  },
  /**
   *
   * @description 上传图片
   * @param {*} params
   * @returns
   */
  actionUploadImage(params) {
    return $axios.post('/screen/bigscreen/avatar', params)
  },
  /**
   * @description 保存当前大屏选中的数据模型
   * @param {*} params
   * @returns
   */
  screenModuleSave(params) {
    return $axios.get('/screen/pivotschema/ScreenModuleSave', params)
  },
  /**
   * 数据模型维度度量转换
   */
  screenModuleTransform(params) {
    return $axios.post('/screen/pivotschema/ScreenModuleTransform', params)
  }
}

export default screenManage

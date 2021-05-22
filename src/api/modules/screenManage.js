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
   * @description 新增大屏tab页签
   * @param {*} params
   * @returns
   */
  addScreenTab(params) {
    return $axios.post('/screen/bigscreen/addScreenTab', params)
  },
  /**
   * @description 查询大屏tab页签
   * @param {*} params
   * @returns
   */
  getScreenTabs(id) {
    return $axios.get(`/screen/bigscreen/screenTabList/${id}`)
  },
  /**
   * @description 重命名大屏tab页签
   * @param {*} params
   * @returns
   */
  renameScreenTab(params) {
    return $axios.post('/screen/bigscreen/editScreenTab', params)
  },
  /**
   * @description 复制大屏tab页签
   * @param {*} params
   * @returns
   */
  copyScreenTab(params) {
    return $axios.post('/screen/bigscreen/copyScreenTab', params)
  },
  /**
   * @description 删除大屏tab页签
   * @param {*} params
   * @returns
   */
  deleteScreenTab(id) {
    return $axios.delete(`/screen/bigscreen/removeScreenTab/${id}`)
  },
  /**
   * @description 调整大屏tab页签顺序
   * @param {*} params
   * @returns
   */
  orderScreenTab(params) {
    return $axios.post(`/screen/bigscreen/updateScreenTabOrder`, params)
  },
  /**
   * @description 获取分享短链接
   * @param {*} params
   * @returns
   */
  getScreenLink(screenId) {
    return $axios.get(`/screen/bigscreen/getShortUrl/${screenId}`)
  },
  /**
   * @description 查看发布信息
   * @param {*} params
   * @returns
   */
  showScreenRelease(screenId) {
    return $axios.get(`/screen/bigscreen/getScreenShare/${screenId}`)
  },
  /**
   * @description 发布大屏
   * @param {*} params
   * @returns
   */
  releaseScreen(params) {
    return $axios.post('/screen/bigscreen/shareScreen', params)
  },
  /**
   * @description 重新发布大屏
   * @param {*} params
   * @returns
   */
  reShareScreen(params) {
    return $axios.post('/screen/bigscreen/reShareScreen', params)
  },
  /**
   * @description 撤销发布大屏
   * @param {*} screenId
   * @returns
   */
  delShareScreen(screenId) {
    return $axios.delete(`/screen/bigscreen/removeScreenShare/${screenId}`)
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
   * @description 新建大屏
   * @param {*} params
   * @returns
   */
  addScreen(params) {
    return $axios.post('/screen/bigscreen/addScreen', params)
  },
  /**
   * @description 复制大屏
   * @param {*} params
   * @returns
   */
  copyScreen(screenId) {
    return $axios.get(`/screen/bigscreen/copyScreen/${screenId}`)
  },
  /**
   * @description 保存大屏new
   * @param {*} params
   * @returns
   */
  saveScreenNew(params) {
    return $axios.post('/screen/bigscreen/saveScreen', params)
  },
  /**
   * @description 保存图表
   * @param {*} params
   * @returns
   */
  addChart(params) {
    return $axios.post('/screen/graph/addScreenGraph', params)
  },
  /**
   * @description 更新图表
   * @param {*} params
   * @returns
   */
  updateChart(params) {
    return $axios.post('/screen/graph/updateScreenGraph', params)
  },
  /**
   * @description 删除图表
   * @param {*} params
   * @returns
   */
  deleteChart(params) {
    return $axios.post('/screen/graph/delScreenGraph', params)
  },
  /**
   * @description 批量更新图表
   * @param {*} params
   * @returns
   */
  saveAllChart(params) {
    return $axios.post('/screen/graph/updateScreenGraphs', params)
  },
  /**
   * @description 大屏详细信息
   * @param {*} id
   * @param {*} tabId
   * @returns
   */
  getScreenDetailById(id, tabId) {
    return $axios.get(`/screen/bigscreen/${id}/${tabId}`)
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
    return $axios.get(
      `/screen/pivotschema/selectModelPivotschemaListByRole/${dataModelId}/${screenId}/${type}`
    )
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
   * @description 度量原始数据类型是否数值类型
   * @param {*} params
   * @returns
   */
  getMeasureCheck(pivotschemaId) {
    return $axios.get(`/screen/graph/measureCheck/${pivotschemaId}`)
  },
  /**
   * @description 根据数据筛选数据列表
   * @param {*} params
   * @returns
   */
  getDataPick(params) {
    return $axios.post('/screen/graph/getLimitData', params)
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
  },
  // 图表推送
  /**
   * 选择推送人下拉框数据
   */
  getPusherList(projectId) {
    return $axios.get(`/business/editRoleUser/listForProjectUsers/${projectId}`)
  },
  /**
   * 图表推送信息记录
   */
  savePushData(params) {
    return $axios.post(`/screen/graph/push/add`, params)
  },
  /**
   * 列表推送信息列表查询创 建
   */
  getPushDataList(projectId, userId) {
    return $axios.get(`/screen/graph/push/list/${projectId}/${userId}`)
  },
  /**
   * 阅后即焚（逻辑删除推送表记录）
   */
  delReadData(id) {
    return $axios.delete(`/screen/graph/push/${id}`)
  }
}

export default screenManage

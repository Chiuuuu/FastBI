import $axios from '@/axios'
export default {
  /**
   * @description 标签列表
   * @param {Object} [params={}] 请求参数
   * @param {String} params.current 当前页
   * @param {String} params.pageSize 单页数量
   * @param {String} params.createStart 创建开始
   * @param {String} params.createEnd 创建结束
   * @param {String} params.modStart 修改开始
   * @param {String} params.modEnd 修改结束
   * @param {String} params.searchWord 输入框值
   * @param {Array} params.searchStatus 修改结束
   * @returns
   */
  getLabelList(params = {}) {
    return $axios.post(`/tag/list`, params)
  },
  /**
   * @description 新建标签
   * @param {Object} [params={}] 请求参数
   * @param {String} params.name 标签名
   * @param {String} params.description 标签描述
   * @param {String} params.version 版本号
   * @returns
   */
  addLabel(params = {}) {
    return $axios.post(`/tag/insert`, params)
  },
  /**
   * @description 查询标签信息
   * @param {String} params.version 版本号
   * @returns
   */
  getLabel(id) {
    return $axios.get(`/tag/${id}`)
  },
  /**
   * @description 更新标签
   * @param {Object} [params={}] 请求参数
   * @param {String} params.id 标签id
   * @param {String} params.name 标签名
   * @param {String} params.description 标签描述
   * @param {String} params.version 版本号
   * @returns
   */
  putLabel(params = {}) {
    return $axios.post(`/tag/update`, params)
  },
  /**
   * @description 删除标签
   * @param {Object} [params={}] 请求参数
   * @param {String} params.id 标签id
   * @param {String} params.version 标签id
   * @returns
   */
  deleLabel(params = {}) {
    return $axios.post(`/tag/delete`, params)
  },
  /**
   * @description 下线标签
   * @param {Object} [params={}] 请求参数
   * @param {String} params.id 标签id
   * @param {String} params.version 标签id
   * @returns
   */
  actionCloseLabel(params = {}) {
    return $axios.post(`/tag/closeTag`, params)
  },
  /**
   * @description 审核/驳回标签
   * @param {Object} [params={}] 请求参数
   * @param {String} params.id 标签id
   * @param {Boolean} params.accept 审核/驳回
   * @returns
   */
  putLabelState(params = {}) {
    return $axios.post(`/tag/updateTagState`, params)
  },
  /**
   * @description 审核记录列表
   * @param {Object} [params={}] 请求参数
   * @param {String} params.current 当前页
   * @param {String} params.pageSize 单页数量
   * @param {String} params.name 标签名字
   * @returns
   */
  getExamLogList(params = {}) {
    return $axios.post(`/tagRecord`, params)
  },
  /**
   * @description 查看标签记录
   * @param {String} id 标签id
   * @returns
   */
  getLabelRecord(id) {
    return $axios.get(`/tagRecord/${id}`)
  },
  /**
   * @description 查看标签评论记录
   * @param {Object} [params={}] 请求参数
   * @param {String} params.current 当前页
   * @param {String} params.pageSize 单页数量
   * @param {String} params.id 标签id
   * @returns
   */
  getLabelCommentList(params = {}) {
    return $axios.post(`/tagComment/list`, params)
  },
  /**
   * @description 插入标签评论
   * @param {Object} [params={}] 请求参数
   * @param {String} params.tagId 标签id
   * @param {String} params.content 评论内容
   * @returns
   */
  addLabelComment(params = {}) {
    return $axios.post(`/tagComment`, params)
  },
  /**
   * @description 查看标签版本记录
   * @param {Object} [params={}] 请求参数
   * @param {String} params.current 当前页
   * @param {String} params.pageSize 单页数量
   * @param {String} params.id 标签id
   * @returns
   */
  getLabelVersionList(params = {}) {
    return $axios.post(`/tag/versions`, params)
  },
  /**
   * @description 标签版本比对
   * @param {Array} [params=[{}]] 请求参数
   * @param {String} params.id 标签id
   * @param {String} params.version 版本
   * @returns
   */
  actionLabelCompare(params = []) {
    return $axios.post(`/tag/tagCompare`, params)
  },
  /**
   * @description 模型关联标签
   * @param {Array} [params=[{}]] 请求参数
   * @param {String} params.tagId 标签id
   * @param {String} params.modelId 模型id
   * @returns
   */
  actionLabelRelateModel(params = []) {
    return $axios.post(`/modelTag/insert`, params)
  },
  /**
   * @description 删除模型关联标签
   * @param {Array} [params=[{}]] 请求参数
   * @param {String} params.tagId 标签id
   * @param {String} params.modelId 模型id
   * @returns
   */
  deleLabelRelateModel(params = []) {
    return $axios.post(`/modelTag/delete`, params)
  },
  /**
   * @description 查询模型标签
   * @param {String} id 标签id
   * @returns
   */
  getModelLabel(id) {
    return $axios.get(`/modelTag/${id}`)
  }
}

import $axios from '@/axios'
export default {
  /**
   * @description 获取字典目录列表
   */
  getDictionaryMenu() {
    return $axios.get('/dataDir/folderList')
  },
  /**
   * @description 新建字典目录/文件
   * @param {Object} [params={}] 请求参数
   * @param {String} params.parentId 文件夹id
   * @param {String} params.type 模块type 6
   * @param {String} params.fileType 0: 文件夹 1: 文件
   * @param {String} params.name 名称
   */
  addDictionaryMenu(params = {}) {
    return $axios.post('/dataDir/addFolder', params)
  },
  /**
   * @description 修改字典目录
   * @param {Object} [params={}] 请求参数
   * @param {String} params.parentId 文件夹id
   * @param {String} params.id 文件夹id
   * @param {String} params.name 名称
   * @returns
   */
  putDictionaryMenu(params = {}) {
    return $axios.post(`/dataDir/updateFolder`, params)
  },
  /**
   * @description 修改字典目录
   * @param {String} id 文件夹id
   * @returns
   */
  deleDictionaryMenu(id) {
    return $axios.get(`/dataDir/delFolder/${id}`)
  },
  /**
   * @description 字典列表
   * @param {Object} [params={}] 请求参数
   * @param {String} params.current 当前页
   * @param {String} params.pageSize 单页数量
   * @param {String} params.dictName 输入框值
   * @param {Array} params.catalogId 菜单id
   * @returns
   */
  getDictionaryList(params = {}) {
    return $axios.post('/dataDir/list', params)
  },
  /**
   * @description 新建字典
   * @param {Object} [params={}] 请求参数
   * @param {String} params.catalogId 菜单id
   * @param {String} params.dictName 代码名称
   * @param {String} params.dictValue 代码
   */
  addDataDictionary(params = {}) {
    return $axios.post('/dataDir/insert', params)
  },
  /**
   * @description 更新字典
   * @param {Object} [params={}] 请求参数
   * @param {String} params.id 菜单id
   * @param {String} params.dictName 代码名称
   * @param {String} params.dictValue 代码
   * @returns
   */
  putDataDictionary(params = {}) {
    return $axios.post('/dataDir/update', params)
  },
  /**
   * @description 删除标签
   * @param {Array} ids
   * @returns
   */
  deleDataDictionary(ids) {
    return $axios.post(`/dataDir/del`, ids)
  }
}

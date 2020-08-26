import $axios, {
  requestGet,
  requestPost2,
  requestPut
} from '../api_request'

const screenManage = {
  /**
 * 新建文件夹
 * @param {*} params
 */
  folderAdd(params) {
    return requestPost2('/admin/dev-api/screen/folder', params)
  },
  /**
   * 文件夹列表
   *
   */
  folderList() {
    return requestGet('/admin/dev-api/screen/folder/list')
  },
  /**
   * 删除文件夹
   */
  folderDel(params) {
    return requestGet('/admin/dev-api/screen/folder/screenDelete', params)
  },
  /**
   * 修改文件夹
   */
  folderput(params) {
    return requestPut('/admin/dev-api/screen/folder', params)
  },
  /**
   * 保存大屏
   * @param {*} params
   */
  screenSave(params) {
    return requestPost2('/admin/dev-api/screen/data/save', params)
  }
}

export default screenManage

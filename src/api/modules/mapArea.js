import $axios from '@/axios'
export default {
  /**
   * @description 获取分公司列表
   */
  getCompanyList() {
    return $axios.get(`/zone/headOfficeList`)
  },
  /**
   * @description 获取片区列表
   * @param {Object} [params={}] 请求参数
   * @param {Object} params.name 分公司名称
   */
  getAreaList(params = {}) {
    return $axios.post(`/zone/sectionList`, params)
  },
  /**
   * @description 获取片区点位
   * @param {Object} [params={}] 请求参数
   * @param {Object} params.headOffice 分公司名称
   * @param {Object} params.section 片区名称
   * @returns
   */
  getGridList(params = {}) {
    return $axios.post(`/zone/allList`, params)
  },
  /**
   * @description 获取楼盘列表
   * @param {Object} [params={}] 请求参数
   * @param {Object} params.grid 网格名称
   * @returns
   */
  getBuildingList(params = {}) {
    return $axios.post('/zone/allCommunityList', params)
  },
  /**
   * @description 获取片区配置列表
   * @param {Object} [params={}] 请求参数
   * @param {Object} params.name 分公司名称
   * @returns
   */
  getAreaSettingList(params = {}) {
    return $axios.post('/zoneInfo/list', params)
  },
  /**
   * @description 添加绘制片区
   * @param {Object} [params={}] 请求参数
   * @param {Object} params.name 片区名称
   * @param {Object} params.setting 配置
   * @returns
   */
  addAreaSetting(params = {}) {
    return $axios.post('/zoneInfo/add', params)
  },
  /**
   * @description 更新绘制片区
   * @param {Object} [params={}] 请求参数
   * @param {Object} params.id 片区id
   * @param {Object} params.name 片区名称
   * @param {Object} params.setting 配置
   * @returns
   */
  updateAreaSetting(params = {}) {
    return $axios.post('/zoneInfo/update', params)
  },
  /**
   * @description 删除绘制片区
   * @param {Object} id 片区id
   * @returns
   */
  deleteAreaSetting(id) {
    return $axios.get(`/zoneInfo/del/${id}`)
  },
  /**
   * @description 获取片区表
   * @param {Object} [params={}] 请求参数
   * @returns
   */
  getFieldList(params = {}) {
    return $axios.post('/zone/dataList', params)
  },
  /**
   * @description 更新片区表数据(一行)
   * @param {Object} [params={}] 请求参数
   * @returns
   */
  updateFields(params = {}) {
    return $axios.post('/zone/data/edit', params)
  },
  /**
   * @description 角色配置中获取3级树结构
   * @returns
   */
  getRoleAreaTree() {
    return $axios.get('/zone/areaManagementConfigurationList')
  }
}

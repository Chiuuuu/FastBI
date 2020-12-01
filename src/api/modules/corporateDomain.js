import $axios from '@/axios'

export default {
    /** --------------------------------人员管理-------------------------------------- */
    /**
     * @description 查询当前项目人员列表
     * @returns
     */
    getPersonList() {
        return $axios.post('/business/user/list')
    },
    /**
     * @description 获取当前项目人员信息
     * @param {String} id 请求参数
     * @returns
     */
    getPersonInfo(id) {
        return $axios.get('/business/user/getDomainUserInfo/' + id)
    },
    /**
     * @description 筛选查询当前项目人员列表
     * @returns
     */
    getPersonListByParams(params) {
        return $axios.post('/business/user/getUserListByParam', params)
    },
    /**
     * @description 添加用户
     * @returns
     */
    addPerson() {
        return $axios.get('/business/business/listRoleForProjectId')
    },
    /**
     * @description 根据用户名/姓名查询用户列表
     * @param {Object} params 请求参数
     * @param {String} params.keyword 输入的内容
     * @returns
     */
    getModalUserList(params) {
        return $axios.post('/business/user/matchUsers', params)
    },

    /**
     * @description 获取项目列表
     * @returns
     */
    getProjectList() {
      return $axios.get('/business/project/list')
    },

    /** ----------------------------部门------------------------------------- */
    /**
     * @description 获取部门列表
     * @returns
     */
    getDeptList() {
      return $axios.get('/business/department/list')
    },
    /**
     * @description 新增部门
     * @param {String} name 部门名称
     * @returns
     */
    addDept() {
      return $axios.post('/business/department/addDepartment', { name })
    },

    /** ----------------------------岗位------------------------------------- */
    /**
     * @description 获取岗位列表
     * @param {String} id 部门id
     * @returns
     */
    getPostList(id) {
      return $axios.get('/business/post/list/' + id)
    },
    /**
     * @description 新增岗位
     * @param {String} name 岗位名称
     * @returns
     */
    addPost() {
      return $axios.post('/business/post', { name })
    },
    /** ----------------------------项目管理------------------------------------- */
    /**
     * @description 获取项目列表
     * @param {Object} params 请求参数
     * @param {String} params.projectName 项目名称
     * @param {String} params.adminName 管理员名称
     */
    getProjectList(params) {
      return $axios.post(`/business/project/list`, params)
    },
    /**
     * @description 添加新项目
     * @param {Object} params
     * @param {Object} params.projectName 项目名称
     * @param {Object} params.projectDes  项目描述
     * @param {Object} params.adminList  管理员列表
     * @returns
     */
    addNewProject(params) {
      return $axios.post(`/business/project`, params)
    },
    /**
     * @description 编辑项目
     * @param {Object} params
     * @param {String | Number} params.projectId 项目id
     * @param {Object} params.projectName 项目名称
     * @param {Object} params.projectDes  项目描述
     * @param {Object} params.adminList  管理员列表
     * @returns
     */
    putProject(params) {
      return $axios.put(`/business/project`, params)
    },
    /**
     * @description 删除项目
     * @param {Number | String} projectId 项目id
     * @returns
     */
    deleProject(projectId) {
      return $axios.delete(`/business/project/${projectId}`)
    },
    /**
     * @description 获取管理员下拉列表
     * @returns
     */
    getAdminList() {
      return $axios.get(`/business/user/getUserInfoList`)
    },
    /**
     * @description 查看项目的用户
     * @param {String | Number} projectId 项目id
     * @returns
     */
    getUserByProject(projectId) {
      return $axios.get(`/business/project/getProjectUserName/${projectId}`)
    },
    /**
     * @description 
     * @param {String | Number} projectId 项目id
     * @returns
     */
    getProjectInfoById(projectId) {
      return $axios.get(`/business/project/getDomainProjectInfo/${projectId}`)
    }
}

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
    }
}

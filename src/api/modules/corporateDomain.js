import $axios from '@/axios'

export default {
    /** --------------------------------人员管理-------------------------------------- */
    /**
     * @description 查询当前项目人员列表
     * @returns
     */
    getUserList() {
        return $axios.post('/business/user/list')
    },
    /**
     * @description 获取当前项目人员信息
     * @param {String} id 请求参数
     * @returns
     */
    getUserInfo(id) {
        return $axios.get('/business/user/getDomainUserInfo/' + id)
    },
    /**
     * @description 筛选查询当前项目人员列表
     * @returns
     */
    getUserListByParams(params) {
        return $axios.post('/business/user/getUserListByParam', params)
    },
    /**
     * @description 添加用户
     * @returns
     */
    addUser(params) {
        return $axios.post('/business/user/add', params)
    },
    /**
     * @description 修改用户
     * @returns
     */
    updateUser(params) {
        return $axios.put('/business/user', params)
    },
    /**
     * @description 启用/禁用用户
     * @returns
     */
    actionEnableUser(params) {
        return $axios.post('/business/user/isEnableUser', params)
    },
    /**
     * @description 删除用户
     * @returns
     */
    deleUser(id) {
        return $axios.delete('/business/user/' + id)
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

    /** ----------------------------项目------------------------------------- */
    /**
     * @description 获取项目列表
     * @returns
     */
    getProjectList() {
      return $axios.get('/business/project/nameList')
    },
    /**
     * @description 根据关键字获取项目列表
     * @param {String} name 关键字
     * @returns
     */
    getProjectListByName(name) {
      return $axios.post('/business/project/list', { projectName: name })
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
     * @param {String} deptName 部门名称
     * @returns
     */
    addDept(deptName) {
      return $axios.post('/business/department/addDepartment', { deptName })
    },
    /**
     * @description 新增部门
     * @param {Object} params
     * @param {String} params.id 部门id
     * @param {String} params.name 部门名称
     * @returns
     */
    updateDept(params) {
      return $axios.put('/business/department', params)
    },
    /**
     * @description 删除部门
     * @param {String} id 部门id
     * @returns
     */
    deleDept(id) {
      return $axios.delete('/business/department/' + id)
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
     * @param {Object} params
     * @param {String} params.departmentId 部门id
     * @param {String} params.name 岗位名称
     * @returns
     */
    addPost(params) {
      return $axios.post('/business/post', params)
    },
    /**
     * @description 新增岗位
     * @param {Object} params
     * @param {String} params.departmentId 岗位id
     * @param {String} params.name 岗位名称
     * @returns
     */
    updatePost(params) {
      return $axios.put('/business/post', params)
    },
    /**
     * @description 删除部门
     * @param {String} id 部门id
     * @returns
     */
    delePost(id) {
      return $axios.delete('/business/post/' + id)
    },
    /** --------------------------------角色属性-------------------------------------- */
    /**
     * @description 获取角色属性列表
     * @param {Object} params
     * @returns
     */
    getPropList(params) {
      return $axios.post('/business/userAttr/list', params)
    },
    /**
     * @description 获取角色属性列表
     * @param {Object} params
     * @param {String} params.username
     * @param {String} params.name
     * @returns
     */
    getPropListByName(params) {
      return $axios.post('/business/userAttr/getAttrInfo', params)
    },
    /**
     * @description 修改用户角色属性
     * @param {Object} params
     * @param {String} params.headers
     * @param {String} params.rows
     * @returns
     */
    updateUserProp(params) {
      return $axios.put('/business/userAttr', params)
    }
}

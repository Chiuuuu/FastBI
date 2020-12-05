import $axios from '@/axios'

export default {
    /**
     * @description 查询当前项目用户列表
     * @param {Object} params 
     * @param {Number} params.roleId 角色id
     * @param {String} params.name 姓名
     * @param {String} params.username 用户名
     * @returns
     */
    getList(params) {
        return $axios.post(`/business/user/projectUserList`, params)
    },
    /**
     * @description 查询项目角色用户列表
     * @returns
     */
    getRoleList() {
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
     * @description 添加新用户
     * @param {Object} params 请求参数
     * @param {Array} params.roleId 角色
     * @param {Array} params.userIds 用户
     * @returns
     */
    addUser(params) {
        return $axios.post('/business/business/projectRoleAddUser', params)
    },
    /**
     * @description 删除用户
     * @param {Array | Number | String} id
     * @returns
     */
    deleUserById(id) {
        return $axios.delete(`/business/business/deleteUserRoles/${id}`)
    },
    /**
     * @description 更新，编辑用户
     * @param {Object} params
     * @returns
     */
    putUser(params) {
        return $axios.put(`/business/business/updateProjectUserRole`, params)
    },
    /**
     * @description 获取用户属性列表
     * @param {Object} params 请求参数
     * @param {String} params.username 用户名
     * @param {String} params.name 姓名
     * @returns
     */
    getUserPropsList(params) {
        return $axios.post(`/business/userAttrValue/attrList`, params)
    },

    /** ------------------------角色管理------------------------------ */
    /**
     * @description 获取角色详情
     * @param {Object} id 角色id
     * @returns
     */
    getRoleInfo(id) {
        return $axios.get('/business/role/' + id)
    },
    /**
     * @description 获取角色权限
     * @param {String} id 角色id
     * @returns
     */
    getRolePermission(id) {
        return $axios.get('/business/rolePrivilege/' + id)
    },
    /**
     * @description 新增角色
     * @param {Object} params 参数
     * @returns
     */
    addRole(params) {
        return $axios.post('/business/role/addRole', params)
    },
    /**
     * @description 获取角色下的用户列表
     * @param {String} roleId 角色id
     * @returns
     */
    getRoleUserInfo(roleId) {
        return $axios.get('/business/business/listForProjectRoleUsers/' + roleId)
    },
    /**
     * @description 为角色添加用户
     * @param {Object} params
     * @param {Array} params.userIds
     * @param {Array} params.roleIds
     * @returns
     */
    addRoleUser(params) {
        return $axios.post('/business/business/projectRoleAddUser', params)
    },
    /**
     * @description 为角色添加用户
     * @param {Array} id
     * @returns
     */
    deleRoleUser(id) {
        return $axios.delete('/business/business/' + id)
    },
    /**
     * @description 获取权限树
     * @param {Number | String} roleId 角色id
     * @param {Number} type 类型
     * @returns
     */
    getRoleTree(roleId, type) {
        return $axios.get(`/user/RoleResourcePrivilege/showRolePrivilege/${roleId}/${type}`)
    }
}

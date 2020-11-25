import dataAccessApi from '../../../api/modules/common'
const state = {
  roleMode: 'check',
  roleInfo: {}, // 角色信息
  roleId: 0, // 选中的菜单id
  parentId: 0, // 文件夹id
  menuList: []
}

const mutations = {
  SET_ROLEMODE(state, mode) {
    state.roleMode = mode
  },
  SET_ROLEID(state, id) {
    state.roleId = id
  },
  SET_ROLEINFO(state, info) {
    state.roleInfo = info
  },
  SET_PARENTID(state, id) {
    state.parentId = id
  },
  SET_MENULIST(state, list) {
    state.menuList = list
  }
}

const actions = {
  async getMenuList({
    commit
  }, vm) {
    const result = await dataAccessApi.getMenuList('/datasource/catalog/list/1')
    if (result.code === 200) {
      commit('SET_MENULIST', result.rows)
    } else {
      vm.$message.error(result.msg)
    }
  }
}

export default {
  namespaced: true, // 用于在全局引用此文里的方法时标识这一个的文件名
  state,
  mutations,
  actions
}
